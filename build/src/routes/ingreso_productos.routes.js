"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const validations_1 = require("../middlewares/validations");
const ingreso_productos_controllers_1 = require("../controllers/ingreso_productos.controllers");
const router = express_1.default();
// Productos por ID (id de producto)
// GET - http://localhost:3000/api/ingreso_producto/:id
router.get('/:id', validations_1.validaciones.jwt, ingreso_productos_controllers_1.IngresoProductoController.getProducto);
// Productos por ingreso 
// GET - http://localhost:3000/api/ingreso_producto/ingreso/:ingreso 
router.get('/ingreso/:ingreso', validations_1.validaciones.jwt, ingreso_productos_controllers_1.IngresoProductoController.productosPorIngreso);
// Listar productos
// GET - http://localhost:3000/api/ingreso_producto
// Parametros: columna | direccion
router.get('/', validations_1.validaciones.jwt, ingreso_productos_controllers_1.IngresoProductoController.listarProductos);
// Nuevo producto
// POST - http://localhost:3000/api/ingreso_producto
router.post('/', [
    validations_1.validaciones.jwt,
    express_validator_1.check('codigo', 'El codigo es un campo obligatorio').not().isEmpty(),
    express_validator_1.check('ingreso', 'El ingreso es un campo obligatorio').not().isEmpty(),
    express_validator_1.check('cantidad', 'La cantidad es un campo obligatorio').not().isEmpty(),
    validations_1.validaciones.campos
], ingreso_productos_controllers_1.IngresoProductoController.nuevoProducto);
// Actualizar producto
// PUT - http://localhost:3000/api/ingresos_producto/:id
router.put('/:id', validations_1.validaciones.jwt, ingreso_productos_controllers_1.IngresoProductoController.actualizarProducto);
// Eliminar producto
// DELETE - http://localhost:3000/api/ingresos_producto/:id
router.delete('/:id', validations_1.validaciones.jwt, ingreso_productos_controllers_1.IngresoProductoController.eliminarProducto);
exports.default = router;
