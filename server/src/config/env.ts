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
// Parsed once at startup. Access as: env.db.uri, env.resend.apiKey, env.clientUrl, etc.
export const env: AppConfig = JSON.parse(process.env.APP_CONFIG ?? '{}');
// endregion