'use server';
/**
 * @fileOverview Generates test cases from software requirements using an AI model.
 *
 * - generateTestCases - A function that takes software requirements as input and returns generated test cases.
 * - GenerateTestCasesInput - The input type for the generateTestCases function.
 * - GenerateTestCasesOutput - The return type for the generateTestCases function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTestCasesInputSchema = z.object({
  requirements: z
    .string()
    .describe('The software requirements to generate test cases from.'),
});
export type GenerateTestCasesInput = z.infer<typeof GenerateTestCasesInputSchema>;

const GenerateTestCasesOutputSchema = z.object({
  testCases: z
    .string()
    .describe('The generated test cases based on the software requirements.'),
});
export type GenerateTestCasesOutput = z.infer<typeof GenerateTestCasesOutputSchema>;

export async function generateTestCases(input: GenerateTestCasesInput): Promise<GenerateTestCasesOutput> {
  return generateTestCasesFlow(input);
}

const generateTestCasesPrompt = ai.definePrompt({
  name: 'generateTestCasesPrompt',
  input: {schema: GenerateTestCasesInputSchema},
  output: {schema: GenerateTestCasesOutputSchema},
  prompt: `You are a test case generator expert. Generate test cases based on the following software requirements:\n\nRequirements: {{{requirements}}}\n\nTest Cases:`,
});

const generateTestCasesFlow = ai.defineFlow(
  {
    name: 'generateTestCasesFlow',
    inputSchema: GenerateTestCasesInputSchema,
    outputSchema: GenerateTestCasesOutputSchema,
  },
  async input => {
    const {output} = await generateTestCasesPrompt(input);
    return output!;
  }
);
