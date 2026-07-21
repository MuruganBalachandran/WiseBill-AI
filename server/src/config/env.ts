// region imports
import dotenv from 'dotenv';
// endregion

// region load
dotenv.config();
// endregion

// region types

// Full typed shape of the APP_CONFIG JSON.
// All server config is centralised here — no bare process.env.* calls outside this file.
interface AppConfig {
  db: { uri: string };
  port: number;
  geminiApiKey: string;
  resend: {
    apiKey: string;
    fromEmail: string;
  };
  clientUrl: string;
  // Optional AI provider keys — include in APP_CONFIG JSON to enable each provider
  anthropicApiKey?: string;
  openaiApiKey?: string;
}
// endregion

// region export
const parsedAppConfig = (() => {
  if (process.env.APP_CONFIG) {
    try {
      return JSON.parse(process.env.APP_CONFIG);
    } catch {
      // ignore JSON parse error and fallback
    }
  }
  return {};
})();

// Parsed once at startup. Supports APP_CONFIG JSON or individual environment variables.
export const env: AppConfig = {
  db: {
    uri: parsedAppConfig.db?.uri || process.env.MONGODB_URI || process.env.DB_URI || 'mongodb://localhost:27017/billwiseai',
  },
  port: Number(process.env.PORT || parsedAppConfig.port || 5000),
  geminiApiKey: parsedAppConfig.geminiApiKey || process.env.GEMINI_API_KEY || '',
  resend: {
    apiKey: parsedAppConfig.resend?.apiKey || process.env.RESEND_API_KEY || '',
    fromEmail: parsedAppConfig.resend?.fromEmail || process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
  },
  clientUrl: parsedAppConfig.clientUrl || process.env.CLIENT_URL || 'http://localhost:3000',
  anthropicApiKey: parsedAppConfig.anthropicApiKey || process.env.ANTHROPIC_API_KEY,
  openaiApiKey: parsedAppConfig.openaiApiKey || process.env.OPENAI_API_KEY,
};
// endregion