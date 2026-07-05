export const TAMANHO_MAXIMO_COMENTARIO = 500;

export function validarTextoComentario(texto: string): { valido: boolean; mensagem?: string } {
    if (!texto || texto.trim().length === 0) {
        return { valido: false, mensagem: 'O comentário não pode estar vazio' };
    }

    if (texto.trim().length > TAMANHO_MAXIMO_COMENTARIO) {
        return {
            valido: false,
            mensagem: `O comentário não pode ter mais de ${TAMANHO_MAXIMO_COMENTARIO} caracteres`,
        };
    }

    return { valido: true };
}

export function sanitizarTexto(texto: string): string {
    return texto.trim();
}

export function contarCaracteres(texto: string): number {
    return texto.trim().length;
}

export function formatarDataComentario(data: Date, agora: Date = new Date()): string {
    const diffMs = agora.getTime() - data.getTime();
    const diffMinutos = Math.floor(diffMs / 60000);

    if (diffMinutos < 1) {
        return 'agora mesmo';
    }

    if (diffMinutos < 60) {
        return `há ${diffMinutos} minuto${diffMinutos > 1 ? 's' : ''}`;
    }

    const diffHoras = Math.floor(diffMinutos / 60);
    if (diffHoras < 24) {
        return `há ${diffHoras} hora${diffHoras > 1 ? 's' : ''}`;
    }

    const diffDias = Math.floor(diffHoras / 24);

    return `há ${diffDias} dia${diffDias > 1 ? 's' : ''}`;
}
