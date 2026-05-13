import { NomeTarefaInvalidoError } from '../errors/task/NomeTarefaInvalidoError';
import { TarefaNaoEncontradaError } from '../errors/task/TarefaNaoEncontradaError';
import { prisma } from '../utils/prisma';
import { calcularEstatisticas, diasParaVencimento, estaAtrasada, formatarPrioridade } from '../utils/tarefa.utils';

export class TarefaService {
    static async criarTarefa(
        usuarioId: number,
        dados: {
            titulo: string;
            descricao?: string;
            dataVencimento?: string | null;
            prioridade?: string;
        },
    ) {
        if (/^\d/.test(dados.titulo)) {
            throw new NomeTarefaInvalidoError();
        }

        const tarefa = await prisma.tarefa.create({
            data: {
                titulo: dados.titulo,
                descricao: dados.descricao,
                dataVencimento: dados.dataVencimento ? new Date(dados.dataVencimento) : null,
                prioridade: dados.prioridade,
                usuarioId,
            },
        });

        return tarefa;
    }

    static async buscarTarefas(usuarioId: number, filtros: { concluida?: string; prioridade?: string }) {
        const { concluida, prioridade } = filtros;

        const tarefas = await prisma.tarefa.findMany({
            where: {
                usuarioId,
                ...(concluida !== undefined && { concluida: concluida === 'true' }),
                ...(prioridade && { prioridade }),
            },
            orderBy: { criadaEm: 'desc' },
        });

        return tarefas;
    }

    static async buscarTarefaPorId(usuarioId: number, id: number) {
        const tarefa = await prisma.tarefa.findUnique({
            where: { id, usuarioId },
        });

        if (!tarefa) {
            throw new TarefaNaoEncontradaError();
        }

        return tarefa;
    }

    static async atualizarTarefa(
        usuarioId: number,
        id: number,
        dados: {
            titulo?: string;
            descricao?: string;
            concluida?: boolean;
            dataVencimento?: string | null;
            prioridade?: string;
        },
    ) {
        if (dados.titulo !== undefined && /^\d/.test(dados.titulo)) {
            throw new NomeTarefaInvalidoError();
        }

        await TarefaService.buscarTarefaPorId(usuarioId, id);

        const tarefaAtualizada = await prisma.tarefa.update({
            where: { id, usuarioId },
            data: {
                titulo: dados.titulo,
                descricao: dados.descricao,
                concluida: dados.concluida,
                dataVencimento: dados.dataVencimento ? new Date(dados.dataVencimento) : null,
                prioridade: dados.prioridade,
            },
        });

        return tarefaAtualizada;
    }

    static async deletarTarefa(usuarioId: number, id: number) {
        await TarefaService.buscarTarefaPorId(usuarioId, id);

        await prisma.tarefa.delete({
            where: { id, usuarioId },
        });
    }

    static async buscarEstatisticas(usuarioId: number) {
        const tarefas = await prisma.tarefa.findMany({ where: { usuarioId } });
        const agora = new Date();

        let atrasadas = 0;
        let vencendoEm7Dias = 0;

        for (const tarefa of tarefas) {
            if (estaAtrasada({ dataVencimento: tarefa.dataVencimento, concluida: tarefa.concluida }, agora)) {
                atrasadas++;
            }
            const dias = diasParaVencimento(tarefa.dataVencimento, agora);
            if (dias !== null && dias >= 0 && dias <= 7) {
                vencendoEm7Dias++;
            }
        }

        const { total, concluidas, pendentes, porPrioridade } = calcularEstatisticas(tarefas);

        const porPrioridadeFormatada: Record<string, number> = {};
        for (const [chave, quantidade] of Object.entries(porPrioridade)) {
            const label = chave === 'sem_prioridade' ? 'Sem prioridade' : formatarPrioridade(chave);
            porPrioridadeFormatada[label] = quantidade;
        }

        return { total, concluidas, pendentes, atrasadas, porPrioridade: porPrioridadeFormatada, vencendoEm7Dias };
    }
}
