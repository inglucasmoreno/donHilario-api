"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const validations_1 = require("../middlewares/validations");
const otros_ingresos_controllers_1 = require("../controllers/otros_ingresos.controllers");
const router = express_1.default();
// Listar ingresos por caja
// GET - http://localhost:3000/api/otros_ingresos/:caja
// Parametros: columna | direccion
router.get('/:caja', validations_1.validaciones.jwt, otros_ingresos_controllers_1.OtrosIngresosController.listarIngresosPorCaja);
// Nuevo ingreso
// POST - http://localhost:3000/api/otros_ingresos
router.post('/', [
    validations_1.validaciones.jwt,
    express_validator_1.check('descripcion', 'La descripcion es un campo obligatorio').not().isEmpty(),
    express_validator_1.check('monto', 'El monto es un campo obligatorio').not().isEmpty(),
    validations_1.validaciones.campos
], otros_ingresos_controllers_1.OtrosIngresosController.nuevoIngreso);
// Eliminar ingreso
// DELETE - http://localhost:3000/api/otros_ingresos/:id
router.put('/:id', validations_1.validaciones.jwt, otros_ingresos_controllers_1.OtrosIngresosController.eliminarIngreso);
exports.default = router;
