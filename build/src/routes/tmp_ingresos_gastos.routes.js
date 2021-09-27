"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const validations_1 = require("../middlewares/validations");
const tmp_ingresos_gastos_controllers_1 = require("../controllers/tmp_ingresos_gastos.controllers");
const router = express_1.default();
// Listar elementos
// GET - http://localhost:3000/api/tmp_ingresos_gastos
// Parametros: columna | direccion
router.get('/', validations_1.validaciones.jwt, tmp_ingresos_gastos_controllers_1.TmpIngresosGastosController.listarElementos);
// Nuevo elemento
// POST - http://localhost:3000/api/tmp_ingresos_gastos
router.post('/', [
    validations_1.validaciones.jwt,
    express_validator_1.check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
    express_validator_1.check('tipo', 'El tipo es obligatorio').not().isEmpty(),
    express_validator_1.check('monto', 'El monto es obligatorio').not().isEmpty(),
    validations_1.validaciones.campos
], tmp_ingresos_gastos_controllers_1.TmpIngresosGastosController.nuevoElemento);
// Eliminar elemento
// DELETE - http://localhost:3000/api/tmp_ingresos_gastos/:id 
router.delete('/:id', validations_1.validaciones.jwt, tmp_ingresos_gastos_controllers_1.TmpIngresosGastosController.eliminarElemento);
// Eliminar todos los elementos
// DELETE - http://localhost:3000/api/tmp_ingresos_gastos/limpiar/all
router.delete('/limpiar/all', validations_1.validaciones.jwt, tmp_ingresos_gastos_controllers_1.TmpIngresosGastosController.limpiarElementos);
exports.default = router;
