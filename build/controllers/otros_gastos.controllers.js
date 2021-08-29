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
exports.OtrosGastosController = void 0;
const chalk_1 = __importDefault(require("chalk"));
const response_1 = require("../helpers/response");
const otros_gastos_model_1 = __importDefault(require("../models/otros_gastos.model"));
class OtrosGastos {
    // Metodo: Nuevo gasto
    nuevoGasto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const gastoTmp = new otros_gastos_model_1.default(req.body);
                const gasto = yield gastoTmp.save();
                response_1.respuesta.success(res, { gasto });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Listar gastos
    listarGastosPorCaja(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { caja } = req.params;
                const gastos = yield otros_gastos_model_1.default.find({ caja });
                response_1.respuesta.success(res, { gastos });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Eliminar gasto
    eliminarGasto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const gasto = yield otros_gastos_model_1.default.findByIdAndRemove(id);
                response_1.respuesta.success(res, { gasto });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
}
exports.OtrosGastosController = new OtrosGastos();
