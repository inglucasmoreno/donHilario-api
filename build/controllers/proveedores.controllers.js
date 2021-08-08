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
exports.ProveedoresController = void 0;
const chalk_1 = __importDefault(require("chalk"));
const response_1 = require("../helpers/response");
const proveedor_model_1 = __importDefault(require("../models/proveedor.model"));
class Proveedores {
    // Metodo: Obtener proveedor por ID
    getProveedor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const proveedor = yield proveedor_model_1.default.findById(id);
                if (!proveedor)
                    return response_1.respuesta.error(res, 400, 'El proveedor no existe');
                response_1.respuesta.success(res, { proveedor });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Listar proveedores
    listarProveedores(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Ordenar
                let ordenar = [req.query.columna || 'razon_social', req.query.direccion || 1];
                // Paginación
                const desde = Number(req.query.desde) || 0;
                const limit = Number(req.query.limit) || 0;
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
                const [proveedores, total] = yield Promise.all([
                    proveedor_model_1.default.find(busqueda)
                        .or(filtroOR)
                        .sort([ordenar])
                        .skip(desde)
                        .limit(limit),
                    proveedor_model_1.default.find(busqueda)
                        .or(filtroOR)
                        .countDocuments()
                ]);
                response_1.respuesta.success(res, { proveedores, total });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Nuevo proveedor
    nuevoProveedor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { cuit } = req.body;
                // Se verifica si el CUIT ya esta registrado
                const cuitExiste = yield proveedor_model_1.default.findOne({ cuit });
                if (cuitExiste)
                    return response_1.respuesta.error(res, 400, 'El CUIT ya esta registrado');
                // Se crea el nuevo proveedor
                const proveedor = new proveedor_model_1.default(req.body);
                const resultado = yield proveedor.save();
                response_1.respuesta.success(res, { proveedor: resultado });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Actualizar proveedor
    actualizarProveedor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const { cuit } = req.body;
                // Se verifica si el proveedor a actualizar existe
                const dbProveedor = yield proveedor_model_1.default.findById(id);
                if (!dbProveedor)
                    return response_1.respuesta.error(res, 400, 'El proveedor no existe');
                // Se verifica que el nuevo CUIT no este registrado - En caso de ser necesario
                if (cuit) {
                    if (cuit !== dbProveedor.cuit) {
                        const cuitExiste = yield proveedor_model_1.default.findOne({ cuit });
                        if (cuitExiste)
                            return response_1.respuesta.error(res, 400, 'El CUIT ya esta registrado');
                    }
                }
                const proveedor = yield proveedor_model_1.default.findByIdAndUpdate(id, req.body, { new: true });
                response_1.respuesta.success(res, { proveedor });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
}
exports.ProveedoresController = new Proveedores();
