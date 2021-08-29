"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const validations_1 = require("../middlewares/validations");
const ventas_controllers_1 = require("../controllers/ventas.controllers");
const router = express_1.default();
// Venta por ID
// GET - http://localhost:3000/api/ventas/:id 
router.get('/:id', validations_1.validaciones.jwt, ventas_controllers_1.VentasController.getVenta);
// Listar ventas
// GET - http://localhost:3000/api/ventas
// Parametros: columna | direccion
router.get('/', validations_1.validaciones.jwt, ventas_controllers_1.VentasController.listarVentas);
// Nueva venta
// POST - http://localhost:3000/api/ventas 
router.post('/', [
    validations_1.validaciones.jwt,
    express_validator_1.check('precio_total', 'El precio total es un campo obligatorio').not().isEmpty(),
    express_validator_1.check('total_balanza', 'El total de balanza es un campo obligatorio').not().isEmpty(),
    express_validator_1.check('total_mercaderia', 'El total de mercaderia es un campo obligatorio').not().isEmpty(),
    express_validator_1.check('forma_pago', 'La forma de pago es un campo obligatorio').not().isEmpty(),
    express_validator_1.check('descuento_porcentual', 'El descuento porcentual es un campo obligatorio').not().isEmpty(),
    validations_1.validaciones.campos
], ventas_controllers_1.VentasController.nuevaVenta);
// Actualizar venta
// PUT - http://localhost:3000/api/ventas/:id 
router.put('/:id', validations_1.validaciones.jwt, ventas_controllers_1.VentasController.actualizarVenta);
exports.default = router;
