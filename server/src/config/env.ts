// region imports
import dotenv from 'dotenv';
// endregion

// region load environment variables
dotenv.config();
// endregion

// region export
export const env = JSON.parse(process.env.APP_CONFIG ?? '{}');
// endregion