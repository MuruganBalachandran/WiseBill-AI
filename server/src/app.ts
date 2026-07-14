// region imports
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import routes from './routers/index.js';
import { globalErrorHandler } from './middlewares/index.js';
// endregion

// region initiate express app
const app: Express = express();
// endregion

// region middlewares

// cross origin resource sharing
app.use(cors());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Server is healthy', timestamp: new Date().toISOString() });
});

// api routes
app.use('/api', routes);

// 404 not found handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Resource Not Found' });
});

// global error handler
app.use(globalErrorHandler);

// endregion

// region exports
export default app;
// endregion
