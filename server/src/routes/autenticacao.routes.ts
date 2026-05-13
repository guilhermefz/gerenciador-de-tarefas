import { Router } from 'express';
import {
    registrar,
    entrar,
    buscarUsuarioAtual,
    validarToken,
    renovarToken,
} from '../controllers/autenticacao.controller';
import { autenticar } from '../middlewares/autenticacao.middleware';

const router = Router();

router.post('/registrar', registrar);
router.post('/entrar', entrar);
router.get('/perfil', autenticar, buscarUsuarioAtual);
router.get('/validar', autenticar, validarToken);
router.post('/renovar', autenticar, renovarToken);

export default router;
