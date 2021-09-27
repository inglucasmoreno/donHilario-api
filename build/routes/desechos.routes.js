"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const validations_1 = require("../middlewares/validations");
const desechos_controllers_1 = require("../controllers/desechos.controllers");
const router = express_1.default();
// Desecho por ID
// GET - http://localhost:3000/api/desechos/:id 
router.get('/:id', validations_1.validaciones.jwt, desechos_controllers_1.DesechoController.getDesecho);
// Listar Desechos
// GET - http://localhost:3000/api/desechos
router.get('/', validations_1.validaciones.jwt, desechos_controllers_1.DesechoController.listarDesechos);
// Nuevo Desecho
// POST - http://localhost:3000/api/desechos 
router.post('/', [
    validations_1.validaciones.jwt,
    express_validator_1.check('descripcion', 'La descripcion es un campo obligatorio').not().isEmpty(),
    express_validator_1.check('cantidad', 'La cantidad es un campo obligatorio').not().isEmpty(),
    validations_1.validaciones.campos
], desechos_controllers_1.DesechoController.nuevoDesecho);
// Completar Desechos
// PUT - http://localhost:3000/api/desechos/:id 
router.put('/completar', validations_1.validaciones.jwt, desechos_controllers_1.DesechoController.completarDesechos);
// Actualizar desecho
// PUT - http://localhost:3000/api/desechos/:id 
router.put('/:id', validations_1.validaciones.jwt, desechos_controllers_1.DesechoController.actualizarDesecho);
// Eliminar desecho
// DELETE - http://localhost:3000/api/desechos/:id 
router.delete('/:id', validations_1.validaciones.jwt, desechos_controllers_1.DesechoController.eliminarDesecho);
exports.default = router;
