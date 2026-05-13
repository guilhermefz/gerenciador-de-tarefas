import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CredenciaisInvalidasError } from '../errors/auth/CredenciaisInvalidasError';
import { EmailInvalidoError } from '../errors/auth/EmailInvalidoError';
import { TokenInvalidoError } from '../errors/auth/TokenInvalidoError';
import { UsuarioJaCadastradoError } from '../errors/auth/UsuarioJaCadastradoError';
import { UsuarioNaoEncontradoError } from '../errors/auth/UsuarioNaoEncontradoError';
import { SenhaFracaError } from '../errors/auth/SenhaFracaError';
import { AutenticacaoService } from '../services/autenticacao.service';

export const registrar = async (req: Request, res: Response): Promise<void> => {
    const { email, senha, nome } = req.body;
    try {
        const resultado = await AutenticacaoService.registrarUsuario(email, senha, nome);
        res.status(StatusCodes.CREATED).json(resultado);
    } catch (error) {
        if (error instanceof EmailInvalidoError || error instanceof SenhaFracaError || error instanceof UsuarioJaCadastradoError) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
        } else {
            console.error('Erro no registro:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Erro no servidor' });
        }
    }
};

export const entrar = async (req: Request, res: Response): Promise<void> => {
    const { email, senha } = req.body;
    try {
        const resultado = await AutenticacaoService.fazerLogin(email, senha);
        res.json(resultado);
    } catch (error) {
        if (error instanceof CredenciaisInvalidasError) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: error.message });
        } else {
            console.error('Erro no login:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Erro no servidor' });
        }
    }
};

export const buscarUsuarioAtual = async (req: Request, res: Response): Promise<void> => {
    const usuarioId = req.usuarioId;
    if (!usuarioId) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Usuário não autenticado' });

        return;
    }

    try {
        const usuario = await AutenticacaoService.buscarUsuarioPorId(usuarioId);
        res.json(usuario);
    } catch (error) {
        if (error instanceof UsuarioNaoEncontradoError) {
            res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
        } else {
            console.error('Erro ao buscar usuário:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Erro no servidor' });
        }
    }
};

export const validarToken = async (req: Request, res: Response): Promise<void> => {
    const usuarioId = req.usuarioId;
    if (!usuarioId) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token inválido ou expirado' });

        return;
    }

    try {
        const usuario = await AutenticacaoService.buscarUsuarioPorToken(usuarioId);
        res.json({ usuario });
    } catch (error) {
        if (error instanceof UsuarioNaoEncontradoError) {
            res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
        } else {
            console.error('Erro ao validar token:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Erro no servidor' });
        }
    }
};

export const renovarToken = async (req: Request, res: Response): Promise<void> => {
    const authHeader = req.headers['authorization'];
    const tokenAntigo = authHeader && authHeader.split(' ')[1];

    if (!tokenAntigo) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token não fornecido' });

        return;
    }

    try {
        const novoToken = AutenticacaoService.renovarToken(tokenAntigo);
        res.json({ token: novoToken });
    } catch (error) {
        if (error instanceof TokenInvalidoError) {
            res.status(StatusCodes.FORBIDDEN).json({ message: error.message });
        } else {
            console.error('Erro ao renovar token:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Erro no servidor' });
        }
    }
};
