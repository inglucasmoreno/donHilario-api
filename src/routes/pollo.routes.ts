import Router from 'express';

import { validaciones } from '../middlewares/validations';
import { PolloController } from '../controllers/pollo.controllers';

const router = Router();

// Pollo por ID
// GET - http://localhost:3000/api/pollo/:id 
router.get('/:id', validaciones.jwt, PolloController.getPollo);

// Listar productos de pollo
// GET - http://localhost:3000/api/pollo
router.get('/', validaciones.jwt, PolloController.listarPollo);

// Actualizar producto de pollo
// PUT - http://localhost:3000/api/pollo/:id 
router.put('/', validaciones.jwt, PolloController.actualizarPollo);

export default router;