import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

import express from 'express';
import { autenticar } from './middlewares/autenticacao.middleware';
import { errorHandler } from './middlewares/error.middleware';
import autenticacaoRoutes from './routes/autenticacao.routes';
import tarefaRoutes from './routes/tarefa.routes';
import testeRoutes from './routes/teste.routes';

if (process.env.NODE_ENV === 'test' && process.env.DATABASE_URL !== 'file:./dev-test.db') {
    throw new Error('Using non test database in a test environment!');
}

const app = express();

app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
}

app.use('/api/autenticacao', autenticacaoRoutes);
app.use('/api/tarefas', autenticar, tarefaRoutes);

if (process.env.NODE_ENV === 'test') {
    app.use('/api/teste', testeRoutes);
}

app.use(errorHandler);

export default app;
