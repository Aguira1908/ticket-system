import express, { Application } from 'express';
import {
  globalErrorHandler,
  notFoundHandler,
} from './middlewares/errorHandler';
import statsRoutes from './routes/stats.routes';

const app: Application = express();

app.use('/api', statsRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
