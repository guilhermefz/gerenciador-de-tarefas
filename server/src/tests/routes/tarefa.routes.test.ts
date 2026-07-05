jest.mock('../../middlewares/autenticacao.middleware', () => ({
    autenticar: (req: any, res: any, next: any) => {
        req.usuarioId = usuarioTeste.id ?? 1;
        next();
    },
}));

import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import app from '../../app';
import { prisma } from '../../utils/prisma';
import { configurarBancoDeTeste, desconectarBancoDeTeste, usuarioTeste } from '../setup.test.db';

beforeAll(async () => {
    await configurarBancoDeTeste();
});

afterAll(async () => {
    await desconectarBancoDeTeste();
});

describe('POST /api/tarefas', () => {
    it('deve criar uma tarefa com dados válidos e retornar 201', async () => {
        // Arrange
        const novaTarefa = {
            titulo: 'Estudar Jest',
            descricao: 'Aprender a escrever testes unitários',
            prioridade: 'high',
        };

        // Act
        const response = await request(app)
            .post('/api/tarefas')
            .send(novaTarefa);

        // Assert
        // 1. Status code correto
        expect(response.status).toBe(StatusCodes.CREATED);

        // 2. Corpo da resposta contém os dados enviados
        expect(response.body.titulo).toBe('Estudar Jest');
        expect(response.body.descricao).toBe('Aprender a escrever testes unitários');
        expect(response.body.prioridade).toBe('high');

        // 3. Campos gerados automaticamente estão presentes
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('criadaEm');
        expect(response.body.usuarioId).toBe(usuarioTeste.id);

        // 4. Tarefa foi salva no banco
        const tarefaNoBanco = await prisma.tarefa.findFirst({
            where: { titulo: 'Estudar Jest' },
        });
        expect(tarefaNoBanco).not.toBeNull();
    });
});

describe('GET /api/tarefas', () => {
    it('deve listar as tarefas do usuário', async () => {
        // Arrange
        await request(app)
            .post('/api/tarefas')
            .send({ titulo: 'Tarefa para listar', prioridade: 'low' });

        // Act
        const response = await request(app)
            .get('/api/tarefas'); // ← COMPLETE: qual a rota para listar tarefas?

        // Assert
        expect(response.status).toBe(200); // ← COMPLETE: qual status para sucesso?
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0); // ← COMPLETE: mínimo esperado
    });
});

describe('GET /api/tarefas/:id', () => {
    it('deve retornar 404 para tarefa inexistente', async () => {
        const response = await request(app)
            .get('/api/tarefas/99999');

        expect(response.status).toBe(404); // ← COMPLETE: qual status para "não encontrado"?
        expect(response.body).toHaveProperty('message'); // ← COMPLETE: qual campo da resposta de erro?
    });
});

describe('GET /api/tarefas/estatisticas', () => {
    it('deve retornar estatísticas corretas após criar tarefas', async () => {
        // Arrange: cria duas tarefas com prioridades diferentes
        await request(app).post('/api/tarefas').send({ titulo: 'Tarefa A', prioridade: 'high' });
        await request(app).post('/api/tarefas').send({ titulo: 'Tarefa B', prioridade: 'low' });

        // Act
        const response = await request(app).get('/api/tarefas/estatisticas');

        // Assert
        expect(response.status).toBe(StatusCodes.OK);

        // Verifica que os campos existem
        expect(response.body).toHaveProperty('total');
        expect(response.body).toHaveProperty('concluidas');
        expect(response.body).toHaveProperty('pendentes');
        expect(response.body).toHaveProperty('atrasadas');
        expect(response.body).toHaveProperty('porPrioridade');
        expect(response.body).toHaveProperty('vencendoEm7Dias');

        // Verifica os valores esperados.
        // Usamos toBeGreaterThanOrEqual em vez de toBe(2) porque os testes
        // anteriores neste arquivo já criaram tarefas no mesmo banco.
        // O banco é limpo uma vez no beforeAll, não antes de cada teste.
        expect(response.body.total).toBeGreaterThanOrEqual(2);
        expect(response.body.pendentes).toBeGreaterThanOrEqual(2);

        // porPrioridade usa rótulos em PT-BR (veja formatarPrioridade)
        expect(response.body.porPrioridade).toHaveProperty('Alta');
        expect(response.body.porPrioridade).toHaveProperty('Baixa');
    });
});

describe('PUT /api/tarefas/:id', () => {
    it('deve atualizar o título da tarefa e retornar 200', async () => {
        // Arrange
        const { body } = await request(app)
            .post('/api/tarefas')
            .send({ titulo: 'Título original', prioridade: 'low' });
        const id = body.id;

        // Act
        const response = await request(app)
            .put(`/api/tarefas/${id}`)
            .send({ titulo: 'Título atualizado' });

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.titulo).toBe('Título atualizado');
    });
});

describe('DELETE /api/tarefas/:id', () => {
    it('deve deletar a tarefa e retornar 204', async () => {
        // Arrange
        const { body } = await request(app)
            .post('/api/tarefas')
            .send({ titulo: 'Tarefa para deletar', prioridade: 'low' });
        const id = body.id;

        // Act
        const deleteResponse = await request(app)
            .delete(`/api/tarefas/${id}`);

        // Assert
        expect(deleteResponse.status).toBe(204);

        // Verifica que a tarefa não existe mais
        const getResponse = await request(app)
            .get(`/api/tarefas/${id}`);
        expect(getResponse.status).toBe(404);
    });
});

describe('POST /api/tarefas com título inválido', () => {
    it('deve retornar 400 para título começando com número', async () => {
        // Arrange
        const tarefaInvalida = {
            titulo: '1 Tarefa inválida',
            prioridade: 'low',
        };

        // Act
        const response = await request(app)
            .post('/api/tarefas')
            .send(tarefaInvalida);

        // Assert
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    });
});

describe('GET /api/tarefas/estatisticas (Atividade 5)', () => {
    it('deve aumentar o contador "concluidas" ao concluir uma tarefa', async () => {
        // Arrange: consulta as estatísticas antes
        const antes = await request(app).get('/api/tarefas/estatisticas');
        const concluidasAntes = antes.body.concluidas;

        // Cria uma tarefa e marca como concluída via PUT
        const { body } = await request(app)
            .post('/api/tarefas')
            .send({ titulo: 'Tarefa para concluir', prioridade: 'medium' });

        await request(app)
            .put(`/api/tarefas/${body.id}`)
            .send({ concluida: true });

        // Act
        const depois = await request(app).get('/api/tarefas/estatisticas');

        // Assert
        expect(depois.body.concluidas).toBe(concluidasAntes + 1);
    });

    it('deve aumentar o contador "atrasadas" ao criar tarefa com vencimento no passado', async () => {
        // Arrange: consulta as estatísticas antes
        const antes = await request(app).get('/api/tarefas/estatisticas');
        const atrasadasAntes = antes.body.atrasadas;

        // Cria uma tarefa com data de vencimento no passado
        await request(app)
            .post('/api/tarefas')
            .send({
                titulo: 'Tarefa vencida',
                prioridade: 'high',
                dataVencimento: '2020-01-01',
            });

        // Act
        const depois = await request(app).get('/api/tarefas/estatisticas');

        // Assert
        expect(depois.body.atrasadas).toBe(atrasadasAntes + 1);
    });
});