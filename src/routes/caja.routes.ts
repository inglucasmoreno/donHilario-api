import Router from 'express';
import { check } from 'express-validator';

import { validaciones } from '../middlewares/validations';
import { CajasController } from '../controllers/cajas.controllers';

const router = Router();

// Obtener saldo Inicial
// GET - http://localhost:3000/api/cajas/saldo_inicial
router.get('/saldo_inicial', validaciones.jwt, CajasController.getSaldoInicial);

// Cajas por ID
// GET - http://localhost:3000/api/cajas/:id
router.get('/:id', validaciones.jwt, CajasController.getCaja);

// Listar cajas
// GET - http://localhost:3000/api/cajas
router.get('/', validaciones.jwt, CajasController.listarCajas);

// Nueva caja
router.post('/', validaciones.jwt, [
    check('saldo_inicial', 'El saldo inicial es un campo obligatorio').not().isEmpty(),
    check('total_balanza', 'El total de balanza es un campo obligatorio').not().isEmpty(),
    check('total_mercaderia', 'El total en mercaderia es un campo obligatorio').not().isEmpty(),
    check('total_efectivo', 'El total en efectivo es un campo obligatorio').not().isEmpty(),
    check('total_efectivo_real', 'El total en efectivo real es un campo obligatorio').not().isEmpty(),
    check('diferencia', 'La diferencia es un campo obligatorio').not().isEmpty(),
    check('total_postnet', 'El total de postnet es un campo obligatorio').not().isEmpty(),
    check('total_ventas', 'El total de ventas es un campo obligatorio').not().isEmpty(),
    check('otros_ingresos', 'Los otros ingresos es un campo obligatorio').not().isEmpty(),
    check('otros_gastos', 'Los otros gastos es un campo obligatorio').not().isEmpty(),
]                
,CajasController.nuevaCaja);

// Actualizar saldo inicial
// PUT - http://localhost:3000/api/cajas/saldo_inicial
router.put('/saldo_inicial', validaciones.jwt, CajasController.saldoInicial);

export default router;