import { prisma } from '../utils/prisma';

export class TesteService {
    static async resetarBancoDeDados() {
        await prisma.comentario.deleteMany();
        await prisma.tarefa.deleteMany();
        await prisma.usuario.deleteMany();

        await prisma.$executeRawUnsafe('DELETE FROM sqlite_sequence WHERE name = "Comentario";');
        await prisma.$executeRawUnsafe('DELETE FROM sqlite_sequence WHERE name = "Tarefa";');
        await prisma.$executeRawUnsafe('DELETE FROM sqlite_sequence WHERE name = "Usuario";');
    }
}
