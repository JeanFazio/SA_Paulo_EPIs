import express from 'express';
import { deleteEPI, getEPIs, postEPI, putEPI, emprestarEPI,receberEPI } from '../controllers/epiController.js';
const router = express.Router();

router.get('/', getEPIs);
router.post('/', postEPI);
router.put('/:id', putEPI)
router.delete('/:id', deleteEPI)
router.post('/retirar/:id', emprestarEPI )
router.post('/devolver/:id', receberEPI)

export default router;