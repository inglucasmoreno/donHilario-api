import Router from 'express';

import { validaciones } from '../middlewares/validations';
import { MediaResController } from '../controllers/mediaRes.controllers';

const router = Router();

// MediaRes por ID
// GET - http://localhost:3000/api/media-res/:id 
router.get('/:id', validaciones.jwt, MediaResController.getMediaRes);

// Listar productos de media res
// GET - http://localhost:3000/api/mayoristas
router.get('/', validaciones.jwt, MediaResController.listarMediaRes);

// Actualizar producto de media res
// PUT - http://localhost:3000/api/mayoristas/:id 
router.put('/:id', validaciones.jwt, MediaResController.actualizarMediaRes);

export default router;