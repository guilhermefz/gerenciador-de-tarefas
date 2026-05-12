import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

import express from 'express';
import { authenticate } from './middlewares/auth.middleware';
import { errorHandler } from './middlewares/error.middleware';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import testRoutes from './routes/test.routes';

if (process.env.NODE_ENV === 'test' && process.env.DATABASE_URL !== 'file:./dev-test.db') {
    throw new Error('Using non test database in a test environment!');
}

const app = express();

app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
}

app.use('/api/auth', authRoutes);
app.use('/api/tasks', authenticate, taskRoutes);

if (process.env.NODE_ENV === 'test') {
    app.use('/api/test', testRoutes);
}

app.use(errorHandler);

export default app;
