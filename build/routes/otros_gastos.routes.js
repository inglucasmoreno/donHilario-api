"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const validations_1 = require("../middlewares/validations");
const otros_gastos_controllers_1 = require("../controllers/otros_gastos.controllers");
const router = express_1.default();
// Listar gastos por caja
// GET - http://localhost:3000/api/otros_gastos/:caja
// Parametros: columna | direccion
router.get('/:caja', validations_1.validaciones.jwt, otros_gastos_controllers_1.OtrosGastosController.listarGastosPorCaja);
// Nuevo gasto
// POST - http://localhost:3000/api/otros_gastos
router.post('/', [
    validations_1.validaciones.jwt,
    express_validator_1.check('descripcion', 'La descripcion es un campo obligatorio').not().isEmpty(),
    express_validator_1.check('monto', 'El monto es un campo obligatorio').not().isEmpty(),
    validations_1.validaciones.campos
], otros_gastos_controllers_1.OtrosGastosController.nuevoGasto);
// Eliminar gasto
// DELETE - http://localhost:3000/api/otros_gastos/:id
router.put('/:id', validations_1.validaciones.jwt, otros_gastos_controllers_1.OtrosGastosController.eliminarGasto);
exports.default = router;
