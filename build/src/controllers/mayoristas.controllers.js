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
exports.MayoristasController = void 0;
const chalk_1 = __importDefault(require("chalk"));
const response_1 = require("../helpers/response");
const mayorista_model_1 = __importDefault(require("../models/mayorista.model"));
class Mayoristas {
    // Metodo: Obtener mayorista por ID
    getMayorista(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const mayorista = yield mayorista_model_1.default.findById(id);
                if (!mayorista)
                    return response_1.respuesta.error(res, 400, 'El mayorista no existe');
                response_1.respuesta.success(res, { mayorista });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Listar mayoristas
    listarMayoristas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Ordenar
                let ordenar = [req.query.columna || 'razon_social', req.query.direccion || 1];
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
                    filtroOR.push({ razon_social: descripcion });
                    filtroOR.push({ cuit: descripcion });
                }
                else {
                    filtroOR.push({});
                }
                const [mayoristas, total] = yield Promise.all([
                    mayorista_model_1.default.find(busqueda)
                        .or(filtroOR)
                        .sort([ordenar]),
                    mayorista_model_1.default.find(busqueda)
                        .or(filtroOR)
                        .countDocuments()
                ]);
                response_1.respuesta.success(res, { mayoristas, total });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Nuevo mayorista
    nuevoMayorista(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { cuit } = req.body;
                // Se verifica si el CUIT ya esta registrado
                const cuitExiste = yield mayorista_model_1.default.findOne({ cuit });
                if (cuitExiste)
                    return response_1.respuesta.error(res, 400, 'El CUIT ya esta registrado');
                // Se crea el nuevo mayorista
                const mayorista = new mayorista_model_1.default(req.body);
                const resultado = yield mayorista.save();
                response_1.respuesta.success(res, { mayorista: resultado });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Actualizar mayorista
    actualizarMayorista(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const { cuit, activo } = req.body;
                // Se verifica si el mayorista a actualizar existe
                const dbMayorista = yield mayorista_model_1.default.findById(id);
                if (!dbMayorista)
                    return response_1.respuesta.error(res, 400, 'El mayorista no existe');
                // Se verifica que el nuevo CUIT no este registrado - En caso de ser necesario
                if (cuit) {
                    if (cuit !== dbMayorista.cuit) {
                        const cuitExiste = yield mayorista_model_1.default.findOne({ cuit });
                        if (cuitExiste)
                            return response_1.respuesta.error(res, 400, 'El CUIT ya esta registrado');
                    }
                }
                const mayorista = yield mayorista_model_1.default.findByIdAndUpdate(id, req.body, { new: true });
                response_1.respuesta.success(res, { mayorista });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
}
exports.MayoristasController = new Mayoristas();
