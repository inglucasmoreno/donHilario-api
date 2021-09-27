"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const validations_1 = require("../middlewares/validations");
const produccion_interna_controllers_1 = require("../controllers/produccion_interna.controllers");
const router = express_1.default();
// Listar producciones interna
// GET - http://localhost:3000/api/produccion-interna
router.get('/', validations_1.validaciones.jwt, produccion_interna_controllers_1.ProduccionInternaController.listarProduccionInterna);
// Nueva produccion interna
// POST - http://localhost:3000/api/produccion-interna
router.post('/', [
    validations_1.validaciones.jwt,
    express_validator_1.check('producto_entrada', 'El producto de entrada es un campo obligatorio').not().isEmpty(),
    express_validator_1.check('producto_salida', 'El producto de salida es un campo obligatorio').not().isEmpty(),
    express_validator_1.check('cantidad_entrada', 'La cantidad de entrada es un campo obligatorio').not().isEmpty(),
    express_validator_1.check('cantidad_salida', 'La cantidad de salida es un campo obligatorio').not().isEmpty(),
    validations_1.validaciones.campos
], produccion_interna_controllers_1.ProduccionInternaController.nuevaProduccionInterna);
// Completar produccion interna
// PUT - http://localhost:3000/api/produccion-interna/:id 
router.put('/completar', validations_1.validaciones.jwt, produccion_interna_controllers_1.ProduccionInternaController.completarProduccionInterna);
// Actualizar produccion interna
// PUT - http://localhost:3000/api/produccion-interna/:id 
router.put('/:id', validations_1.validaciones.jwt, produccion_interna_controllers_1.ProduccionInternaController.actualizarProduccionInterna);
// Eliminar produccion interna
// DELETE - http://localhost:3000/api/produccion-interna/:id 
router.delete('/:id', validations_1.validaciones.jwt, produccion_interna_controllers_1.ProduccionInternaController.eliminarProduccionInterna);
exports.default = router;
