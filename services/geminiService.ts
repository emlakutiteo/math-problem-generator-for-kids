import { GoogleGenAI, Type } from "@google/genai";
import { GeneratorConfig } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateMathProblems(config: GeneratorConfig): Promise<string[]> {
  const { min, max, count, operations, useParentheses, numOperations } = config;

  const selectedOps = Object.entries(operations)
    .filter(([, value]) => value)
    .map(([key]) => key);

  if (selectedOps.length === 0) {
    throw new Error("Please select at least one operation.");
  }

  let prompt;
  if (numOperations === 1) {
      prompt = `Generate ${count} math problems suitable for a 3rd-grade student.
      The problems must follow these rules:
      1.  Each problem must contain exactly 1 operation.
      2.  Use only whole numbers between ${min} and ${max}, inclusive.
      3.  Only use the following operations: ${selectedOps.join(", ")}.
      4.  For subtraction (a - b), ensure 'a' is always greater than or equal to 'b' to avoid negative results.
      5.  For division (a / b), ensure 'a' is perfectly divisible by 'b' to avoid any remainders.
      `;

      if (useParentheses) {
        // Parentheses don't make sense for a single operation, but we can handle it gracefully.
        // This case is unlikely to be hit with the current UI.
      }
      prompt += `
      Return the result as a JSON array of strings. Each string in the array should be a single math problem ending with " = ". Do not include the answers.
      Example response format: ["5 + 8 = ", "12 - 4 = ", "6 * 3 = "]
    `;

  } else {
    prompt = `Generate ${count} math problems suitable for a 3rd-grade student.
    The problems must follow these rules:
    1.  Each problem must contain exactly ${numOperations} operations.
    2.  The operations should be randomly chosen from the following list: ${selectedOps.join(", ")}.
    3.  Use only whole numbers between ${min} and ${max}, inclusive, for all numbers in the problem.
    4.  At every step of the calculation, ensure that:
        - Subtraction (a - b) results in 'a' being greater than or equal to 'b' to avoid negative numbers.
        - Division (a / b) results in 'a' being perfectly divisible by 'b' to avoid remainders.
    `;

    if (useParentheses) {
      prompt += `5. Parentheses should be used in some problems to group one of the operations, changing the order of calculation. For example: (5 + 3) * 2 or 20 - (8 / 2). The rules for subtraction and division must still be followed.`;
    }

    prompt += `
      Return the result as a JSON array of strings. Each string in the array should be a single math problem ending with " = ". Do not include the answers.
      Example response format for 2 operations: ["5 + 8 - 3 = ", "12 - 4 + 2 = ", "(6 * 3) + 5 = "]
    `;
  }
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            description: "A single math problem as a string, ending with ' = '."
          }
        }
      }
    });

    const jsonText = response.text.trim();
    const problems = JSON.parse(jsonText);
    
    if (!Array.isArray(problems) || !problems.every(p => typeof p === 'string')) {
        throw new Error("API returned an invalid data format.");
    }

    return problems;

  } catch (error) {
    console.error("Error generating math problems:", error);
    throw new Error("Failed to generate math problems. The model may have returned an unexpected response.");
  }
}
