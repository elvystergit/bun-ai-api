// Please install OpenAI SDK first: `npm install openai`
import OpenAI from "openai";
import type { AIService, ChatMessage } from "../types";

const openai = new OpenAI();

export const deepseekService: AIService = {
  name: "Deepseek",
  async chat(messages: ChatMessage[]) {
    const stream = await openai.chat.completions.create({
      model: "gpt-5",
      messages: messages as any,
      stream: true,
      max_tokens: 32000,
      temperature: 0.7,
      top_p: 0.9,
    });

    return (async function* () {
      for await (const chunk of stream) {
        yield (chunk as any).choices[0]?.delta?.content || ''
      }
    })()    
    }
}