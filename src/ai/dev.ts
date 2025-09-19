import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-requirements.ts';
import '@/ai/flows/generate-test-cases-from-requirements.ts';