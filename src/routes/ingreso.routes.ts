import Router from 'express';
import { check } from 'express-validator';
import { validaciones } from '../middlewares/validations';
import { IngresoController } from '../controllers/ingresos.controllers';

const router = Router();

// Ingreso por ID
// GET - http://localhost:3000/api/ingresos/:id 
router.get('/:id', validaciones.jwt, IngresoController.getIngreso);

// Listar Ingresos
// GET - http://localhost:3000/api/productos
// Parametros: columna | direccion
router.get('/', validaciones.jwt, IngresoController.listarIngresos);

// Nuevo ingreso
// POST - http://localhost:3000/api/ingresos
router.post('/', 
            [    
                validaciones.jwt,
                check('proveedor', 'El proveedor es un campo obligatorio').not().isEmpty(),
                validaciones.campos
            ], IngresoController.nuevoIngreso);

// Actualizar ingreso
// PUT - http://localhost:3000/api/ingresos/:id
router.put('/:id', validaciones.jwt, IngresoController.actualizarIngreso);


export default router;