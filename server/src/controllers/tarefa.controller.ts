import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { NomeTarefaInvalidoError } from '../errors/task/NomeTarefaInvalidoError';
import { TarefaNaoEncontradaError } from '../errors/task/TarefaNaoEncontradaError';
import { TarefaService } from '../services/tarefa.service';

export const criarTarefa = async (req: Request, res: Response): Promise<void> => {
    const usuarioId = req.usuarioId;
    if (!usuarioId) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Não autorizado' });

        return;
    }

    try {
        const tarefa = await TarefaService.criarTarefa(usuarioId, req.body);
        res.status(StatusCodes.CREATED).json(tarefa);
    } catch (error) {
        if (error instanceof NomeTarefaInvalidoError) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
        } else {
            console.error('Erro ao criar tarefa:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Erro no servidor' });
        }
    }
};

export const buscarTarefas = async (req: Request, res: Response): Promise<void> => {
    const usuarioId = req.usuarioId;
    if (!usuarioId) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Não autorizado' });

        return;
    }

    try {
        const tarefas = await TarefaService.buscarTarefas(usuarioId, req.query);
        res.json(tarefas);
    } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Erro no servidor' });
    }
};

export const buscarTarefaPorId = async (req: Request, res: Response): Promise<void> => {
    const usuarioId = req.usuarioId;
    if (!usuarioId) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Não autorizado' });

        return;
    }

    try {
        const tarefa = await TarefaService.buscarTarefaPorId(usuarioId, parseInt(req.params.id));
        res.json(tarefa);
    } catch (error) {
        if (error instanceof TarefaNaoEncontradaError) {
            res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
        } else {
            console.error('Erro ao buscar tarefa:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Erro no servidor' });
        }
    }
};

export const atualizarTarefa = async (req: Request, res: Response): Promise<void> => {
    const usuarioId = req.usuarioId;
    if (!usuarioId) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Não autorizado' });

        return;
    }

    try {
        const tarefaAtualizada = await TarefaService.atualizarTarefa(usuarioId, parseInt(req.params.id), req.body);
        res.json(tarefaAtualizada);
    } catch (error) {
        if (error instanceof TarefaNaoEncontradaError) {
            res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
        } else if (error instanceof NomeTarefaInvalidoError) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
        } else {
            console.error('Erro ao atualizar tarefa:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Erro no servidor' });
        }
    }
};

export const buscarEstatisticas = async (req: Request, res: Response): Promise<void> => {
    const usuarioId = req.usuarioId;
    if (!usuarioId) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Não autorizado' });

        return;
    }

    try {
        const estatisticas = await TarefaService.buscarEstatisticas(usuarioId);
        res.json(estatisticas);
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Erro no servidor' });
    }
};

export const deletarTarefa = async (req: Request, res: Response): Promise<void> => {
    const usuarioId = req.usuarioId;
    if (!usuarioId) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Não autorizado' });

        return;
    }

    try {
        await TarefaService.deletarTarefa(usuarioId, parseInt(req.params.id));
        res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
        if (error instanceof TarefaNaoEncontradaError) {
            res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
        } else {
            console.error('Erro ao deletar tarefa:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Erro no servidor' });
        }
    }
};
