import { CalendarDays, ClipboardList, CheckCircle, AlertTriangle, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tarefa } from '../../api/types';
import { obterCorPrioridade, obterRotuloPrioridade } from '../../utils';

const formatarData = (dataString?: string) => {
    if (!dataString) return null;

    return new Date(dataString).toLocaleDateString('pt-BR');
};

export const TaskCard = ({ tarefa }: { tarefa: Tarefa }) => (
    <div
        key={tarefa.id}
        data-testid={`task-card-${tarefa.id}`}
        className="bg-slate-800 p-6 rounded-2xl shadow-md hover:shadow-lg hover:bg-slate-700 transition border border-slate-700"
    >
        <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col gap-1">
                <Link
                    to={`/tasks/${tarefa.id}`}
                    className="text-xl font-bold text-indigo-300 hover:underline flex items-center gap-2"
                >
                    <ClipboardList size={20} /> {tarefa.titulo}
                </Link>

                <div className="flex gap-4 text-sm text-slate-400 mt-1">
                    <div className="flex items-center gap-1">
                        <CalendarDays size={14} />
                        {tarefa.dataVencimento ? (
                            <span>{formatarData(tarefa.dataVencimento)}</span>
                        ) : (
                            <span className="italic">Sem prazo</span>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <span className={`${obterCorPrioridade(tarefa.prioridade)} font-medium`}>●</span>
                        <span>{obterRotuloPrioridade(tarefa.prioridade)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        {tarefa.concluida ? (
                            <>
                                <CheckCircle size={14} className="text-green-400" />
                                <span className="text-green-400">Concluída</span>
                            </>
                        ) : (
                            <>
                                <AlertTriangle size={14} className="text-yellow-400" />
                                <span className="text-yellow-400">Pendente</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <Link
                to={`/tasks/${tarefa.id}/edit`}
                className="text-slate-400 hover:text-indigo-400 transition"
            >
                <Pencil size={18} />
            </Link>
        </div>

        {tarefa.descricao && <p className="text-slate-300">{tarefa.descricao}</p>}
    </div>
);
