'use server';

import {
  summarizeRequirements,
} from '@/ai/flows/summarize-requirements';
import {
  generateTestCases,
} from '@/ai/flows/generate-test-cases-from-requirements';
import { z } from 'zod';

const formSchema = z.object({
  requirements: z.string().min(1, 'Requirements cannot be empty.'),
});

export type FormState = {
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

  if (!validatedFields.success) {
    return { error: 'Invalid input. Requirements cannot be empty.' };
  }

  const requirementsDocument = validatedFields.data.requirements;

  // For UI testing, we can return mock data after a delay to simulate AI processing
  await new Promise(resolve => setTimeout(resolve, 2000));

  return {
      summary: "This is a mock summary of the requirements document. It seems to be about building a healthcare application with patient management features.",
      testCases: `
      1. Verify user can log in with valid credentials.
      2. Verify user cannot log in with invalid credentials.
      3. Verify a new patient can be successfully added to the system.
      4. Verify patient records can be searched and retrieved.
      5. Verify a new appointment can be scheduled for a patient.
      `
  };


  /*
  try {
    // This part is commented out to use mock data for UI development.
    // When ready to connect to the AI, uncomment this block and remove the mock data block above.
    
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
  */
}
