import { Request, Response, NextFunction } from 'express'
import { SkincareAdvisorRequestBody } from '~/models/requests/Ai.requests'
import skincareAdvisorService from '~/services/ai.services'
import { wrapAsync } from '~/utils/handler'
import { geminiClient } from '~/constants/config'
import databaseService from '~/services/database.services'
import { Filter } from 'mongodb'
import Product from '~/models/schemas/Product.schema'
import { ProductState } from '~/constants/enums'
import logger from '~/utils/logger'

export const skincareAdviceController = wrapAsync(
  async (req: Request<unknown, unknown, SkincareAdvisorRequestBody>, res: Response, next: NextFunction) => {
    const result = await skincareAdvisorService.generateRoutine(req.body)

    if (result.info) {
      res.status(200).json({ message: result.info })
      return
    }

    res.status(200).json(result)
  }
)

export const chatStreamController = async (req: Request, res: Response, next: NextFunction) => {
  logger.info('🔄 Chat stream request received:', {
    message: req.body?.message,
    historyLength: req.body?.history?.length
  })

  try {
    const { message, history = [] } = req.body

    logger.debug('📝 Processing message:', message)
    logger.debug('📚 History length:', history.length)

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Cache-Control')

    logger.debug('🔧 SSE headers set')

    // Prepare messages for OpenAI
    const messages = [
      {
        role: 'system',
        content:
          'You are a skincare expert. Help users with their skin concerns. You can search for products in the database using the search_products tool. Respond in Vietnamese.'
      },
      ...history,
      { role: 'user', content: message }
    ]

    logger.debug('📨 Prepared messages for AI:', messages.length, 'messages')

    // Define tools
    const tools = [
      {
        type: 'function',
        function: {
          name: 'search_products',
          description: 'Search for products in the database by keyword',
          parameters: {
            type: 'object',
            properties: {
              keyword: {
                type: 'string',
                description: 'The keyword to search for in product names'
              }
            },
            required: ['keyword']
          }
        }
      }
    ]

    logger.debug('🛠️ Tools defined, creating stream...')

    const stream = await geminiClient.chat.completions.create({
      model: 'gemini-2.5-flash',
      messages,
      tools: tools as any,
      stream: true
    })

    logger.info('✅ Stream created successfully')

    let toolCalls: any[] = []
    let currentToolCall: any = null
    let chunkCount = 0

    for await (const chunk of stream) {
      chunkCount++
      const delta = chunk.choices[0]?.delta

      logger.debug(`📦 Chunk ${chunkCount}:`, {
        hasContent: !!delta?.content,
        contentLength: delta?.content?.length,
        hasToolCalls: !!delta?.tool_calls,
        finishReason: chunk.choices[0]?.finish_reason
      })

      if (delta?.content) {
        logger.debug('📝 Sending text content:', delta.content)
        // Send text content
        res.write(`data: ${JSON.stringify({ type: 'text', content: delta.content })}\n\n`)
      }

      if (delta?.tool_calls) {
        logger.debug('🔧 Processing tool calls:', delta.tool_calls.length)
        for (const toolCall of delta.tool_calls) {
          if (toolCall.index !== undefined) {
            if (currentToolCall) {
              toolCalls.push(currentToolCall)
            }
            currentToolCall = {
              id: toolCall.id,
              function: {
                name: toolCall.function?.name,
                arguments: toolCall.function?.arguments || ''
              },
              type: toolCall.type
            }
          } else {
            if (currentToolCall && toolCall.function?.arguments) {
              currentToolCall.function.arguments += toolCall.function.arguments
            }
          }
        }
      }

      if (chunk.choices[0]?.finish_reason === 'tool_calls') {
        logger.info('🛑 Finish reason: tool_calls, breaking stream')
        if (currentToolCall) {
          toolCalls.push(currentToolCall)
        }
        break
      }
    }

    logger.info('🔄 Stream processing complete, tool calls found:', toolCalls.length)

    // Execute tool calls
    for (const toolCall of toolCalls) {
      logger.info('⚡ Executing tool call:', toolCall.function.name)
      if (toolCall.function.name === 'search_products') {
        const args = JSON.parse(toolCall.function.arguments)
        const keyword = args.keyword

        logger.debug('🔍 Searching products with keyword:', keyword)

        const filter: Filter<Product> = { state: ProductState.ACTIVE }
        if (keyword) {
          filter.name_on_list = { $regex: keyword, $options: 'i' }
        }

        const products = await databaseService.products.find(filter).limit(5).toArray()
        logger.info('📊 Found products:', products.length)

        const toolResult = {
          type: 'tool_call',
          tool_call_id: toolCall.id,
          name: toolCall.function.name,
          result: products.map((p) => ({
            id: p._id.toString(),
            name: p.name_on_list,
            price: p.price_on_list,
            image: p.image_on_list
          }))
        }

        logger.debug('📤 Sending tool result')
        res.write(`data: ${JSON.stringify(toolResult)}\n\n`)

        // Continue conversation with tool result
        messages.push({
          role: 'assistant',
          content: null,
          tool_calls: [toolCall]
        })

        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(
            products.map((p) => ({
              id: p._id.toString(),
              name: p.name_on_list,
              price: p.price_on_list,
              image: p.image_on_list
            }))
          )
        })

        logger.debug('🔄 Creating continuation stream')
        const continueStream = await geminiClient.chat.completions.create({
          model: 'gemini-2.5-flash',
          messages,
          stream: true
        })

        let continueChunkCount = 0
        for await (const chunk of continueStream) {
          continueChunkCount++
          const delta = chunk.choices[0]?.delta
          logger.debug(`📦 Continue chunk ${continueChunkCount}:`, { hasContent: !!delta?.content })
          if (delta?.content) {
            logger.debug('📝 Sending continuation text:', delta.content)
            res.write(`data: ${JSON.stringify({ type: 'text', content: delta.content })}\n\n`)
          }
        }
        logger.info('✅ Continuation stream complete')
      }
    }

    logger.info('🏁 Sending end event')
    res.write(`data: ${JSON.stringify({ type: 'end' })}\n\n`)
    res.end()
  } catch (error) {
    logger.error('❌ Chat stream error:', error)
    res.write(`data: ${JSON.stringify({ type: 'error', message: 'An error occurred' })}\n\n`)
    res.end()
  }
}
