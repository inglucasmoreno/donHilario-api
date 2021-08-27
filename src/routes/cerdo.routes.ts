import Router from 'express';

import { validaciones } from '../middlewares/validations';
import { CerdoController } from '../controllers/cerdo.controllers';

const router = Router();

// Cerdo por ID
// GET - http://localhost:3000/api/cerdo/:id 
router.get('/:id', validaciones.jwt, CerdoController.getCerdo);

// Listar productos de cerdo
// GET - http://localhost:3000/api/cerdo
router.get('/', validaciones.jwt, CerdoController.listarCerdo);

// Actualizar producto de cerdo
// PUT - http://localhost:3000/api/cerdo/:id 
router.put('/', validaciones.jwt, CerdoController.actualizarCerdo);

export default router;