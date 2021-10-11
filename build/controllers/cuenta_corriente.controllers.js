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
exports.CuentaCorrienteController = void 0;
const chalk_1 = __importDefault(require("chalk"));
const response_1 = require("../helpers/response");
const cuenta_corriente_1 = __importDefault(require("../models/cuenta_corriente"));
const mongoose_1 = __importDefault(require("mongoose"));
class CuentaCorriente {
    // Metodo: Obtener elemento de cuenta corriente por ID
    getCuentaCorriente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const cuentaCorriente = yield cuenta_corriente_1.default.findById(id);
                if (!cuentaCorriente)
                    return response_1.respuesta.error(res, 400, 'El elemento de cuenta corriente no existe');
                response_1.respuesta.success(res, { cuenta_corriente: cuentaCorriente });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Listar elementos de cuenta corriente x Usuario
    listarCuentasCorrientes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Se recibe ID de usuario
                const usuario = req.params.usuario;
                // Activo/Inactivo
                const fActivo = req.query.activo || '';
                let activo = true;
                const pipeline = [];
                pipeline.push({ $match: { usuario: mongoose_1.default.Types.ObjectId(usuario) } });
                if (fActivo !== '' && fActivo) {
                    pipeline.push({ $match: { activo: fActivo === 'true' ? true : false } });
                }
                // Ordenando datos
                const ordenar = {};
                if (req.query.columna) {
                    ordenar[req.query.columna] = Number(req.query.direccion);
                    pipeline.push({ $sort: ordenar });
                }
                const cuentas_corrientes = yield cuenta_corriente_1.default.aggregate(pipeline);
                response_1.respuesta.success(res, { cuentas_corrientes });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Nuevo elemento de cuenta corriente
    nuevaCuentaCorriente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Se crea la nueva cuenta corriente
                const cuenta_corriente = new cuenta_corriente_1.default(req.body);
                const resultado = yield cuenta_corriente.save();
                response_1.respuesta.success(res, { cuenta_corriente: resultado });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Actualizar elemento de cuenta corriente
    actualizarCuentaCorriente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                // Se verifica si el elemento de cuenta corriente a actualizar existe
                const dbCuentaCorriente = yield cuenta_corriente_1.default.findById(id);
                if (!dbCuentaCorriente)
                    return response_1.respuesta.error(res, 400, 'El elemento de cuenta corriente no existe');
                // Actualizar elemento de cuenta corriente
                const cuenta_corriente = yield cuenta_corriente_1.default.findByIdAndUpdate(id, req.body, { new: true });
                response_1.respuesta.success(res, { cuenta_corriente });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Completar todos los elementos de cuenta corriente x Usuario
    completarCuentasCorrientes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usuario = req.params.usuario;
                // Actualizar todos los elementos
                yield cuenta_corriente_1.default.updateMany({ usuario }, { activo: false });
                response_1.respuesta.success(res, 'Actualizacion correcta');
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
}
exports.CuentaCorrienteController = new CuentaCorriente();
