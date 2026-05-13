import { Router } from 'express';
import * as tarefaController from '../controllers/tarefa.controller';
import { autenticar } from '../middlewares/autenticacao.middleware';

const router = Router();

router.use(autenticar);

router.post('/', tarefaController.criarTarefa);
router.get('/estatisticas', tarefaController.buscarEstatisticas);
router.get('/', tarefaController.buscarTarefas);
router.get('/:id', tarefaController.buscarTarefaPorId);
router.put('/:id', tarefaController.atualizarTarefa);
router.delete('/:id', tarefaController.deletarTarefa);

export default router;
