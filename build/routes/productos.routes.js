"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const validations_1 = require("../middlewares/validations");
const productos_controllers_1 = require("../controllers/productos.controllers");
const router = express_1.default();
// Producto por ID
// GET - http://localhost:3000/api/productos/:id 
router.get('/:id', validations_1.validaciones.jwt, productos_controllers_1.ProductosController.getProducto);
// Listar productos
// GET - http://localhost:3000/api/productos
// Parametros: columna | direccion | desde | limit | codigo | descripcion | activo
router.get('/', validations_1.validaciones.jwt, productos_controllers_1.ProductosController.listarProductos);
//Nuevo producto
// POST - http://localhost:3000/api/productos
router.post('/', [
    validations_1.validaciones.jwt,
    express_validator_1.check('codigo', 'Codigo es un campo obligatorio').not().isEmpty(),
    express_validator_1.check('descripcion', 'Descripcion es un campo obligatorio').not().isEmpty(),
    express_validator_1.check('unidad_medida', 'Unidad de medida es un campo obligatorio').not().isEmpty(),
    express_validator_1.check('cantidad', 'Cantidad es un campo obligatorio').not().isEmpty(),
    express_validator_1.check('stock_minimo', 'Stock minimo es un campo obligatorio').not().isEmpty(),
    express_validator_1.check('precio', 'Precio es un campo obligatorio').not().isEmpty(),
    validations_1.validaciones.campos
], productos_controllers_1.ProductosController.nuevoProducto);
// Actualizar producto
// PUT - http://localhost:3000/api/productos/:id 
router.put('/:id', validations_1.validaciones.jwt, productos_controllers_1.ProductosController.actualizarProducto);
exports.default = router;
