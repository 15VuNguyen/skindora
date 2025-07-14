import OpenAI from 'openai'
import { geminiClient, MODEL_NAME } from '../../constants/config'
import logger from '../logger'
import fs from 'fs'
import path from 'path'

const logFilePath = path.join(__dirname, '..', '..', '..', 'ai_interactions.log')

export async function getAICompletion(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  model: string = MODEL_NAME,
  expectJson: boolean = true,
  purpose: string = 'General'
): Promise<any> {
  const logTimestamp = new Date().toISOString()

  
  const logInput = {
    timestamp: logTimestamp,
    purpose: purpose,
    model: model,
    request: messages
  }
  fs.appendFileSync(logFilePath, `--- AI Call Start ---\n${JSON.stringify(logInput, null, 2)}\n`)

  try {
    const response = await geminiClient.chat.completions.create({
      model: model,
      messages: messages,
      response_format: { type: 'json_object' }
    })
    let content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('AI response content is empty.')
    }

    const logOutput = {
      timestamp: logTimestamp,
      purpose: purpose,
      response: content
    }
    fs.appendFileSync(
      logFilePath,
      `\n--- Raw AI Response ---\n${JSON.stringify(logOutput, null, 2)}\n--- AI Call End ---\n\n`
    )

    logger.info('Raw AI Response Text (first 500 chars): %s', content.substring(0, 500))
    if (expectJson) {
      if (content.startsWith('```json')) {
        content = content.substring(7, content.length - 3).trim()
      } else if (content.startsWith('```')) {
        content = content.substring(3, content.length - 3).trim()
      }
      try {
        return JSON.parse(content)
      } catch (parseError) {
        logger.error({ error: parseError, rawContent: content }, 'Failed to parse AI JSON response.')
        throw new Error(`Failed to parse AI JSON response. Content (first 200 chars): ${content.substring(0, 200)}...`)
      }
    }
    return content
  } catch (error) {
    const logError = {
      timestamp: logTimestamp,
      purpose: purpose,
      error: error instanceof Error ? { message: error.message, stack: error.stack } : error
    }
    fs.appendFileSync(
      logFilePath,
      `\n--- AI Call Error ---\n${JSON.stringify(logError, null, 2)}\n--- AI Call End ---\n\n`
    )

    logger.error({ error, model, expectJson }, 'Error calling AI:')
    throw error
  }
}
