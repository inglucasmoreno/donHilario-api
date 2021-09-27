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
exports.IngresoProductoController = void 0;
const chalk_1 = __importDefault(require("chalk"));
const response_1 = require("../helpers/response");
const producto_model_1 = __importDefault(require("../models/producto.model"));
const usuarios_model_1 = __importDefault(require("../models/usuarios.model"));
const mediaRes_model_1 = __importDefault(require("../models/mediaRes.model"));
const cerdo_model_1 = __importDefault(require("../models/cerdo.model"));
const pollo_model_1 = __importDefault(require("../models/pollo.model"));
const ingreso_productos_model_1 = __importDefault(require("../models/ingreso_productos.model"));
const mongoose_1 = __importDefault(require("mongoose"));
class IngresoProducto {
    // Metodo: Producto - Ingreso por ID
    getProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const producto = yield ingreso_productos_model_1.default.findById(id)
                    .populate('ingreso')
                    .populate('producto');
                response_1.respuesta.success(res, { producto });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Productos por ingreso
    productosPorIngreso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { ingreso } = req.params;
                const pipeline = [];
                // Filtrado por ingreso
                pipeline.push({ $match: { ingreso: mongoose_1.default.Types.ObjectId(ingreso) } });
                // Join (Productos)
                pipeline.push({ $lookup: {
                        from: 'productos',
                        localField: 'producto',
                        foreignField: '_id',
                        as: 'producto'
                    } });
                pipeline.push({ $unwind: '$producto' });
                // Join (Producto - Unidad de medida)
                pipeline.push({ $lookup: {
                        from: 'unidad_medida',
                        localField: 'producto.unidad_medida',
                        foreignField: '_id',
                        as: 'producto.unidad_medida'
                    } });
                pipeline.push({ $unwind: '$producto.unidad_medida' });
                // Ordenando datos
                const ordenar = {};
                if (req.query.columna) {
                    ordenar[req.query.columna] = Number(req.query.direccion);
                    pipeline.push({ $sort: ordenar });
                }
                const productos = yield ingreso_productos_model_1.default.aggregate(pipeline);
                response_1.respuesta.success(res, { productos });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Nueva media res
    nuevaMediaRes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const uid = req.uid;
                const { idIngreso, cantidad, proveedor } = req.body;
                // Se traen los productos de la media res
                const productos = yield mediaRes_model_1.default.find();
                // Se buscan los datos del usuario logueado
                const usuarioLogin = yield usuarios_model_1.default.findById(uid, 'apellido nombre');
                const usuario_creacion = usuarioLogin.apellido + ' ' + usuarioLogin.nombre;
                // Se verifica si ya hay un corte de res cargado
                const productosIngreso = yield ingreso_productos_model_1.default.find({ ingreso: idIngreso });
                for (let prodIngreso of productosIngreso) {
                    for (let producto of productos) {
                        if (String(producto.id_producto) === String(prodIngreso.producto)) {
                            return response_1.respuesta.error(res, 400, 'Corte de media res repetido');
                        }
                    }
                }
                // Ingreso de productos
                productos.forEach((producto) => __awaiter(this, void 0, void 0, function* () {
                    const nuevoProducto = new ingreso_productos_model_1.default({
                        activo: true,
                        ingreso: idIngreso,
                        producto: producto.id_producto,
                        proveedor,
                        cantidad: Number((producto.cantidad * cantidad).toFixed(2)),
                        usuario_creacion
                    });
                    yield nuevoProducto.save();
                }));
                response_1.respuesta.success(res, 'Media res cargada');
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Nuevo cerdo
    nuevoCerdo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const uid = req.uid;
                const { idIngreso, cantidad, proveedor } = req.body;
                // Se traen los productos del cerdo
                const productos = yield cerdo_model_1.default.find();
                // Se buscan los datos del usuario logueado
                const usuarioLogin = yield usuarios_model_1.default.findById(uid, 'apellido nombre');
                const usuario_creacion = usuarioLogin.apellido + ' ' + usuarioLogin.nombre;
                // Se verifica si ya hay un corte de cerdo cargado
                const productosIngreso = yield ingreso_productos_model_1.default.find({ ingreso: idIngreso });
                for (let prodIngreso of productosIngreso) {
                    for (let producto of productos) {
                        if (String(producto.id_producto) === String(prodIngreso.producto)) {
                            return response_1.respuesta.error(res, 400, 'Corte de cerdo repetido');
                        }
                    }
                }
                // Ingreso de productos
                productos.forEach((producto) => __awaiter(this, void 0, void 0, function* () {
                    const nuevoProducto = new ingreso_productos_model_1.default({
                        activo: true,
                        ingreso: idIngreso,
                        producto: producto.id_producto,
                        proveedor,
                        cantidad: Number((producto.cantidad * cantidad).toFixed(2)),
                        usuario_creacion
                    });
                    yield nuevoProducto.save();
                }));
                response_1.respuesta.success(res, 'Cerdo cargado');
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Nuevo pollo
    nuevoPollo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const uid = req.uid;
                const { idIngreso, cantidad, proveedor } = req.body;
                // Se traen los productos del pollo
                const productos = yield pollo_model_1.default.find();
                // Se buscan los datos del usuario logueado
                const usuarioLogin = yield usuarios_model_1.default.findById(uid, 'apellido nombre');
                const usuario_creacion = usuarioLogin.apellido + ' ' + usuarioLogin.nombre;
                // Se verifica si ya hay un corte de pollo cargado
                const productosIngreso = yield ingreso_productos_model_1.default.find({ ingreso: idIngreso });
                for (let prodIngreso of productosIngreso) {
                    for (let producto of productos) {
                        if (String(producto.id_producto) === String(prodIngreso.producto)) {
                            return response_1.respuesta.error(res, 400, 'Corte de pollo repetido');
                        }
                    }
                }
                // Ingreso de productos
                productos.forEach((producto) => __awaiter(this, void 0, void 0, function* () {
                    const nuevoProducto = new ingreso_productos_model_1.default({
                        activo: true,
                        ingreso: idIngreso,
                        producto: producto.id_producto,
                        proveedor,
                        cantidad: Number((producto.cantidad * cantidad).toFixed(2)),
                        usuario_creacion
                    });
                    yield nuevoProducto.save();
                }));
                response_1.respuesta.success(res, 'Cerdo cargado');
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Nuevo Producto - Ingreso
    nuevoProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const uid = req.uid;
                let { codigo, ingreso, proveedor, cantidad } = req.body;
                let producto;
                // Se busca el producto como tipo: normal
                producto = yield producto_model_1.default.findOne({ codigo });
                if (!producto) {
                    // Se busca el producto como tipo: balanza
                    const codigoBalanza = codigo.slice(0, 7);
                    producto = yield producto_model_1.default.findOne({ codigo: codigoBalanza });
                    codigo = codigoBalanza;
                    if (!producto)
                        return response_1.respuesta.error(res, 400, 'El producto no existe');
                }
                // Se verifica si el producto ya esta cargado en el ingreso
                const productoCargado = yield ingreso_productos_model_1.default.findOne({ producto: producto._id, ingreso });
                if (productoCargado)
                    return response_1.respuesta.error(res, 400, 'El producto ya esta cargado');
                // Se buscan los datos del usuario logueado
                const usuarioLogin = yield usuarios_model_1.default.findById(uid, 'apellido nombre');
                const usuario_creacion = usuarioLogin.apellido + ' ' + usuarioLogin.nombre;
                // Se crea el nuevo productoIngreso
                const data = { ingreso, producto: producto._id, proveedor, cantidad, usuario_creacion };
                const ingresoProducto = new ingreso_productos_model_1.default(data);
                const response = yield ingresoProducto.save();
                response_1.respuesta.success(res, { producto: response });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Listar Producto - Ingreso
    listarProductos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productos = yield ingreso_productos_model_1.default.find();
                response_1.respuesta.success(res, { productos });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Actualizar Producto - Ingreso por ID
    actualizarProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const producto = yield ingreso_productos_model_1.default.findByIdAndUpdate(id, req.body, { new: true });
                response_1.respuesta.success(res, { producto });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Eliminar Producto - Ingreso por ID
    eliminarProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield ingreso_productos_model_1.default.findByIdAndDelete(id);
                response_1.respuesta.success(res, 'Producto eliminado correctamente');
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
}
exports.IngresoProductoController = new IngresoProducto();
