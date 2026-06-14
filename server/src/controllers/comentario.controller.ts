import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ComentarioNaoEncontradoError } from '../errors/comentario/ComentarioNaoEncontradoError';
import { TextoComentarioInvalidoError } from '../errors/comentario/TextoComentarioInvalidoError';
import { TarefaNaoEncontradaError } from '../errors/task/TarefaNaoEncontradaError';
import { ComentarioService } from '../services/comentario.service';

export const criarComentario = async (req: Request, res: Response): Promise<void> => {
    const usuarioId = req.usuarioId;
    if (!usuarioId) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Não autorizado' });

        return;
    }

    try {
        const tarefaId = parseInt(req.params.tarefaId);
        const comentario = await ComentarioService.criarComentario(usuarioId, tarefaId, req.body);
        res.status(StatusCodes.CREATED).json(comentario);
    } catch (error) {
        if (error instanceof TarefaNaoEncontradaError) {
            res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
        } else if (error instanceof TextoComentarioInvalidoError) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
        } else {
            console.error('Erro ao criar comentário:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Erro no servidor' });
        }
    }
};

export const buscarComentarios = async (req: Request, res: Response): Promise<void> => {
    const usuarioId = req.usuarioId;
    if (!usuarioId) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Não autorizado' });

        return;
    }

    try {
        const tarefaId = parseInt(req.params.tarefaId);
        const comentarios = await ComentarioService.buscarComentarios(usuarioId, tarefaId);
        res.json(comentarios);
    } catch (error) {
        if (error instanceof TarefaNaoEncontradaError) {
            res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
        } else {
            console.error('Erro ao buscar comentários:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Erro no servidor' });
        }
    }
};

export const deletarComentario = async (req: Request, res: Response): Promise<void> => {
    const usuarioId = req.usuarioId;
    if (!usuarioId) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Não autorizado' });

        return;
    }

    try {
        const tarefaId = parseInt(req.params.tarefaId);
        const id = parseInt(req.params.id);
        await ComentarioService.deletarComentario(usuarioId, tarefaId, id);
        res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
        if (error instanceof ComentarioNaoEncontradoError) {
            res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
        } else {
            console.error('Erro ao deletar comentário:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Erro no servidor' });
        }
    }
};
