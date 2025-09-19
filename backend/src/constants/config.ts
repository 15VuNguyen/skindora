import OpenAI from "openai";
const API_KEY = process.env.API_KEY;
export const MODEL_NAME = "gemini-2.5-flash";

export const geminiClient = new OpenAI({
  apiKey: API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export const USER_BUDGET_USD = 50;
export const APPROX_USD_TO_VND_RATE = 25400; 
export const USER_BUDGET_VND = USER_BUDGET_USD * APPROX_USD_TO_VND_RATE;
export const USER_SCHEDULE_PREFERENCE = "AM and PM routine";

export const KNOWN_SKIN_CONCERNS = [
  "Da thường/Mọi loại da",
  "Da dầu/Hỗn hợp dầu",
  "Da nhạy cảm",
  "Da mụn",
  "Da khô/Hỗn hợp khô",
];