jest.mock('../../middlewares/autenticacao.middleware', () => ({
    autenticar: (req: any, res: any, next: any) => {
        req.usuarioId = usuarioTeste.id ?? 1;
        next();
    },
}));

import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import app from '../../app';
import { configurarBancoDeTeste, desconectarBancoDeTeste, usuarioTeste } from '../setup.test.db';

beforeAll(async () => {
    await configurarBancoDeTeste();
});

afterAll(async () => {
    await desconectarBancoDeTeste();
});

describe('POST /api/tarefas/:tarefaId/comentarios', () => {
    it('deve criar um comentário em uma tarefa e retornar 201', async () => {
        const tarefa = await request(app) // cria a tarefa que vai receber o comentário
            .post('/api/tarefas')
            .send({ titulo: 'Tarefa com comentário', prioridade: 'medium' });

        const response = await request(app) // cria o comentário na tarefa
            .post(`/api/tarefas/${tarefa.body.id}/comentarios`)
            .send({ texto: 'Meu primeiro comentário de teste' });

        expect(response.status).toBe(StatusCodes.CREATED);
        expect(response.body.texto).toBe('Meu primeiro comentário de teste');
        expect(response.body.tarefaId).toBe(tarefa.body.id);
        expect(response.body).toHaveProperty('id');
    });

    it('deve retornar 404 ao comentar em uma tarefa inexistente', async () => {
        const tarefaIdInexistente = 99999; //um id de tarefa que não existe no banco

        const response = await request(app) //tenta criar um comentário válido nessa tarefa
            .post(`/api/tarefas/${tarefaIdInexistente}/comentarios`)
            .send({ texto: 'Comentário em tarefa fantasma' });

        expect(response.status).toBe(StatusCodes.NOT_FOUND);
        expect(response.body).toHaveProperty('message');
    });
});