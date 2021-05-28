import Router from 'express';
import { check } from 'express-validator';

import { validaciones } from '../middlewares/validations';
import { UnidadMedidaController } from '../controllers/unidad_medida.controllers';

const router = Router();

// Unidad de medida por ID
// GET - http://localhost:3000/api/unidad_medida/:id 
router.get('/:id', validaciones.jwt, UnidadMedidaController.getUnidad);

// Listar unidades de medida
// GET - http://localhost:3000/api/unidad_medida
// Parametros: columna | direccion | desde | limit | descripcion | activo
router.get('/', validaciones.jwt, UnidadMedidaController.listarUnidades);

// Nueva unidad de medida
// POST - http://localhost:3000/api/unidad_medida
router.post('/', 
            [    
                validaciones.jwt,
                check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
                validaciones.campos
            ], UnidadMedidaController.nuevaUnidad);

// Actualizar unidad de medida
// PUT - http://localhost:3000/api/unidad_medida/:id 
router.put('/:id', validaciones.jwt, UnidadMedidaController.actualizarUnidad);

export default router;