import Router from 'express';
import { check } from 'express-validator';

import { validaciones } from '../middlewares/validations';
import { DesechoController } from '../controllers/desechos.controllers';

const router = Router();

// Desecho por ID
// GET - http://localhost:3000/api/desechos/:id 
router.get('/:id', validaciones.jwt, DesechoController.getDesecho);

// Listar Desechos
// GET - http://localhost:3000/api/desechos
router.get('/', validaciones.jwt, DesechoController.listarDesechos);

// Nuevo Desecho
// POST - http://localhost:3000/api/desechos 
router.post('/', 
            [    
                validaciones.jwt,
                check('descripcion', 'La descripcion es un campo obligatorio').not().isEmpty(),
                check('cantidad', 'La cantidad es un campo obligatorio').not().isEmpty(),
                validaciones.campos
            ], DesechoController.nuevoDesecho);

// Completar Desechos
// PUT - http://localhost:3000/api/desechos/:id 
router.put('/completar', validaciones.jwt, DesechoController.completarDesechos);

// Actualizar desecho
// PUT - http://localhost:3000/api/desechos/:id 
router.put('/:id', validaciones.jwt, DesechoController.actualizarDesecho);

// Eliminar desecho
// DELETE - http://localhost:3000/api/desechos/:id 
router.delete('/:id', validaciones.jwt, DesechoController.eliminarDesecho);

export default router;