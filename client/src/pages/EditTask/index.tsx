import { AlertTriangle, Pencil, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { buscarPorId, atualizar } from '../../api/index';
import { useAuth } from '../../context/AuthContext';

export const EditTask = () => {
    const { id } = useParams();
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [dataVencimento, setDataVencimento] = useState('');
    const [prioridade, setPrioridade] = useState<'low' | 'medium' | 'high'>('medium');
    const [concluida, setConcluida] = useState(false);
    const [erro, setErro] = useState('');
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const buscarTarefa = async () => {
            if (!token || !id) return;

            try {
                const tarefa = await buscarPorId(+id, token);
                setTitulo(tarefa.titulo);
                setDescricao(tarefa.descricao || '');
                setDataVencimento(tarefa.dataVencimento?.split('T')[0] || '');
                setPrioridade(tarefa.prioridade || 'medium');
                setConcluida(tarefa.concluida);
            } catch (error) {
                console.error(error);
                setErro('Erro ao carregar tarefa.');
            }
        };

        buscarTarefa();
    }, [id, token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro('');

        try {
            if (!token) {
                setErro('Usuário não autenticado.');

                return;
            }
            if (!id) {
                setErro('Tarefa não identificada.');

                return;
            }

            await atualizar(
                +id,
                { titulo, descricao, dataVencimento: dataVencimento || undefined, prioridade, concluida },
                token,
            );
            navigate('/tasks');
        } catch (error) {
            console.error(error);
            setErro('Erro ao atualizar tarefa. Tente novamente.');
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
                <h2 className="text-3xl font-bold text-center mb-6 flex items-center justify-center gap-2">
                    <Pencil size={24} /> Editar Tarefa
                </h2>

                {erro && (
                    <div className="mb-4 flex items-center gap-2 text-red-400 bg-red-900 p-3 rounded-md" data-testid="error-message">
                        <AlertTriangle size={18} />
                        <span>{erro}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5" data-testid="task-form">
                    <div>
                        <label htmlFor="titulo" className="block text-sm font-medium mb-1">
                            Título
                        </label>
                        <input
                            id="titulo"
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            placeholder="Digite o título da tarefa"
                            required
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
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            placeholder="Detalhes da tarefa (opcional)"
                            rows={4}
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

                    <div className="flex items-center gap-2">
                        <input
                            id="concluida"
                            type="checkbox"
                            checked={concluida}
                            onChange={(e) => setConcluida(e.target.checked)}
                            data-testid="completed-checkbox"
                            className="w-5 h-5 accent-indigo-600"
                        />
                        <label htmlFor="concluida" className="font-medium">
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
