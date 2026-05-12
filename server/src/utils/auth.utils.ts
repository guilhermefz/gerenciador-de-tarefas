export function validarForcaSenha(senha: string): {
    valida: boolean;
    razao?: string;
} {
    if (senha.length < 6) {
        return { valida: false, razao: 'Senha deve ter no mínimo 6 caracteres' };
    }

    if (!/[a-zA-Z]/.test(senha)) {
        return { valida: false, razao: 'Senha deve conter pelo menos uma letra' };
    }

    if (!/\d/.test(senha)) {
        return { valida: false, razao: 'Senha deve conter pelo menos um número' };
    }

    return { valida: true };
}
