"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const validations_1 = require("../middlewares/validations");
const ventas_productos_controllers_1 = require("../controllers/ventas_productos.controllers");
const router = express_1.default();
// Venta por ID
// GET - http://localhost:3000/api/ventas_productos/:id 
router.get('/:id', validations_1.validaciones.jwt, ventas_productos_controllers_1.VentasProductosController.getProducto);
// Listar productos
// GET - http://localhost:3000/api/ventas_productos
// Parametros: columna | direccion
router.get('/', validations_1.validaciones.jwt, ventas_productos_controllers_1.VentasProductosController.listarProductos);
// Listar productos por venta
// GET - http://localhost:3000/api/ventas_productos/venta/:venta
// Parametros: columna | direccion
router.get('/venta/:venta', validations_1.validaciones.jwt, ventas_productos_controllers_1.VentasProductosController.listarProductosPorVenta);
// Nuevo producto
// POST - http://localhost:3000/api/ventas_productos
router.post('/', [
    validations_1.validaciones.jwt,
    express_validator_1.check('producto', 'El producto es un campo obligatorio').not().isEmpty(),
    express_validator_1.check('precio_unitario', 'El precio unitario es un campo obligatorio').not().isEmpty(),
    express_validator_1.check('precio_total', 'El precio total es un campo obligatorio').not().isEmpty(),
    validations_1.validaciones.campos
], ventas_productos_controllers_1.VentasProductosController.nuevoProducto);
// Actualizar producto
// PUT - http://localhost:3000/api/ventas_productos/:id 
router.put('/:id', validations_1.validaciones.jwt, ventas_productos_controllers_1.VentasProductosController.actualizarProducto);
// Eliminar producto
// DELETE - http://localhost:3000/api/ventas_productos/:id 
router.delete('/:id', validations_1.validaciones.jwt, ventas_productos_controllers_1.VentasProductosController.eliminarProducto);
exports.default = router;
