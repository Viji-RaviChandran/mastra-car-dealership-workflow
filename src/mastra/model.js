import 'dotenv/config';
import { createGroq } from '@ai-sdk/groq';

export const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1', 
});


export const model= 'openai/gpt-oss-120b';