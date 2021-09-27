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
exports.TmpIngresosGastosController = void 0;
const chalk_1 = __importDefault(require("chalk"));
const response_1 = require("../helpers/response");
const tmp_ingresos_gastos_models_1 = __importDefault(require("../models/tmp_ingresos_gastos.models"));
class tmpIngresosGastos {
    // Metodo: Nuevo elemento
    nuevoElemento(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Se crea el nuevo elemento
                const elemento = new tmp_ingresos_gastos_models_1.default(req.body);
                yield elemento.save();
                // Respuesta
                response_1.respuesta.success(res, 'Creacion completada correctamente');
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Listar elementos
    listarElementos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Ordenar
                let ordenar = [req.query.columna || 'descripcion', req.query.direccion || 1];
                // Respuesta
                const [ingresos, gastos] = yield Promise.all([
                    tmp_ingresos_gastos_models_1.default.find({ tipo: 'Ingreso' }).sort([ordenar]),
                    tmp_ingresos_gastos_models_1.default.find({ tipo: 'Gasto' }).sort([ordenar])
                ]);
                response_1.respuesta.success(res, { ingresos, gastos });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo eliminar elemento
    eliminarElemento(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                // Verificacion: Existe el elemento a eliminar?
                const elementoDB = yield tmp_ingresos_gastos_models_1.default.findById(id);
                if (!elementoDB)
                    return response_1.respuesta.error(res, 400, 'El elemento no existe');
                // Se elimina el elemento
                const elementoEliminado = yield tmp_ingresos_gastos_models_1.default.findByIdAndRemove(id);
                response_1.respuesta.success(res, { elemento: elementoEliminado });
            }
            catch (error) {
                console.log(chalk_1.default.red(error));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Limpiar elementos
    limpiarElementos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield tmp_ingresos_gastos_models_1.default.deleteMany({});
                response_1.respuesta.success(res, 'Elementos eliminados correctamente');
            }
            catch (error) {
                console.log(chalk_1.default.red(error));
                response_1.respuesta.error(res, 500);
            }
        });
    }
}
exports.TmpIngresosGastosController = new tmpIngresosGastos();
