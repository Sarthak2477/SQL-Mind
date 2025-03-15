"use server";

import { Groq } from "groq-sdk";

import engineeredPrompt from "@/prompts/prompt-flow-generator";

export async function generateFlowDataFromSchema(schema: string) {
  const groq = new Groq({
    apiKey: "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",
  });

  const response = await groq.chat.completions.create({
    model: "mixtral-8x7b-32768",
    messages: [
      ...engineeredPrompt,
      {
        role: "user",
        content: `Generate Nodes and Edges based on this SQL schema: ${schema}`
      }
    ],
    temperature: 1,
    max_tokens: 4096, // Adjusted for Groq compatibility
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    response_format: "json", // Groq expects a string, not an object
  });

  return response;
}
