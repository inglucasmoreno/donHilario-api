import Router from 'express';
import { check } from 'express-validator';

import { validaciones } from '../middlewares/validations';
import { TmpIngresosGastosController } from '../controllers/tmp_ingresos_gastos.controllers';

const router = Router();

// Listar elementos
// GET - http://localhost:3000/api/tmp_ingresos_gastos
// Parametros: columna | direccion
router.get('/', validaciones.jwt, TmpIngresosGastosController.listarElementos);

// Nuevo elemento
// POST - http://localhost:3000/api/tmp_ingresos_gastos
router.post('/', 
            [    
                validaciones.jwt,
                check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
                check('tipo', 'El tipo es obligatorio').not().isEmpty(),
                check('monto', 'El monto es obligatorio').not().isEmpty(),
                validaciones.campos
            ], TmpIngresosGastosController.nuevoElemento);

// Eliminar elemento
// DELETE - http://localhost:3000/api/tmp_ingresos_gastos/:id 
router.delete('/:id', validaciones.jwt, TmpIngresosGastosController.eliminarElemento);

// Eliminar todos los elementos
// DELETE - http://localhost:3000/api/tmp_ingresos_gastos/limpiar/all
router.delete('/limpiar/all', validaciones.jwt, TmpIngresosGastosController.limpiarElementos);

export default router;