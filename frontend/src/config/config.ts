import { z } from "zod";

interface AppImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_GOOGLE_REDIRECT_URI: string;
  readonly VITE_SENTRY_DSN_FRONTEND?: string;
  readonly MODE: "development" | "production" | "test";
}


const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
  VITE_GOOGLE_CLIENT_ID: z.string().min(1),
  VITE_GOOGLE_REDIRECT_URI: z.string().url(),
  VITE_SENTRY_DSN_FRONTEND: z.string().optional(),
  MODE: z.enum(["development", "production", "test"]),
});

const validatedEnv = envSchema.safeParse(import.meta.env as unknown as AppImportMetaEnv);

if (!validatedEnv.success) {
  console.error("thieu variables:", validatedEnv.error.flatten().fieldErrors);
  throw new Error("thieu environment variables.");
}

export const config = {
  apiBaseUrl: validatedEnv.data.VITE_API_BASE_URL,
  googleClientId: validatedEnv.data.VITE_GOOGLE_CLIENT_ID,
  googleRedirectUri: validatedEnv.data.VITE_GOOGLE_REDIRECT_URI,
  sentryDsn: validatedEnv.data.VITE_SENTRY_DSN_FRONTEND,
  mode: validatedEnv.data.MODE,
};
