import { MessageSquare, Send, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { buscarComentarios, criarComentario, deletarComentario } from '../../api/comentario';
import { Comentario } from '../../api/types';

interface Props {
    tarefaId: number;
    token: string;
}

export const ComentariosSection = ({ tarefaId, token }: Props) => {
    const [comentarios, setComentarios] = useState<Comentario[]>([]);
    const [novoComentario, setNovoComentario] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState('');

    useEffect(() => {
        buscarComentarios(tarefaId, token)
            .then(setComentarios)
            .catch(console.error);
    }, [tarefaId, token]);

    const handleEnviar = async () => {
        setErro('');
        try {
            setEnviando(true);
            const comentario = await criarComentario(tarefaId, novoComentario, token);
            setComentarios((prev) => [...prev, comentario]);
            setNovoComentario('');
        } catch (error: unknown) {
            const mensagem =
                (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
                'Erro ao enviar comentário.';
            setErro(mensagem);
        } finally {
            setEnviando(false);
        }
    };

    const handleDeletar = async (comentarioId: number) => {
        try {
            await deletarComentario(tarefaId, comentarioId, token);
            setComentarios((prev) => prev.filter((c) => c.id !== comentarioId));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="bg-slate-950 rounded-2xl p-8 shadow-lg text-white" data-testid="comment-section">
            <div className="flex items-center gap-3 mb-6">
                <MessageSquare size={22} className="text-indigo-400" />
                <h3 className="text-xl font-bold text-indigo-300">Comentários</h3>
                <span
                    className="bg-slate-800 text-slate-300 text-xs font-semibold px-2 py-0.5 rounded-full"
                    data-testid="comment-count"
                >
                    {comentarios.length}
                </span>
            </div>

            <div className="space-y-4 mb-6" data-testid="comment-list">
                {comentarios.length === 0 ? (
                    <p className="text-slate-500 text-sm" data-testid="comment-empty">
                        Nenhum comentário ainda. Seja o primeiro a comentar!
                    </p>
                ) : (
                    comentarios.map((comentario) => (
                        <div
                            key={comentario.id}
                            className="flex items-start justify-between gap-4 bg-slate-900 rounded-xl px-4 py-3"
                            data-testid="comment-item"
                        >
                            <p className="text-slate-200 text-sm leading-relaxed flex-1">
                                {comentario.texto}
                            </p>
                            <button
                                onClick={() => handleDeletar(comentario.id)}
                                data-testid={`comment-delete-${comentario.id}`}
                                className="text-slate-500 hover:text-red-400 transition flex-shrink-0 mt-0.5"
                                aria-label="Excluir comentário"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div className="flex flex-col gap-3">
                <textarea
                    value={novoComentario}
                    onChange={(e) => setNovoComentario(e.target.value)}
                    placeholder="Escreva um comentário..."
                    rows={3}
                    maxLength={500}
                    data-testid="comment-input"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 text-sm resize-none focus:outline-none focus:border-indigo-500 transition"
                />
                <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{novoComentario.length}/500</span>
                    <button
                        onClick={handleEnviar}
                        disabled={enviando}
                        data-testid="comment-submit"
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg transition font-semibold text-sm"
                    >
                        <Send size={16} />
                        {enviando ? 'Enviando...' : 'Comentar'}
                    </button>
                </div>
                {erro && (
                    <p className="text-red-400 text-sm" data-testid="comment-error">
                        {erro}
                    </p>
                )}
            </div>
        </div>
    );
};
