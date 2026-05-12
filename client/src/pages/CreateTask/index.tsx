import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { create } from '../../api/index';
import { useAuth } from '../../context/AuthContext';

export const CreateTask = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState<string>('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [error, setError] = useState('');
    const { token } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (!token) {
            setError('Usuário não autenticado.');

            return;
        }

        try {
            await create({ title, description, dueDate: dueDate || undefined, priority }, token);
            navigate('/tasks');
        } catch (err) {
            console.error(err);
            setError('Falha ao criar a tarefa. Tente novamente.');
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
                <h2 className="text-3xl font-bold text-center mb-6">Criar Nova Tarefa</h2>

                {error && <p className="mb-4 text-red-400 text-sm text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-5" data-testid="task-form">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium mb-1">
                            Título
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="Digite o título da tarefa"
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
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            placeholder="Descreva os detalhes da tarefa (opcional)"
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
                            name="dueDate"
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
                                name="priority"
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

                    <button
                        type="submit"
                        data-testid="submit-button"
                        className="w-full px-4 py-2 bg-gradient-to-r from-indigo-700 to-indigo-900 rounded-lg hover:brightness-110 transition text-white font-medium"
                    >
                        Criar Tarefa
                    </button>
                </form>
            </div>
        </div>
    );
};
