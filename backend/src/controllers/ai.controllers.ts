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

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Cache-Control')

    logger.debug('🔧 SSE headers set')

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

    const toolCallMap = new Map<number, any>()
    let chunkCount = 0

    for await (const chunk of stream) {
      chunkCount++
      const delta = chunk.choices[0]?.delta

      logger.debug(
        {
          hasContent: !!delta?.content,
          contentLength: delta?.content?.length,
          hasToolCalls: !!delta?.tool_calls,
          finishReason: chunk.choices[0]?.finish_reason
        },
        `📦 Chunk ${chunkCount}`
      )

      if (delta?.content) {
        logger.debug('📝 Sending text content:', delta.content)
        res.write(`data: ${JSON.stringify({ type: 'text', content: delta.content })}\n\n`)
      }

      if (delta?.tool_calls) {
        logger.debug({ count: delta.tool_calls.length }, '🔧 Processing tool calls')
        for (const toolCallDelta of delta.tool_calls) {
          const index = toolCallDelta.index ?? 0
          const existing = toolCallMap.get(index) || {
            id: toolCallDelta.id,
            type: toolCallDelta.type,
            function: {
              name: toolCallDelta.function?.name,
              arguments: ''
            }
          }

          if (toolCallDelta.id) {
            existing.id = toolCallDelta.id
          }

          if (toolCallDelta.type) {
            existing.type = toolCallDelta.type
          }

          if (toolCallDelta.function?.name) {
            existing.function.name = toolCallDelta.function.name
          }

          if (toolCallDelta.function?.arguments) {
            existing.function.arguments = (existing.function.arguments || '') + toolCallDelta.function.arguments
          }

          toolCallMap.set(index, existing)
          logger.debug(
            {
              index,
              raw: toolCallDelta,
              accumulatedName: existing.function.name,
              argumentLength: existing.function.arguments?.length || 0
            },
            '🧰 Accumulating tool call chunk'
          )
        }
      }

      if (chunk.choices[0]?.finish_reason === 'tool_calls') {
        logger.info('🛑 Finish reason: tool_calls, breaking stream')
        break
      }
    }

    logger.info({ chunkCount }, '📦 Total chunks processed')
    const toolCalls = Array.from(toolCallMap.values())
    logger.info({ toolCallsCount: toolCalls.length }, '🔄 Stream processing complete, tool calls found')
    toolCalls.forEach((call, idx) => {
      logger.debug(
        {
          index: idx,
          id: call.id,
          name: call.function?.name,
          rawArguments: call.function?.arguments
        },
        '🗂️ Tool call summary'
      )
    })

    for (const toolCall of toolCalls) {
      logger.info({ toolName: toolCall.function.name }, '⚡ Executing tool call')
      if (toolCall.function.name === 'search_products') {
        if (!toolCall.function.arguments) {
          logger.warn({ toolCall }, '⚠️ No arguments provided for tool call, skipping execution')
          continue
        }

        let args: { keyword?: string }
        try {
          logger.debug({ rawArguments: toolCall.function.arguments }, '🧾 Raw tool arguments')
          args = JSON.parse(toolCall.function.arguments)
        } catch (parseError) {
          logger.error({ arguments: toolCall.function.arguments, parseError }, '❌ Failed to parse tool call arguments')
          continue
        }
        const keyword = args.keyword

        logger.debug({ keyword }, '🔍 Searching products with keyword')

        const filter: Filter<Product> = { state: ProductState.ACTIVE }
        if (keyword) {
          filter.name_on_list = { $regex: keyword, $options: 'i' }
        }

        logger.debug({ filter }, '🧮 Mongo filter')

        const products = await databaseService.products.find(filter).limit(5).toArray()
        logger.info({ count: products.length }, '📊 Found products')
        if (products.length === 0) {
          logger.warn({ keyword }, '⚠️ No products matched search keyword')
        } else {
          logger.debug({ sampleProducts: products.slice(0, 3).map((p) => p.name_on_list) }, '🛍️ Sample product names')
        }

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
          logger.debug(
            {
              hasContent: !!delta?.content,
              contentLength: delta?.content?.length || 0,
              finishReason: chunk.choices[0]?.finish_reason
            },
            `📦 Continue chunk ${continueChunkCount}`
          )
          if (delta?.content) {
            logger.debug({ content: delta.content }, '📝 Sending continuation text')
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
