import { AlertTriangle, Pencil, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getById, update } from '../../api/index';
import { useAuth } from '../../context/AuthContext';

export const EditTask = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [completed, setCompleted] = useState(false);
    const [error, setError] = useState('');
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTask = async () => {
            if (!token || !id) return;

            try {
                const task = await getById(+id, token);
                setTitle(task.title);
                setDescription(task.description || '');
                setDueDate(task.dueDate?.split('T')[0] || '');
                setPriority(task.priority || 'medium');
                setCompleted(task.completed);
            } catch (error) {
                console.error(error);
                setError('Erro ao carregar tarefa.');
            }
        };

        fetchTask();
    }, [id, token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            if (!token) {
                setError('Usuário não autenticado.');

                return;
            }
            if (!id) {
                setError('Tarefa não identificada.');

                return;
            }

            await update(
                +id,
                { title, description, dueDate: dueDate || undefined, priority, completed },
                token,
            );
            navigate('/tasks');
        } catch (error) {
            console.error(error);
            setError('Erro ao atualizar tarefa. Tente novamente.');
        }
    };

    const PriorityIcon = (): JSX.Element | null => {
        switch (priority) {
            case 'low':
                return <CheckCircle className="text-green-500" size={20} />;
            case 'medium':
                return <AlertCircle className="text-yellow-400" size={20} />;
            case 'high':
                return <XCircle className="text-red-500" size={20} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-68px)] items-center justify-center bg-slate-900 px-6 py-10">
            <div className="w-full max-w-md bg-slate-950 text-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-center mb-6 flex items-center justify-center gap-2">
                    <Pencil size={24} /> Editar Tarefa
                </h2>

                {error && (
                    <div className="mb-4 flex items-center gap-2 text-red-400 bg-red-900 p-3 rounded-md" data-testid="error-message">
                        <AlertTriangle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5" data-testid="task-form">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium mb-1">
                            Título
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Digite o título da tarefa"
                            required
                            data-testid="title-input"
                            className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium mb-1">
                            Descrição
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Detalhes da tarefa (opcional)"
                            rows={4}
                            data-testid="description-input"
                            className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
                            Data de Vencimento
                        </label>
                        <input
                            id="dueDate"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            data-testid="duedate-input"
                            className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>

                    <div>
                        <label htmlFor="priority" className="block text-sm font-medium mb-1">
                            Prioridade
                        </label>
                        <div className="flex items-center space-x-2">
                            <PriorityIcon />
                            <select
                                id="priority"
                                value={priority}
                                onChange={(e) =>
                                    setPriority(e.target.value as 'low' | 'medium' | 'high')
                                }
                                data-testid="priority-select"
                                className="flex-1 px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            >
                                <option value="low">Baixa</option>
                                <option value="medium">Média</option>
                                <option value="high">Alta</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            id="completed"
                            type="checkbox"
                            checked={completed}
                            onChange={(e) => setCompleted(e.target.checked)}
                            data-testid="completed-checkbox"
                            className="w-5 h-5 accent-indigo-600"
                        />
                        <label htmlFor="completed" className="font-medium">
                            Tarefa concluída
                        </label>
                    </div>

                    <button
                        type="submit"
                        data-testid="submit-button"
                        className="w-full px-4 py-2 bg-gradient-to-r from-indigo-700 to-indigo-900 rounded-lg hover:brightness-110 transition text-white font-medium"
                    >
                        Atualizar Tarefa
                    </button>
                </form>
            </div>
        </div>
    );
};
