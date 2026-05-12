import { CheckCircle, AlertTriangle, Flag, CalendarDays, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteById, getById } from '../../api/index';
import { Task } from '../../api/types';
import { useAuth } from '../../context/AuthContext';
import { getPriorityColor, getPriorityLabel } from '../../utils';

export const TaskDetail = () => {
    const { id } = useParams();
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTask = async () => {
            if (!token || !id) return;

            try {
                const task = await getById(+id, token);
                setTask(task);
            } catch (error) {
                console.error(error);
                setError('Erro ao carregar a tarefa.');
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, [id, token]);

    const handleDelete = async () => {
        if (!token || !id) return;

        try {
            await deleteById(+id, token);
            navigate('/tasks');
        } catch (error) {
            console.error(error);
            setError('Erro ao excluir tarefa.');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-68px)] bg-slate-900 text-white">
                <span className="text-lg animate-pulse">Carregando detalhes...</span>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-68px)] bg-slate-900 text-red-400">
                Tarefa não encontrada.
            </div>
        );
    }

    return (
        <div className="flex min-h-[calc(100vh-68px)] items-center justify-center bg-slate-900 px-6 py-10">
            <div className="w-full max-w-3xl bg-slate-950 rounded-2xl p-8 shadow-lg text-white">
                <h2 className="text-3xl font-bold text-indigo-300 mb-6" data-testid="task-title">{task.title}</h2>

                {task.description && (
                    <p className="text-slate-300 mb-8 text-lg whitespace-pre-wrap">
                        {task.description}
                    </p>
                )}

                <div className="space-y-5 text-slate-400 text-sm mb-8">
                    <div className="flex items-center gap-3" data-testid="task-status">
                        {task.completed ? (
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
                        <Flag size={20} className={getPriorityColor(task.priority)} />
                        <span className={`${getPriorityColor(task.priority)} font-semibold`}>
                            Prioridade: {getPriorityLabel(task.priority)}
                        </span>
                    </div>

                    {task.dueDate && (
                        <div className="flex items-center gap-3" data-testid="task-due-date">
                            <CalendarDays size={20} />
                            <span>Prazo: {new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>
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
                        onClick={handleDelete}
                        data-testid="delete-button"
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg transition font-semibold"
                    >
                        <Trash2 size={18} /> Excluir
                    </button>
                </div>

                {error && (
                    <p className="mt-6 text-red-400 font-semibold text-center text-sm" data-testid="error-message">{error}</p>
                )}
            </div>
        </div>
    );
};
