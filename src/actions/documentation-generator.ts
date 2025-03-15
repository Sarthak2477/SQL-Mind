"use server";

import { Groq } from "groq-sdk";

export async function generateDocumentationFromSchema(schema: string) {
  const groq = new Groq({
    apiKey: "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",
  });

  const engineeredPrompt = [
    {
      role: "system",
      content: `You are a database documentation specialist with expertise in PostgreSQL. Your task is to convert PostgreSQL CREATE TABLE SQL statements into a detailed and well-structured markdown (.md) documentation file.

IMPORTANT: YOU DON'T NEED TO REPEAT HYPERLINKS TO DOCS, ONLY ONCE IS ENOUGH!!!

Instructions:

    Input:
        You will receive PostgreSQL CREATE TABLE SQL statements as input. These statements may include comments indicating table numbers and relationships.
        The SQL will define tables with their columns, data types, constraints (e.g., PRIMARY KEY, FOREIGN KEY), and relationships.

    Task:
        Parse the provided SQL statements to extract information about tables, columns, data types, constraints, and relationships.
        Generate a markdown file that explains the database schema comprehensively, suitable for inclusion in project documentation.

    Requirements:
        Markdown Structure:
            Title: Include a main title for the documentation (e.g., # Database Schema Documentation).
            Overview: Provide a brief overview of the database schema, its purpose, and its key components.
            Tables: For each table, create a dedicated subsection with:
                Table Name and Description:
                    Heading: Use a second-level heading (e.g., ## Authors Table).
                    Description: Briefly describe the purpose of the table.
                Columns: Present a table detailing each column with the following columns (formatted properly):
                    - Column Name
                    - Data Type (Include a hyperlink to the official PostgreSQL documentation)
                    - Constraints (List any constraints like PRIMARY KEY, NOT NULL, etc.)

                Relationships: Describe any foreign key relationships with other tables, including the type of relationship (e.g., one-to-many, many-to-many).
            At the end, create a Links section with all the links to the docs of the variables and constraints used.

        Formatting:
            Use markdown syntax for headings, tables, and bullet points.
            Ensure consistent and readable formatting throughout the document.

        Example Table Format:

| Column Name | Data Type                          | Constraints                        |
|-------------|------------------------------------|------------------------------------|
| author_id   | SERIAL                             | PRIMARY KEY                       |
| first_name  | VARCHAR(50)                        | NOT NULL                          |
| last_name   | VARCHAR(50)                        | NOT NULL                          |
| bio         | TEXT                               |                                    |
| created_at  | TIMESTAMP WITH TIME ZONE           | DEFAULT NOW()                     |
| updated_at  | TIMESTAMP WITH TIME ZONE           | DEFAULT NOW()                     |

Ensure:
    - Column widths match properly in the markdown output.
    - Each cell in the content rows aligns properly under the respective headers for clarity.

Now, based on the provided PostgreSQL CREATE TABLE statements, generate a markdown (.md) documentation file that explains the database schema in this format.`,
    }
  ];

  const response = await groq.chat.completions.create({
    "model": "llama-3.3-70b-versatile",
    "messages": [
      ...engineeredPrompt,
      {
        role: "user",
        content: `Generate documentation based on this schema: ${schema}`,
      }
    ],
    "temperature": 0.2,
    "max_tokens": 4096,
    "top_p": 1,
    "frequency_penalty": 0,
    "presence_penalty": 1.5,
    "response_format": "text",
  });

  return response.choices?.[0]?.message?.content ?? "";
}
