import Router from 'express';
import { check } from 'express-validator';

import { validaciones } from '../middlewares/validations';
import { ProduccionInternaController } from '../controllers/produccion_interna.controllers';

const router = Router();

// Listar producciones interna
// GET - http://localhost:3000/api/produccion-interna
router.get('/', validaciones.jwt, ProduccionInternaController.listarProduccionInterna);

// Nueva produccion interna
// POST - http://localhost:3000/api/produccion-interna
router.post('/', 
            [    
                validaciones.jwt,
                check('producto_entrada', 'El producto de entrada es un campo obligatorio').not().isEmpty(),
                check('producto_salida', 'El producto de salida es un campo obligatorio').not().isEmpty(),
                check('cantidad_entrada', 'La cantidad de entrada es un campo obligatorio').not().isEmpty(),
                check('cantidad_salida', 'La cantidad de salida es un campo obligatorio').not().isEmpty(),
                validaciones.campos
            ], ProduccionInternaController.nuevaProduccionInterna);

// Completar produccion interna
// PUT - http://localhost:3000/api/produccion-interna/:id 
router.put('/completar', validaciones.jwt, ProduccionInternaController.completarProduccionInterna);

// Actualizar produccion interna
// PUT - http://localhost:3000/api/produccion-interna/:id 
router.put('/:id', validaciones.jwt, ProduccionInternaController.actualizarProduccionInterna);

// Eliminar produccion interna
// DELETE - http://localhost:3000/api/produccion-interna/:id 
router.delete('/:id', validaciones.jwt, ProduccionInternaController.eliminarProduccionInterna);

export default router;