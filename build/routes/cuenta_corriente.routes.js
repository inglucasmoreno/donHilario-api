"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const validations_1 = require("../middlewares/validations");
const cuenta_corriente_controllers_1 = require("../controllers/cuenta_corriente.controllers");
const router = express_1.default();
// Cuenta Corriente por ID
// GET - http://localhost:3000/api/cuenta_corriente/:id 
router.get('/:id', validations_1.validaciones.jwt, cuenta_corriente_controllers_1.CuentaCorrienteController.getCuentaCorriente);
// Listar cuentas corrientes x Usuario
// GET - http://localhost:3000/api/cuenta_corriente/usuario/:usuario
// Parametros: columna | direccion | descripcion | activo
router.get('/usuario/:usuario', validations_1.validaciones.jwt, cuenta_corriente_controllers_1.CuentaCorrienteController.listarCuentasCorrientes);
// Nueva cuenta corriente
// POST - http://localhost:3000/api/cuenta_corriente
router.post('/', [
    validations_1.validaciones.jwt,
    express_validator_1.check('usuario', 'El usuario es un campo obligatorio').not().isEmpty(),
    express_validator_1.check('total', 'El total es un campo obligatorio').not().isEmpty(),
    validations_1.validaciones.campos
], cuenta_corriente_controllers_1.CuentaCorrienteController.nuevaCuentaCorriente);
// Actualizar cuenta corriente
// PUT - http://localhost:3000/api/cuenta_corriente/:id 
router.put('/:id', validations_1.validaciones.jwt, cuenta_corriente_controllers_1.CuentaCorrienteController.actualizarCuentaCorriente);
// Completar cuentas corrientes (Ingresos)
// PUT - http://localhost:3000/api/cuenta_corriente/todos/:usuario 
router.put('/todos/:usuario', validations_1.validaciones.jwt, cuenta_corriente_controllers_1.CuentaCorrienteController.completarCuentasCorrientes);
exports.default = router;
