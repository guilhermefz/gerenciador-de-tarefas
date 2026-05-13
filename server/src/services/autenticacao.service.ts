import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { CredenciaisInvalidasError } from '../errors/auth/CredenciaisInvalidasError';
import { EmailInvalidoError } from '../errors/auth/EmailInvalidoError';
import { TokenInvalidoError } from '../errors/auth/TokenInvalidoError';
import { UsuarioJaCadastradoError } from '../errors/auth/UsuarioJaCadastradoError';
import { UsuarioNaoEncontradoError } from '../errors/auth/UsuarioNaoEncontradoError';
import { SenhaFracaError } from '../errors/auth/SenhaFracaError';
import { prisma } from '../utils/prisma';
import { validarEmail } from '../utils/tarefa.utils';
import { validarForcaSenha } from '../utils/autenticacao.utils';

const EXPIRACAO_TOKEN = '1h';

export class AutenticacaoService {
    static async registrarUsuario(email: string, senha: string, nome: string) {
        if (!validarEmail(email)) {
            throw new EmailInvalidoError();
        }

        const forca = validarForcaSenha(senha);
        if (!forca.valida) {
            throw new SenhaFracaError(forca.razao);
        }

        const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
        if (usuarioExistente) {
            throw new UsuarioJaCadastradoError();
        }

        const senhaHash = await bcrypt.hash(senha, 10);
        const usuario = await prisma.usuario.create({
            data: { email, senha: senhaHash, nome },
        });

        const token = jwt.sign({ usuarioId: usuario.id }, JWT_SECRET, { expiresIn: EXPIRACAO_TOKEN });

        return {
            token,
            usuario: { id: usuario.id, email: usuario.email, nome: usuario.nome },
        };
    }

    static async fazerLogin(email: string, senha: string) {
        const usuario = await prisma.usuario.findUnique({ where: { email } });
        if (!usuario) {
            throw new CredenciaisInvalidasError();
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            throw new CredenciaisInvalidasError();
        }

        const token = jwt.sign({ usuarioId: usuario.id }, JWT_SECRET, { expiresIn: EXPIRACAO_TOKEN });

        return {
            token,
            usuario: { id: usuario.id, email: usuario.email, nome: usuario.nome },
        };
    }

    static async buscarUsuarioPorId(usuarioId: number) {
        const usuario = await prisma.usuario.findUnique({
            where: { id: usuarioId },
            select: { id: true, email: true, nome: true, criadoEm: true },
        });

        if (!usuario) {
            throw new UsuarioNaoEncontradoError();
        }

        return usuario;
    }

    static async buscarUsuarioPorToken(usuarioId: number) {
        const usuario = await prisma.usuario.findUnique({
            where: { id: usuarioId },
            select: { id: true, email: true, nome: true },
        });

        if (!usuario) {
            throw new UsuarioNaoEncontradoError();
        }

        return usuario;
    }

    static renovarToken(tokenAntigo: string) {
        try {
            const decoded = jwt.verify(tokenAntigo, JWT_SECRET, { ignoreExpiration: true }) as {
                usuarioId: number;
            };
            const novoToken = jwt.sign({ usuarioId: decoded.usuarioId }, JWT_SECRET, {
                expiresIn: EXPIRACAO_TOKEN,
            });

            return novoToken;
        } catch {
            throw new TokenInvalidoError();
        }
    }
}
