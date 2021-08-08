"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const validations_1 = require("../middlewares/validations");
const proveedores_controllers_1 = require("../controllers/proveedores.controllers");
const router = express_1.default();
// Proveedor por ID
// GET - http://localhost:3000/api/proveedores/:id 
router.get('/:id', validations_1.validaciones.jwt, proveedores_controllers_1.ProveedoresController.getProveedor);
// Listar proveedores
// GET - http://localhost:3000/api/proveedores
// Parametros: columna | direccion | desde | limit | descripcion | activo
router.get('/', validations_1.validaciones.jwt, proveedores_controllers_1.ProveedoresController.listarProveedores);
// Nuevo proveedor
// POST - http://localhost:3000/api/proveedores 
router.post('/', [
    validations_1.validaciones.jwt,
    express_validator_1.check('razon_social', 'Razon social es un campo obligatorio').not().isEmpty(),
    express_validator_1.check('cuit', 'Cuit es un campo obligatorio').not().isEmpty(),
    express_validator_1.check('condicion_iva', 'La condicion frente al IVA es un campo obligatorio').not().isEmpty(),
    validations_1.validaciones.campos
], proveedores_controllers_1.ProveedoresController.nuevoProveedor);
// Actualizar proveedores
// PUT - http://localhost:3000/api/proveedores/:id 
router.put('/:id', validations_1.validaciones.jwt, proveedores_controllers_1.ProveedoresController.actualizarProveedor);
exports.default = router;
