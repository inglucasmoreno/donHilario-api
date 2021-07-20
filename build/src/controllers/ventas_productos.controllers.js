"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VentasProductosController = void 0;
const chalk_1 = __importDefault(require("chalk"));
const response_1 = require("../helpers/response");
const venta_productos_model_1 = __importDefault(require("../models/venta_productos.model"));
const usuarios_model_1 = __importDefault(require("../models/usuarios.model"));
const mongoose_1 = __importDefault(require("mongoose"));
class VentasProductos {
    // Metodo: producto por ID
    getProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const producto = yield venta_productos_model_1.default.findById(id);
                if (!producto)
                    return response_1.respuesta.error(res, 400, 'El producto no existe');
                response_1.respuesta.success(res, { producto });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: nuevo producto
    nuevoProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { uid } = req;
                // Se agregar el usuario creador a la data
                const usuarioLogin = yield usuarios_model_1.default.findById(uid, 'apellido nombre');
                const usuario_creacion = usuarioLogin.apellido + ' ' + usuarioLogin.nombre;
                req.body.usuario_creacion = usuario_creacion;
                const producto = new venta_productos_model_1.default(req.body);
                const productoCreado = yield producto.save();
                response_1.respuesta.success(res, { producto: productoCreado });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: listar productos
    listarProductos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pipeline = [];
            // Join (productos)
            pipeline.push({
                $lookup: {
                    from: 'productos',
                    localField: 'producto',
                    foreignField: '_id',
                    as: 'producto'
                }
            });
            pipeline.push({ $unwind: '$producto' });
            // Join (productos -> Unidad de medida)
            pipeline.push({
                $lookup: {
                    from: 'unidad_medida',
                    localField: 'producto.unidad_medida',
                    foreignField: '_id',
                    as: 'producto.unidad_medida'
                }
            });
            pipeline.push({ $unwind: '$producto.unidad_medida' });
            // Ordenando datos
            const ordenar = {};
            if (req.query.columna) {
                ordenar[req.query.columna] = Number(req.query.direccion);
                pipeline.push({ $sort: ordenar });
            }
            // Se genera el listado de productos
            const productos = yield venta_productos_model_1.default.aggregate(pipeline);
            response_1.respuesta.success(res, { productos });
        });
    }
    // Metodo: listar productos por venta
    listarProductosPorVenta(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { venta } = req.params;
            const pipeline = [];
            // Matcheo con el ID de venta
            pipeline.push({ $match: { venta: mongoose_1.default.Types.ObjectId(venta) } });
            // Join (productos)
            pipeline.push({
                $lookup: {
                    from: 'productos',
                    localField: 'producto',
                    foreignField: '_id',
                    as: 'producto'
                }
            });
            pipeline.push({ $unwind: '$producto' });
            // Join (productos -> Unidad de medida)
            pipeline.push({
                $lookup: {
                    from: 'unidad_medida',
                    localField: 'producto.unidad_medida',
                    foreignField: '_id',
                    as: 'producto.unidad_medida'
                }
            });
            pipeline.push({ $unwind: '$producto.unidad_medida' });
            // Ordenando datos
            const ordenar = {};
            if (req.query.columna) {
                ordenar[req.query.columna] = Number(req.query.direccion);
                pipeline.push({ $sort: ordenar });
            }
            // Se genera el listado de productos
            const productos = yield venta_productos_model_1.default.aggregate(pipeline);
            response_1.respuesta.success(res, { productos });
        });
    }
    // Metodo: Actualizar producto
    actualizarProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const data = req.body;
                const producto = yield venta_productos_model_1.default.findById(id);
                if (!producto)
                    return response_1.respuesta.error(res, 400, 'El producto no existe');
                const productoActualizado = yield venta_productos_model_1.default.findByIdAndUpdate(id, data, { new: true });
                response_1.respuesta.success(res, { producto: productoActualizado });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Eliminar producto
    eliminarProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const producto = yield venta_productos_model_1.default.findById(id);
                if (!producto)
                    return response_1.respuesta.error(res, 400, 'El producto no existe');
                const productoEliminado = yield venta_productos_model_1.default.findByIdAndRemove(id);
                response_1.respuesta.success(res, { producto: productoEliminado });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
}
exports.VentasProductosController = new VentasProductos();
