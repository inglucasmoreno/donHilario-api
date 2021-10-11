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
exports.VentasController = void 0;
const chalk_1 = __importDefault(require("chalk"));
const response_1 = require("../helpers/response");
const venta_productos_model_1 = __importDefault(require("../models/venta_productos.model"));
const producto_model_1 = __importDefault(require("../models/producto.model"));
const venta_model_1 = __importDefault(require("../models/venta.model"));
const usuarios_model_1 = __importDefault(require("../models/usuarios.model"));
class Ventas {
    // Metodo: Obtener venta por ID
    getVenta(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const venta = yield venta_model_1.default.findById(id).populate('mayorista');
                response_1.respuesta.success(res, { venta });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Listar ventas
    listarVentas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { columna, direccion, activo = true } = req.query;
                // Ordenar
                let ordenar = [columna || 'createdAt', direccion || -1];
                // Se listan las ventas
                const [ventas, personalizadas] = yield Promise.all([
                    venta_model_1.default.find({ activo }).sort([ordenar]),
                    venta_model_1.default.find({ activo, forma_pago: 'Personalizada' }).sort([ordenar])
                ]);
                response_1.respuesta.success(res, { ventas, personalizadas });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Nueva venta
    nuevaVenta(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { uid } = req;
                const { precio_total, descuento_porcentual, forma_pago, usuario_cuenta_corriente, forma_pago_personalizada, total_balanza, total_anulacion_balanza, total_mercaderia, total_adicional_credito, venta_mayorista, mayorista, total_descuento } = req.body;
                // Recepcion de productos
                const productos = req.body.productos;
                // Se agregar el usuario creador a la data
                const usuarioLogin = yield usuarios_model_1.default.findById(uid, 'apellido nombre');
                const usuario_creacion = usuarioLogin.apellido + ' ' + usuarioLogin.nombre;
                req.body.usuario_creacion = usuario_creacion;
                // Se genera la data para almacenar en la DB
                const data = {
                    descuento_porcentual,
                    forma_pago,
                    usuario_cuenta_corriente,
                    forma_pago_personalizada,
                    total_balanza,
                    total_anulacion_balanza,
                    precio_total,
                    total_mercaderia,
                    total_adicional_credito,
                    venta_mayorista,
                    mayorista: mayorista !== '' ? mayorista : null,
                    total_descuento,
                    usuario_creacion
                };
                // Se crea la venta
                const ventaObj = new venta_model_1.default(data);
                const venta = yield ventaObj.save();
                // Se agregan los productos a la venta y se impacta sobre el stock
                productos.forEach((elemento) => __awaiter(this, void 0, void 0, function* () {
                    const data = {
                        venta: venta._id,
                        cantidad: elemento.cantidad,
                        producto: elemento.producto,
                        precio_unitario: elemento.precio_unitario,
                        promocion: elemento.promocion,
                        precio_total: elemento.precio_total,
                        tipo: elemento.tipo,
                        carne: elemento.carne,
                        usuario_creacion
                    };
                    // Se agrega el producto a la venta
                    const productoTemp = new venta_productos_model_1.default(data);
                    yield productoTemp.save();
                    // Se impacta sobre el stock si es necesario
                    if (forma_pago !== 'Anulacion balanza') {
                        const productoDB = yield producto_model_1.default.findById(elemento.producto);
                        const nuevaCantidad = productoDB.cantidad - elemento.cantidad;
                        yield producto_model_1.default.findByIdAndUpdate(elemento.producto, { cantidad: nuevaCantidad });
                    }
                }));
                response_1.respuesta.success(res, { venta });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Actualizar venta
    actualizarVenta(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                // Se verifica si el producto a actualizar existe
                const ventaExiste = yield venta_model_1.default.findById(id);
                if (!ventaExiste)
                    return response_1.respuesta.error(res, 400, 'La venta no existe');
                // Se actualiza la venta
                const venta = yield venta_model_1.default.findByIdAndUpdate(id, req.body, { new: true });
                response_1.respuesta.success(res, { venta });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
}
exports.VentasController = new Ventas();
