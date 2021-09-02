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
exports.DesechoController = void 0;
const chalk_1 = __importDefault(require("chalk"));
const response_1 = require("../helpers/response");
const desechos_model_1 = __importDefault(require("../models/desechos.model"));
class Desecho {
    // Metodo: Obtener desecho por ID
    getDesecho(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const desecho = yield desechos_model_1.default.findById(id);
                if (!desecho)
                    return response_1.respuesta.error(res, 400, 'El desecho no existe');
                response_1.respuesta.success(res, { desecho });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Completar desechos
    completarDesechos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield desechos_model_1.default.updateMany({ activo: true }, { activo: false });
                response_1.respuesta.success(res, 'Cierre completado correctamente');
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Listar desechos
    listarDesechos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Ordenar
                let ordenar = [req.query.columna || 'createdAt', req.query.direccion || 1];
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
                const [desechos, total] = yield Promise.all([
                    desechos_model_1.default.find(busqueda)
                        .or(filtroOR)
                        .sort([ordenar]),
                    desechos_model_1.default.find(busqueda)
                        .or(filtroOR)
                        .countDocuments()
                ]);
                response_1.respuesta.success(res, { desechos, total });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Nuevo desecho
    nuevoDesecho(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Se crea el nuevo desecho
                const desecho = new desechos_model_1.default(req.body);
                const resultado = yield desecho.save();
                response_1.respuesta.success(res, { desecho: resultado });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Actualizar desecho
    actualizarDesecho(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                // Se verifica si el desecho a actualizar existe
                const dbDesecho = yield desechos_model_1.default.findById(id);
                if (!dbDesecho)
                    return response_1.respuesta.error(res, 400, 'El desecho no existe');
                const desecho = yield desechos_model_1.default.findByIdAndUpdate(id, req.body, { new: true });
                response_1.respuesta.success(res, { desecho });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Eliminar desecho
    eliminarDesecho(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield desechos_model_1.default.findByIdAndDelete(id);
                response_1.respuesta.success(res, 'Producto eliminado correctamente');
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
}
exports.DesechoController = new Desecho();
