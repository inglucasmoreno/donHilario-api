import Router from 'express';
import { check } from 'express-validator';
import { validaciones } from '../middlewares/validations';
import { OtrosIngresosController } from '../controllers/otros_ingresos.controllers';

const router = Router();

// Listar ingresos por caja
// GET - http://localhost:3000/api/otros_ingresos/:caja
// Parametros: columna | direccion
router.get('/:caja', validaciones.jwt, OtrosIngresosController.listarIngresosPorCaja);

// Nuevo ingreso
// POST - http://localhost:3000/api/otros_ingresos
router.post('/', 
            [    
                validaciones.jwt,
                check('descripcion', 'La descripcion es un campo obligatorio').not().isEmpty(),
                check('monto', 'El monto es un campo obligatorio').not().isEmpty(),
                validaciones.campos
            ], OtrosIngresosController.nuevoIngreso);

// Eliminar ingreso
// DELETE - http://localhost:3000/api/otros_ingresos/:id
router.put('/:id', validaciones.jwt, OtrosIngresosController.eliminarIngreso);

export default router;