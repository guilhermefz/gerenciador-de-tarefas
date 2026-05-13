import { Router } from 'express';
import { resetarBancoDeDados } from '../controllers/teste.controller';

const router = Router();

router.post('/resetar-banco', resetarBancoDeDados);

export default router;
