"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const validations_1 = require("../middlewares/validations");
const cajas_controllers_1 = require("../controllers/cajas.controllers");
const router = express_1.default();
// Obtener saldo Inicial
// GET - http://localhost:3000/api/cajas/saldo_inicial
router.get('/saldo_inicial', validations_1.validaciones.jwt, cajas_controllers_1.CajasController.getSaldoInicial);
// Cajas por ID
// GET - http://localhost:3000/api/cajas/:id
router.get('/:id', validations_1.validaciones.jwt, cajas_controllers_1.CajasController.getCaja);
// Listar cajas
// GET - http://localhost:3000/api/cajas
router.get('/', validations_1.validaciones.jwt, cajas_controllers_1.CajasController.listarCajas);
// Nueva caja
router.post('/', validations_1.validaciones.jwt, [
    express_validator_1.check('saldo_inicial', 'El saldo inicial es un campo obligatorio').not().isEmpty(),
    express_validator_1.check('total_balanza', 'El total de balanza es un campo obligatorio').not().isEmpty(),
    express_validator_1.check('total_mercaderia', 'El total en mercaderia es un campo obligatorio').not().isEmpty(),
    express_validator_1.check('total_efectivo', 'El total en efectivo es un campo obligatorio').not().isEmpty(),
    express_validator_1.check('total_efectivo_real', 'El total en efectivo real es un campo obligatorio').not().isEmpty(),
    express_validator_1.check('diferencia', 'La diferencia es un campo obligatorio').not().isEmpty(),
    express_validator_1.check('total_postnet', 'El total de postnet es un campo obligatorio').not().isEmpty(),
    express_validator_1.check('total_ventas', 'El total de ventas es un campo obligatorio').not().isEmpty(),
    express_validator_1.check('otros_ingresos', 'Los otros ingresos es un campo obligatorio').not().isEmpty(),
    express_validator_1.check('otros_gastos', 'Los otros gastos es un campo obligatorio').not().isEmpty(),
], cajas_controllers_1.CajasController.nuevaCaja);
// Actualizar saldo inicial
// PUT - http://localhost:3000/api/cajas/saldo_inicial
router.put('/saldo_inicial', validations_1.validaciones.jwt, cajas_controllers_1.CajasController.saldoInicial);
exports.default = router;
