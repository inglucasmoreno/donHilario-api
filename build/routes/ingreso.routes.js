"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const validations_1 = require("../middlewares/validations");
const ingresos_controllers_1 = require("../controllers/ingresos.controllers");
const router = express_1.default();
// Ingreso por ID
// GET - http://localhost:3000/api/ingresos/:id 
router.get('/:id', validations_1.validaciones.jwt, ingresos_controllers_1.IngresoController.getIngreso);
// Listar Ingresos
// GET - http://localhost:3000/api/productos
// Parametros: columna | direccion
router.get('/', validations_1.validaciones.jwt, ingresos_controllers_1.IngresoController.listarIngresos);
// Nuevo ingreso
// POST - http://localhost:3000/api/ingresos
router.post('/', [
    validations_1.validaciones.jwt,
    express_validator_1.check('proveedor', 'El proveedor es un campo obligatorio').not().isEmpty(),
    validations_1.validaciones.campos
], ingresos_controllers_1.IngresoController.nuevoIngreso);
// Actualizar ingreso
// PUT - http://localhost:3000/api/ingresos/:id
router.put('/:id', validations_1.validaciones.jwt, ingresos_controllers_1.IngresoController.actualizarIngreso);
exports.default = router;
