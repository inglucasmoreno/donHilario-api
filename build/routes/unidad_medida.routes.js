"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const validations_1 = require("../middlewares/validations");
const unidad_medida_controllers_1 = require("../controllers/unidad_medida.controllers");
const router = express_1.default();
// Unidad de medida por ID
// GET - http://localhost:3000/api/unidad_medida/:id 
router.get('/:id', validations_1.validaciones.jwt, unidad_medida_controllers_1.UnidadMedidaController.getUnidad);
// Listar unidades de medida
// GET - http://localhost:3000/api/unidad_medida
// Parametros: columna | direccion | descripcion | activo
router.get('/', validations_1.validaciones.jwt, unidad_medida_controllers_1.UnidadMedidaController.listarUnidades);
//Nueva unidad de medida 
// POST - http://localhost:3000/api/unidad_medida
router.post('/', [
    validations_1.validaciones.jwt,
    express_validator_1.check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
    validations_1.validaciones.campos
], unidad_medida_controllers_1.UnidadMedidaController.nuevaUnidad);
// Actualizar unidad de medida
// PUT - http://localhost:3000/api/unidad_medida/:id 
router.put('/:id', validations_1.validaciones.jwt, unidad_medida_controllers_1.UnidadMedidaController.actualizarUnidad);
exports.default = router;
