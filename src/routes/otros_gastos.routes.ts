import Router from 'express';
import { check } from 'express-validator';
import { validaciones } from '../middlewares/validations';
import { OtrosGastosController } from '../controllers/otros_gastos.controllers';

const router = Router();

// Listar gastos por caja
// GET - http://localhost:3000/api/otros_gastos/:caja
// Parametros: columna | direccion
router.get('/:caja', validaciones.jwt, OtrosGastosController.listarGastosPorCaja);

// Nuevo gasto
// POST - http://localhost:3000/api/otros_gastos
router.post('/', 
            [    
                validaciones.jwt,
                check('descripcion', 'La descripcion es un campo obligatorio').not().isEmpty(),
                check('monto', 'El monto es un campo obligatorio').not().isEmpty(),
                validaciones.campos
            ], OtrosGastosController.nuevoGasto);

// Eliminar gasto
// DELETE - http://localhost:3000/api/otros_gastos/:id
router.put('/:id', validaciones.jwt, OtrosGastosController.eliminarGasto);

export default router;