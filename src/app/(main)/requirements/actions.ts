'use server';

import {
  summarizeRequirements,
} from '@/ai/flows/summarize-requirements';
import {
  generateTestCases,
} from '@/ai/flows/generate-test-cases-from-requirements';
import { z } from 'zod';

const formSchema = z.object({
  requirements: z.string(),
});

type FormState = {
  summary?: string;
  testCases?: string;
  error?: string;
};

export async function generateTestCasesAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = formSchema.safeParse({
    requirements: formData.get('requirements'),
  });

  if (!validatedFields.data) {
    return { error: 'Invalid input.' };
  }

  const requirementsDocument = validatedFields.data.requirements;

  try {
    const [summaryResult, testCasesResult] = await Promise.all([
      summarizeRequirements({ requirementsDocument }),
      generateTestCases({ requirements: requirementsDocument }),
    ]);

    if (!summaryResult.summary || !testCasesResult.testCases) {
      return { error: 'Failed to generate content from AI.' };
    }

    return {
      summary: summaryResult.summary,
      testCases: testCasesResult.testCases,
    };
  } catch (error) {
    console.error(error);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}
