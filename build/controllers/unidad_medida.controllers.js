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
exports.UnidadMedidaController = void 0;
const chalk_1 = __importDefault(require("chalk"));
const response_1 = require("../helpers/response");
const producto_model_1 = __importDefault(require("../models/producto.model"));
const unidad_medida_model_1 = __importDefault(require("../models/unidad_medida.model"));
class UnidadMedida {
    // Metodo: Nueva unidad de medida
    nuevaUnidad(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verificación - Unidad con misma descripcion
                const { descripcion } = req.body;
                const unidadExiste = yield unidad_medida_model_1.default.findOne({ descripcion: descripcion.toUpperCase() });
                if (unidadExiste)
                    return response_1.respuesta.error(res, 400, 'La unidad ya existe');
                // Se crea la nueva unidad
                const unidad = new unidad_medida_model_1.default(req.body);
                const resultado = yield unidad.save();
                // Respuesta
                response_1.respuesta.success(res, { resultado });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Unidad de medida por ID
    getUnidad(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verificacion: ¿La unidad existe?
                const unidad = yield unidad_medida_model_1.default.findById(req.params.id);
                if (!unidad)
                    return response_1.respuesta.error(res, 400, 'La unidad no existe');
                // Respuesta
                response_1.respuesta.success(res, { unidad });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Listar unidades
    listarUnidades(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { activo, descripcion } = req.query;
                // 1) - Ordenar
                let ordenar = [req.query.columna || 'descripcion', req.query.direccion || 1];
                // 2) - Paginación
                const desde = Number(req.query.desde) || 0;
                const limit = Number(req.query.limit) || 0;
                // 3) - Filtrado            
                let busqueda = activo ? { activo } : {};
                let filtroOR = [];
                // Filtrado activo
                const filtroDescripcion = descripcion || '';
                // Filtrado OR
                if (filtroDescripcion) {
                    const iDescripcion = new RegExp(filtroDescripcion, 'i'); // Expresion regular para busqueda insensible
                    filtroOR.push({ descripcion: iDescripcion });
                }
                else {
                    filtroOR.push({});
                }
                // Respuesta
                const [unidades, total] = yield Promise.all([
                    unidad_medida_model_1.default.find(busqueda)
                        .or(filtroOR)
                        .sort([ordenar])
                        .skip(desde)
                        .limit(limit),
                    unidad_medida_model_1.default.find(busqueda).countDocuments()
                ]);
                response_1.respuesta.success(res, { unidades, total });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Actualizar unidad
    actualizarUnidad(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { activo, descripcion } = req.body;
                // Se verifica si la unidad de medida existe
                let unidad = yield unidad_medida_model_1.default.findById(id);
                if (!unidad)
                    return response_1.respuesta.error(res, 400, 'La unidad no existe');
                // Se verifica si la nueva unidad no esta registrada
                if (descripcion && unidad.descripcion != descripcion.toUpperCase()) {
                    const unidadExiste = yield unidad_medida_model_1.default.findOne({ descripcion: descripcion.toUpperCase() });
                    if (unidadExiste)
                        return response_1.respuesta.error(res, 400, 'La unidad ya existe');
                }
                // Si se va a dar de baja - No debe haber producto asociado
                if (activo == false || activo == 'false') {
                    const productoAsociado = yield producto_model_1.default.findOne({ unidad_medida: id, activo: true });
                    if (productoAsociado)
                        return response_1.respuesta.error(res, 400, 'Existe un producto asociado a esta unidad');
                }
                unidad = yield unidad_medida_model_1.default.findByIdAndUpdate(id, req.body, { new: true });
                response_1.respuesta.success(res, { unidad });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
}
exports.UnidadMedidaController = new UnidadMedida();
