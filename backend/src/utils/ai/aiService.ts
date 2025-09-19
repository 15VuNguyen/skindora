import OpenAI from "openai";
import { geminiClient, MODEL_NAME } from "../../constants/config"; 
import logger from "../logger"; 

export async function getAICompletion(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  model: string = MODEL_NAME,
  expectJson: boolean = true
): Promise<any> {
  try {
    const response = await geminiClient.chat.completions.create({
      model: model,
      reasoning_effort: "low",
      messages: messages,
      response_format :{type:"json_object"}, 
      max_completion_tokens: 1290
      
    });

    let content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("AI response content is empty.");
    }

    logger.info(
      "Raw AI Response Text (first 500 chars): %s",
      content.substring(0, 500)
    ); 

    if (expectJson) {
      if (content.startsWith("```json")) {
        content = content.substring(7, content.length - 3).trim();
      } else if (content.startsWith("```")) {
        content = content.substring(3, content.length - 3).trim();
      }
      try {
        return JSON.parse(content);
      } catch (parseError) {
        logger.error(
          { error: parseError, rawContent: content },
          "Failed to parse AI JSON response."
        );
        throw new Error(
          `Failed to parse AI JSON response. Content (first 200 chars): ${content.substring(
            0,
            200
          )}...`
        );
      }
    }
    return content; 
  } catch (error) {
    logger.error({ error, model, expectJson }, "Error calling AI:");
    throw error; 
  }
}
