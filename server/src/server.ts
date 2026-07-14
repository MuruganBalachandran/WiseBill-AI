// region imports
import app from './app.js';
import { connectToDatabase } from './config/index.js';
import { env } from './config/env.js';
// endregion

// region start server
const startServer = async () => {
  // Connect to database
  await connectToDatabase();

  // Set the port
  const PORT = env?.port ?? 5000;

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
// endregion

// region execute start server
startServer();
// endregion