// Summarize the key aspects of the uploaded software requirements into a concise and easily understandable summary.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeRequirementsInputSchema = z.object({
  requirementsDocument: z
    .string()
    .describe('The full text of the software requirements document.'),
});
export type SummarizeRequirementsInput = z.infer<typeof SummarizeRequirementsInputSchema>;

const SummarizeRequirementsOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of the key aspects of the software requirements.'
    ),
});
export type SummarizeRequirementsOutput = z.infer<typeof SummarizeRequirementsOutputSchema>;

export async function summarizeRequirements(
  input: SummarizeRequirementsInput
): Promise<SummarizeRequirementsOutput> {
  return summarizeRequirementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeRequirementsPrompt',
  input: {schema: SummarizeRequirementsInputSchema},
  output: {schema: SummarizeRequirementsOutputSchema},
  prompt: `Summarize the following software requirements document. Focus on the key aspects and provide a concise and easily understandable summary:\n\nRequirements Document:\n{{{requirementsDocument}}}`,
});

const summarizeRequirementsFlow = ai.defineFlow(
  {
    name: 'summarizeRequirementsFlow',
    inputSchema: SummarizeRequirementsInputSchema,
    outputSchema: SummarizeRequirementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
