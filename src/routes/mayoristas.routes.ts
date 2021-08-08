import Router from 'express';
import { check } from 'express-validator';

import { validaciones } from '../middlewares/validations';
import { MayoristasController } from '../controllers/mayoristas.controllers';

const router = Router();

// Mayorista por ID
// GET - http://localhost:3000/api/mayoristas/:id 
router.get('/:id', validaciones.jwt, MayoristasController.getMayorista);

// Listar mayoristas
// GET - http://localhost:3000/api/mayoristas
// Parametros: columna | direccion | descripcion | activo
router.get('/', validaciones.jwt, MayoristasController.listarMayoristas);

// Nuevo mayorista
// POST - http://localhost:3000/api/mayoristas 
router.post('/', 
            [    
                validaciones.jwt,
                check('razon_social', 'Razon social es un campo obligatorio').not().isEmpty(),
                check('cuit', 'Cuit es un campo obligatorio').not().isEmpty(),
                check('condicion_iva', 'La condicion frente al IVA es un campo obligatorio').not().isEmpty(),
                validaciones.campos
            ], MayoristasController.nuevoMayorista);

// Actualizar mayorista
// PUT - http://localhost:3000/api/mayoristas/:id 
router.put('/:id', validaciones.jwt, MayoristasController.actualizarMayorista);

export default router;