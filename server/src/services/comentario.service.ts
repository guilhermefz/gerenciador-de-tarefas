import { ComentarioNaoEncontradoError } from '../errors/comentario/ComentarioNaoEncontradoError';
import { TextoComentarioInvalidoError } from '../errors/comentario/TextoComentarioInvalidoError';
import { TarefaNaoEncontradaError } from '../errors/task/TarefaNaoEncontradaError';
import { sanitizarTexto, validarTextoComentario } from '../utils/comentario.utils';
import { prisma } from '../utils/prisma';

export class ComentarioService {
    static async criarComentario(usuarioId: number, tarefaId: number, dados: { texto: string }) {
        const tarefa = await prisma.tarefa.findUnique({ where: { id: tarefaId, usuarioId } });
        if (!tarefa) {
            throw new TarefaNaoEncontradaError();
        }

        const validacao = validarTextoComentario(dados.texto);
        if (!validacao.valido) {
            throw new TextoComentarioInvalidoError(validacao.mensagem);
        }

        return await prisma.comentario.create({
            data: {
                texto: sanitizarTexto(dados.texto),
                tarefaId,
                usuarioId,
            },
        });
    }

    static async buscarComentarios(usuarioId: number, tarefaId: number) {
        const tarefa = await prisma.tarefa.findUnique({ where: { id: tarefaId, usuarioId } });
        if (!tarefa) {
            throw new TarefaNaoEncontradaError();
        }

        return await prisma.comentario.findMany({
            where: { tarefaId },
            orderBy: { criadoEm: 'asc' },
        });
    }

    static async deletarComentario(usuarioId: number, tarefaId: number, id: number) {
        const comentario = await prisma.comentario.findUnique({ where: { id } });

        if (!comentario || comentario.tarefaId !== tarefaId || comentario.usuarioId !== usuarioId) {
            throw new ComentarioNaoEncontradoError();
        }

        await prisma.comentario.delete({ where: { id } });
    }
}
