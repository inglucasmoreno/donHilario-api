"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const validations_1 = require("../middlewares/validations");
const mayoristas_controllers_1 = require("../controllers/mayoristas.controllers");
const router = express_1.default();
// Mayorista por ID
// GET - http://localhost:3000/api/mayoristas/:id 
router.get('/:id', validations_1.validaciones.jwt, mayoristas_controllers_1.MayoristasController.getMayorista);
// Listar mayoristas
// GET - http://localhost:3000/api/mayoristas
// Parametros: columna | direccion | descripcion | activo
router.get('/', validations_1.validaciones.jwt, mayoristas_controllers_1.MayoristasController.listarMayoristas);
// Nuevo mayorista
// POST - http://localhost:3000/api/mayoristas 
router.post('/', [
    validations_1.validaciones.jwt,
    express_validator_1.check('razon_social', 'Razon social es un campo obligatorio').not().isEmpty(),
    express_validator_1.check('cuit', 'Cuit es un campo obligatorio').not().isEmpty(),
    express_validator_1.check('condicion_iva', 'La condicion frente al IVA es un campo obligatorio').not().isEmpty(),
    validations_1.validaciones.campos
], mayoristas_controllers_1.MayoristasController.nuevoMayorista);
// Actualizar mayorista
// PUT - http://localhost:3000/api/mayoristas/:id 
router.put('/:id', validations_1.validaciones.jwt, mayoristas_controllers_1.MayoristasController.actualizarMayorista);
exports.default = router;
