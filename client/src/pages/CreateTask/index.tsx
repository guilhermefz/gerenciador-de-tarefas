import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { criar } from '../../api/index';
import { useAuth } from '../../context/AuthContext';

export const CreateTask = () => {
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [dataVencimento, setDataVencimento] = useState<string>('');
    const [prioridade, setPrioridade] = useState<'low' | 'medium' | 'high'>('medium');
    const [erro, setErro] = useState('');
    const { token } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErro('');

        if (!token) {
            setErro('Usuário não autenticado.');

            return;
        }

        try {
            await criar({ titulo, descricao, dataVencimento: dataVencimento || undefined, prioridade }, token);
            navigate('/tasks');
        } catch (err) {
            console.error(err);
            setErro('Falha ao criar a tarefa. Tente novamente.');
        }
    };

    const IconePrioridade = (): JSX.Element | null => {
        switch (prioridade) {
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

                {erro && <p className="mb-4 text-red-400 text-sm text-center">{erro}</p>}

                <form onSubmit={handleSubmit} className="space-y-5" data-testid="task-form">
                    <div>
                        <label htmlFor="titulo" className="block text-sm font-medium mb-1">
                            Título
                        </label>
                        <input
                            id="titulo"
                            name="titulo"
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            required
                            placeholder="Digite o título da tarefa"
                            data-testid="title-input"
                            className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>

                    <div>
                        <label htmlFor="descricao" className="block text-sm font-medium mb-1">
                            Descrição
                        </label>
                        <textarea
                            id="descricao"
                            name="descricao"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            rows={4}
                            placeholder="Descreva os detalhes da tarefa (opcional)"
                            data-testid="description-input"
                            className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="dataVencimento" className="block text-sm font-medium mb-1">
                            Data de Vencimento
                        </label>
                        <input
                            id="dataVencimento"
                            name="dataVencimento"
                            type="date"
                            value={dataVencimento}
                            onChange={(e) => setDataVencimento(e.target.value)}
                            data-testid="duedate-input"
                            className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>

                    <div>
                        <label htmlFor="prioridade" className="block text-sm font-medium mb-1">
                            Prioridade
                        </label>
                        <div className="flex items-center space-x-2">
                            <IconePrioridade />
                            <select
                                id="prioridade"
                                name="prioridade"
                                value={prioridade}
                                onChange={(e) =>
                                    setPrioridade(e.target.value as 'low' | 'medium' | 'high')
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
