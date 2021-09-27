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
exports.PolloController = void 0;
const chalk_1 = __importDefault(require("chalk"));
const response_1 = require("../helpers/response");
const pollo_model_1 = __importDefault(require("../models/pollo.model"));
class Pollo {
    // Metodo: Obtener producto de pollo por ID
    getPollo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const producto = yield pollo_model_1.default.findById(id);
                if (!producto)
                    return response_1.respuesta.error(res, 400, 'El producto de pollo no existe');
                response_1.respuesta.success(res, { producto });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Listar productos de pollo
    listarPollo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Ordenar
                let ordenar = [req.query.columna || 'descripcion', req.query.direccion || 1];
                // Filtrado
                const busqueda = {};
                let filtroOR = [];
                const fDescripcion = req.query.descripcion || '';
                const fActivo = req.query.activo || '';
                // Filtro activo
                if (fActivo)
                    busqueda.activo = fActivo;
                // Filtro OR
                if (fDescripcion) {
                    const descripcion = new RegExp(fDescripcion, 'i'); // Expresion regular para busqueda insensible
                    filtroOR.push({ descripcion: descripcion });
                }
                else {
                    filtroOR.push({});
                }
                const [productos, total] = yield Promise.all([
                    pollo_model_1.default.find(busqueda)
                        .or(filtroOR)
                        .sort([ordenar]),
                    pollo_model_1.default.find(busqueda)
                        .or(filtroOR)
                        .countDocuments()
                ]);
                response_1.respuesta.success(res, { productos, total });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Actualizar producto de pollo
    actualizarPollo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productos = req.body;
                productos.forEach((producto) => __awaiter(this, void 0, void 0, function* () {
                    yield pollo_model_1.default.findByIdAndUpdate(producto._id, { cantidad: producto.cantidad }, { new: true });
                }));
                response_1.respuesta.success(res, 'Actualizacion correcta');
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
}
exports.PolloController = new Pollo();
