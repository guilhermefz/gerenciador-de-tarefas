import bcrypt from 'bcryptjs';
import { prisma } from '../utils/prisma';

export let usuarioTeste: { id: number; email: string; senha: string };

export const configurarBancoDeTeste = async () => {
    await prisma.tarefa.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.$executeRawUnsafe('DELETE FROM sqlite_sequence WHERE name = "Usuario";');
    await prisma.$executeRawUnsafe('DELETE FROM sqlite_sequence WHERE name = "Tarefa";');

    const senhaTexto = 'Senha123';
    const senhaHash = await bcrypt.hash(senhaTexto, 10);
    const emailUnico = `usuario_${Date.now()}@exemplo.teste`;

    const usuario = await prisma.usuario.create({
        data: {
            email: emailUnico,
            nome: 'Usuário Exemplo',
            senha: senhaHash,
        },
    });

    usuarioTeste = { id: usuario.id, email: emailUnico, senha: senhaTexto };
};

export const desconectarBancoDeTeste = async () => {
    await prisma.$disconnect();
};
