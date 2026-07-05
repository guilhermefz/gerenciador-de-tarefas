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

describe('POST /api/autenticacao/registrar', () => {
    it('deve registrar usuário com dados válidos e retornar 201 com token', async () => {
        // Arrange
        const novoUsuario = {
            nome: 'Novo Usuário',
            email: 'novo@exemplo.com',
            senha: 'Senha123',
        };

        // Act
        const response = await request(app)
            .post('/api/autenticacao/registrar')
            .send(novoUsuario);

        // Assert
        expect(response.status).toBe(StatusCodes.CREATED);
        expect(response.body).toHaveProperty('token');
        expect(response.body.usuario.email).toBe('novo@exemplo.com');
        expect(response.body.usuario.nome).toBe('Novo Usuário');
    });

    it('deve retornar erro para e-mail já existente', async () => {
        // Arrange: registra o e-mail uma primeira vez
        await request(app)
            .post('/api/autenticacao/registrar')
            .send({ nome: 'Original', email: 'repetido@exemplo.com', senha: 'Senha123' });

        // Act: tenta registrar de novo com o mesmo e-mail
        const response = await request(app)
            .post('/api/autenticacao/registrar')
            .send({ nome: 'Cópia', email: 'repetido@exemplo.com', senha: 'Senha123' });

        // Assert
        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(response.body).toHaveProperty('message');
    });

    it('deve retornar 400 para e-mail inválido', async () => {
        const response = await request(app)
            .post('/api/autenticacao/registrar')
            .send({ nome: 'Inválido', email: 'nao-e-um-email', senha: 'Senha123' });

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(response.body).toHaveProperty('message');
    });

    it('deve retornar 400 para senha fraca', async () => {
        const response = await request(app)
            .post('/api/autenticacao/registrar')
            .send({ nome: 'Senha Fraca', email: 'fraco@exemplo.com', senha: 'abc' });

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(response.body).toHaveProperty('message');
    });
});

describe('POST /api/autenticacao/entrar', () => {
    it('deve fazer login com credenciais válidas', async () => {
        const response = await request(app)
            .post('/api/autenticacao/entrar')
            .send({ email: usuarioTeste.email, senha: usuarioTeste.senha });

        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body).toHaveProperty('token');
        expect(response.body.usuario.id).toBe(usuarioTeste.id);
    });

    it('deve retornar 401 para senha incorreta', async () => {
        const response = await request(app)
            .post('/api/autenticacao/entrar')
            .send({ email: usuarioTeste.email, senha: 'SenhaErrada999' });

        expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
        expect(response.body).toHaveProperty('message');
    });
});
