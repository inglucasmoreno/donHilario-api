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
exports.IngresoController = void 0;
const chalk_1 = __importDefault(require("chalk"));
const response_1 = require("../helpers/response");
const usuarios_model_1 = __importDefault(require("../models/usuarios.model"));
const producto_model_1 = __importDefault(require("../models/producto.model"));
const ingreso_model_1 = __importDefault(require("../models/ingreso.model"));
const ingreso_productos_model_1 = __importDefault(require("../models/ingreso_productos.model"));
class Ingreso {
    // Metodo: Ingreso por ID
    getIngreso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const ingreso = yield ingreso_model_1.default.findById(id)
                    .populate('proveedor');
                if (!ingreso)
                    return response_1.respuesta.error(res, 400, 'El ingreso no existe');
                response_1.respuesta.success(res, { ingreso });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Listar ingreso
    listarIngresos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Filtrado
                let pipeline = [];
                let pipelineTotal = [];
                const { columna, direccion } = req.query;
                // Join (Proveedor)
                pipeline.push({ $lookup: {
                        from: 'proveedores',
                        localField: 'proveedor',
                        foreignField: '_id',
                        as: 'proveedor'
                    } });
                pipelineTotal.push({ $lookup: {
                        from: 'proveedores',
                        localField: 'proveedor',
                        foreignField: '_id',
                        as: 'proveedor'
                    } });
                pipeline.push({ $unwind: '$proveedor' });
                pipelineTotal.push({ $unwind: '$proveedor' });
                // Ordenando datos
                const ordenar = {};
                if (req.query.columna) {
                    ordenar[String(columna)] = Number(direccion);
                    pipeline.push({ $sort: ordenar });
                }
                const [ingresos, ingresosTotal] = yield Promise.all([
                    ingreso_model_1.default.aggregate(pipeline),
                    ingreso_model_1.default.aggregate(pipelineTotal)
                ]);
                const total = ingresosTotal.length;
                response_1.respuesta.success(res, { ingresos, total });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Nuevo ingreso
    nuevoIngreso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { proveedor } = req.body;
                const { uid } = req; // ID de usuario logueado 
                // Se buscan los datos del usuario logueado
                const usuarioLogin = yield usuarios_model_1.default.findById(uid, 'apellido nombre');
                const usuario_creacion = usuarioLogin.apellido + ' ' + usuarioLogin.nombre;
                // Se genera codigo de ingreso
                const ingresos = yield ingreso_model_1.default.find().sort({ createdAt: -1 });
                var codigo = ingresos.length != 0 ? ingresos[0].codigo + 1 : 0;
                // Se genera la data para almacenar en la DB
                const data = {
                    codigo,
                    proveedor,
                    usuario_creacion,
                    usuario_cierre: 'Todavia activo'
                };
                // Se crea el remito de ingreso
                const ingreso = new ingreso_model_1.default(data);
                const resultado = yield ingreso.save();
                response_1.respuesta.success(res, { ingreso: resultado });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Actualizar ingreso
    actualizarIngreso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { uid } = req;
                const { id } = req.params;
                const { activo } = req.body;
                // Verificacion: El ingreso existe?
                const ingresoBD = yield ingreso_model_1.default.findById(id);
                if (!ingresoBD)
                    return response_1.respuesta.error(res, 400, 'El ingreso no existe');
                // Actualizacion especial para cierre de ingreso
                if (activo === false) {
                    // Impacto sobre el stock de los productos
                    const productos = yield ingreso_productos_model_1.default.find({ ingreso: id });
                    productos.forEach((elemento) => __awaiter(this, void 0, void 0, function* () {
                        yield producto_model_1.default.findByIdAndUpdate(elemento.producto, { $inc: { cantidad: elemento.cantidad } }, { new: true });
                    }));
                    // Se agrega la fecha de cierre a la actualizacion
                    req.body.fecha_cierre = new Date();
                    // Se agrega el usuario de cierre a la actualizacion
                    const usuarioLogin = yield usuarios_model_1.default.findById(uid, 'apellido nombre');
                    const usuario_cierre = usuarioLogin.apellido + ' ' + usuarioLogin.nombre;
                    req.body.usuario_cierre = usuario_cierre;
                }
                // Se actualiza el ingreso    
                const ingreso = yield ingreso_model_1.default.findByIdAndUpdate(id, req.body, { new: true });
                response_1.respuesta.success(res, { ingreso });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
}
exports.IngresoController = new Ingreso();
