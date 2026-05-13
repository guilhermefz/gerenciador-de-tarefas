import { CheckCircle, AlertTriangle, Flag, CalendarDays, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deletarPorId, buscarPorId } from '../../api/index';
import { Tarefa } from '../../api/types';
import { useAuth } from '../../context/AuthContext';
import { obterCorPrioridade, obterRotuloPrioridade } from '../../utils';

export const TaskDetail = () => {
    const { id } = useParams();
    const [tarefa, setTarefa] = useState<Tarefa | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const buscarTarefa = async () => {
            if (!token || !id) return;

            try {
                const dados = await buscarPorId(+id, token);
                setTarefa(dados);
            } catch (error) {
                console.error(error);
                setErro('Erro ao carregar a tarefa.');
            } finally {
                setCarregando(false);
            }
        };

        buscarTarefa();
    }, [id, token]);

    const handleDeletar = async () => {
        if (!token || !id) return;

        try {
            await deletarPorId(+id, token);
            navigate('/tasks');
        } catch (error) {
            console.error(error);
            setErro('Erro ao excluir tarefa.');
        }
    };

    if (carregando) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-68px)] bg-slate-900 text-white">
                <span className="text-lg animate-pulse">Carregando detalhes...</span>
            </div>
        );
    }

    if (!tarefa) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-68px)] bg-slate-900 text-red-400">
                Tarefa não encontrada.
            </div>
        );
    }

    return (
        <div className="flex min-h-[calc(100vh-68px)] items-center justify-center bg-slate-900 px-6 py-10">
            <div className="w-full max-w-3xl bg-slate-950 rounded-2xl p-8 shadow-lg text-white">
                <h2 className="text-3xl font-bold text-indigo-300 mb-6" data-testid="task-title">{tarefa.titulo}</h2>

                {tarefa.descricao && (
                    <p className="text-slate-300 mb-8 text-lg whitespace-pre-wrap">
                        {tarefa.descricao}
                    </p>
                )}

                <div className="space-y-5 text-slate-400 text-sm mb-8">
                    <div className="flex items-center gap-3" data-testid="task-status">
                        {tarefa.concluida ? (
                            <>
                                <CheckCircle size={20} className="text-green-400" />
                                <span className="text-green-400 font-semibold">Concluída</span>
                            </>
                        ) : (
                            <>
                                <AlertTriangle size={20} className="text-yellow-400" />
                                <span className="text-yellow-400 font-semibold">Pendente</span>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-3" data-testid="task-priority">
                        <Flag size={20} className={obterCorPrioridade(tarefa.prioridade)} />
                        <span className={`${obterCorPrioridade(tarefa.prioridade)} font-semibold`}>
                            Prioridade: {obterRotuloPrioridade(tarefa.prioridade)}
                        </span>
                    </div>

                    {tarefa.dataVencimento && (
                        <div className="flex items-center gap-3" data-testid="task-due-date">
                            <CalendarDays size={20} />
                            <span>Prazo: {new Date(tarefa.dataVencimento).toLocaleDateString('pt-BR')}</span>
                        </div>
                    )}
                </div>

                <div className="flex gap-6">
                    <button
                        onClick={() => navigate(`/tasks/${id}/edit`)}
                        data-testid="edit-button"
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-lg transition font-semibold"
                    >
                        <Pencil size={18} /> Editar
                    </button>
                    <button
                        onClick={handleDeletar}
                        data-testid="delete-button"
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg transition font-semibold"
                    >
                        <Trash2 size={18} /> Excluir
                    </button>
                </div>

                {erro && (
                    <p className="mt-6 text-red-400 font-semibold text-center text-sm" data-testid="error-message">{erro}</p>
                )}
            </div>
        </div>
    );
};
