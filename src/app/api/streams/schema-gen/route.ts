"use server";

import { Groq } from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const prompt = request.nextUrl.searchParams.get("prompt");
  const previousPrompt = undefined;

  const groq = new Groq({
    apiKey: "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",
  });

  const engineeredPrompt = [
    {
      role: "system",
      content: `You are an expert SQL database designer. Your task is to generate a well-structured PostgreSQL schema based on a given prompt.

Instructions:
    - Input: A text description of the desired database structure.
    - Output: A full PostgreSQL CREATE TABLE SQL script.
    - Requirements:
        - Define tables with appropriate data types and constraints.
        - Include primary keys, foreign keys, and indexes where needed.
        - Ensure normalized structure (avoid redundant data).

Example Input:
    "A database for an e-commerce store with products, users, and orders."

Example Output:
\`\`\`sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

Now, generate an SQL schema based on the following prompt:`,
    },
  ];

  const response = await groq.chat.completions.create({
    "model": "llama-3.3-70b-versatile",
    messages: [
      ...engineeredPrompt,
      {
        role: "user",
        content: `Generate an SQL schema based on this prompt ${previousPrompt ? `and the previous model ${previousPrompt}` : ""} : ${prompt}`,
      },
    ],
    temperature: 1,
    max_tokens: 5000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    response_format: "text",
  });

  return new NextResponse(response.choices?.[0]?.message?.content ?? "", {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
