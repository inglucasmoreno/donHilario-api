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
exports.ProduccionInternaController = void 0;
const chalk_1 = __importDefault(require("chalk"));
const response_1 = require("../helpers/response");
const usuarios_model_1 = __importDefault(require("../models/usuarios.model"));
const produccion_interna_model_1 = __importDefault(require("../models/produccion_interna.model"));
const producto_model_1 = __importDefault(require("../models/producto.model"));
class ProduccionInterna {
    // Metodo: Nueva produccion interna
    nuevaProduccionInterna(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { uid } = req;
                const { producto_entrada, cantidad_entrada, producto_salida, cantidad_salida } = req.body;
                // Se agregar el usuario creador a la data
                const usuarioLogin = yield usuarios_model_1.default.findById(uid, 'apellido nombre');
                const usuario_creacion = usuarioLogin.apellido + ' ' + usuarioLogin.nombre;
                req.body.usuario_creacion = usuario_creacion;
                // Se crea la produccion interna
                const produccionInterna = new produccion_interna_model_1.default(req.body);
                const produccion = yield produccionInterna.save();
                // Se altera el stock
                const productoEntradaDB = yield producto_model_1.default.findById(producto_entrada);
                const productoSalidaDB = yield producto_model_1.default.findById(producto_salida);
                const nuevaCantidadEntrada = productoEntradaDB.cantidad - cantidad_entrada;
                const nuevaCantidadSalida = productoSalidaDB.cantidad + cantidad_salida;
                yield producto_model_1.default.findByIdAndUpdate(producto_entrada, { cantidad: nuevaCantidadEntrada });
                yield producto_model_1.default.findByIdAndUpdate(producto_salida, { cantidad: nuevaCantidadSalida });
                response_1.respuesta.success(res, { produccion });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Completar produccion interna
    completarProduccionInterna(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield produccion_interna_model_1.default.updateMany({ activo: true }, { activo: false });
                response_1.respuesta.success(res, 'Cierre completado correctamente');
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Listar produccion interna
    listarProduccionInterna(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Pipeline para agregacion
                let pipeline = [];
                // Filtro activo
                if (req.query.activo == 'true' || req.query.activo == 'false') {
                    pipeline.push({ $match: { activo: req.query.activo === 'true' ? true : false } });
                }
                // Join (Producto entrada)     
                pipeline.push({ $lookup: {
                        from: 'productos',
                        localField: 'producto_entrada',
                        foreignField: '_id',
                        as: 'producto_entrada'
                    } });
                pipeline.push({ $unwind: '$producto_entrada' });
                // Join (Producto salida)     
                pipeline.push({ $lookup: {
                        from: 'productos',
                        localField: 'producto_salida',
                        foreignField: '_id',
                        as: 'producto_salida'
                    } });
                pipeline.push({ $unwind: '$producto_salida' });
                // Ordenando datos
                const ordenar = {};
                if (req.query.columna) {
                    ordenar[req.query.columna] = Number(req.query.direccion);
                    pipeline.push({ $sort: ordenar });
                }
                // Se obtienen los datos
                const [produccion, total] = yield Promise.all([
                    produccion_interna_model_1.default.aggregate(pipeline),
                    produccion_interna_model_1.default.find().countDocuments()
                ]);
                response_1.respuesta.success(res, { produccion, total });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Actualizar produccion interna
    actualizarProduccionInterna(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                // Se verifica si la produccion a actualizar existe
                const dbProduccion = yield produccion_interna_model_1.default.findById(id);
                if (!dbProduccion)
                    return response_1.respuesta.error(res, 400, 'La produccion no existe');
                const produccion = yield produccion_interna_model_1.default.findByIdAndUpdate(id, req.body, { new: true });
                response_1.respuesta.success(res, { produccion });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Eliminar produccion interna
    eliminarProduccionInterna(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                // Se busca el ID del producto
                const produccionDB = yield produccion_interna_model_1.default.findById(id);
                // Se elimina la produccion interna
                yield produccion_interna_model_1.default.findByIdAndRemove(id);
                // Se recupera el stock - Producto entrada
                yield producto_model_1.default.findByIdAndUpdate(produccionDB.producto_entrada, { $inc: { cantidad: produccionDB.cantidad_entrada } }, { new: true });
                // Se recupera el stock - Producto salida
                const productoDB = yield producto_model_1.default.findById(produccionDB.producto_salida);
                const nuevaCantidad = productoDB.cantidad - produccionDB.cantidad_salida;
                yield producto_model_1.default.findByIdAndUpdate(produccionDB.producto_salida, { cantidad: nuevaCantidad }, { new: true });
                response_1.respuesta.success(res, 'Eliminado correctamente');
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
}
exports.ProduccionInternaController = new ProduccionInterna();
