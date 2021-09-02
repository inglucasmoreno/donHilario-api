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
exports.OtrosIngresosController = void 0;
const chalk_1 = __importDefault(require("chalk"));
const response_1 = require("../helpers/response");
const otros_ingresos_model_1 = __importDefault(require("../models/otros_ingresos.model"));
class OtrosIngresos {
    // Metodo: Nuevo ingreso
    nuevoIngreso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ingresoTmp = new otros_ingresos_model_1.default(req.body);
                const ingreso = yield ingresoTmp.save();
                response_1.respuesta.success(res, { ingreso });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Listar ingresos
    listarIngresosPorCaja(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { caja } = req.params;
                const ingresos = yield otros_ingresos_model_1.default.find({ caja });
                response_1.respuesta.success(res, { ingresos });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Eliminar ingreso
    eliminarIngreso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const ingreso = yield otros_ingresos_model_1.default.findByIdAndRemove(id);
                response_1.respuesta.success(res, { ingreso });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
}
exports.OtrosIngresosController = new OtrosIngresos();
