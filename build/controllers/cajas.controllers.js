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
exports.CajasController = void 0;
const chalk_1 = __importDefault(require("chalk"));
const response_1 = require("../helpers/response");
const venta_model_1 = __importDefault(require("../models/venta.model"));
const saldo_inicial_model_1 = __importDefault(require("../models/saldo_inicial.model"));
const caja_model_1 = __importDefault(require("../models/caja.model"));
const otros_ingresos_model_1 = __importDefault(require("../models/otros_ingresos.model"));
const otros_gastos_model_1 = __importDefault(require("../models/otros_gastos.model"));
const billetes_model_1 = __importDefault(require("../models/billetes.model"));
const usuarios_model_1 = __importDefault(require("../models/usuarios.model"));
class Caja {
    // Metodo: Obtener saldo inicial
    getSaldoInicial(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const saldoDB = yield saldo_inicial_model_1.default.find();
                if (saldoDB.length === 0)
                    response_1.respuesta.success(res, { monto: 0 });
                else
                    response_1.respuesta.success(res, { monto: saldoDB[0].monto });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Crear o Actualizar saldo inicial
    saldoInicial(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { monto } = req.body;
                const saldoDB = yield saldo_inicial_model_1.default.find();
                if (saldoDB.length > 0) { // Existe - Actualizar
                    yield saldo_inicial_model_1.default.findByIdAndUpdate(saldoDB[0]._id, { monto });
                }
                else { // No existe - Crear uno nuevo
                    const nuevoSaldo = new saldo_inicial_model_1.default(req.body);
                    yield nuevoSaldo.save();
                }
                response_1.respuesta.success(res, { msg: 'Saldo actualizado correctamente' });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Caja por ID
    getCaja(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                // Datos de caja
                const caja = yield caja_model_1.default.findById(id);
                // Datos de otros ingresos
                const otrosIngresos = yield otros_ingresos_model_1.default.find({ caja: id }).sort({ createdAt: -1 });
                // Datos de otros gastos
                const otrosGastos = yield otros_gastos_model_1.default.find({ caja: id }).sort({ createdAt: -1 });
                // Datos de billetes
                const billetes = yield billetes_model_1.default.findOne({ caja: id });
                response_1.respuesta.success(res, { caja, otrosIngresos, otrosGastos, billetes });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
            const id = req.params;
        });
    }
    // Metodo: Listar cajas
    listarCajas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { columna, direccion } = req.query;
            // Ordenar
            let ordenar = [columna || 'createdAt', direccion || -1];
            try {
                const cajas = yield caja_model_1.default.find().sort([ordenar]);
                response_1.respuesta.success(res, { cajas });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Nueva caja
    nuevaCaja(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { uid } = req;
                const ingresos = req.body.ingresos;
                const gastos = req.body.gastos;
                // Se crea la nueva caja
                // Se agregar el usuario creador a la data
                const usuarioLogin = yield usuarios_model_1.default.findById(uid, 'apellido nombre');
                const usuario_creacion = usuarioLogin.apellido + ' ' + usuarioLogin.nombre;
                req.body.usuario_creacion = usuario_creacion;
                const nuevaCaja = new caja_model_1.default(req.body);
                const cajaDB = yield nuevaCaja.save();
                // Se agregan los Ingresos
                ingresos.forEach((elemento) => __awaiter(this, void 0, void 0, function* () {
                    const data = {
                        descripcion: elemento.descripcion,
                        monto: elemento.monto,
                        usuario_creacion: usuario_creacion,
                        caja: cajaDB._id,
                    };
                    const nuevoIngreso = new otros_ingresos_model_1.default(data);
                    yield nuevoIngreso.save();
                }));
                // Se agregan los Gastos
                gastos.forEach((elemento) => __awaiter(this, void 0, void 0, function* () {
                    const data = {
                        descripcion: elemento.descripcion,
                        monto: elemento.monto,
                        usuario_creacion: usuario_creacion,
                        caja: cajaDB._id,
                    };
                    const nuevoGasto = new otros_gastos_model_1.default(data);
                    yield nuevoGasto.save();
                }));
                // Se agrega el control de billetes
                const dataBilletes = {
                    caja: cajaDB._id,
                    cinco: req.body.billetes.cantidad_5 || 0,
                    diez: req.body.billetes.cantidad_10 || 0,
                    veinte: req.body.billetes.cantidad_20 || 0,
                    cincuenta: req.body.billetes.cantidad_50 || 0,
                    cien: req.body.billetes.cantidad_100 || 0,
                    doscientos: req.body.billetes.cantidad_200 || 0,
                    quinientos: req.body.billetes.cantidad_500 || 0,
                    mil: req.body.billetes.cantidad_1000 || 0,
                    monedas: req.body.billetes.cantidad_monedas || 0
                };
                // Se actualiza el saldo inicial de proxima caja
                const saldoDB = yield saldo_inicial_model_1.default.find();
                yield saldo_inicial_model_1.default.findByIdAndUpdate(saldoDB[0]._id, { monto: req.body.saldo_proxima_caja });
                // Se deshabilitan las ventas actuales luego del cierre de caja
                yield venta_model_1.default.updateMany({ activo: true }, { activo: false });
                // Saldos en billetes
                const nuevosBilletes = new billetes_model_1.default(dataBilletes);
                yield nuevosBilletes.save();
                response_1.respuesta.success(res, 'Cierre de caja completado');
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
}
exports.CajasController = new Caja();
