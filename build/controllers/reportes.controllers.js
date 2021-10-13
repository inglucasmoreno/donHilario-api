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
exports.ReportesController = void 0;
const chalk_1 = __importDefault(require("chalk"));
const response_1 = require("../helpers/response");
const desechos_model_1 = __importDefault(require("../models/desechos.model"));
const venta_productos_model_1 = __importDefault(require("../models/venta_productos.model"));
const venta_model_1 = __importDefault(require("../models/venta.model"));
const otros_ingresos_model_1 = __importDefault(require("../models/otros_ingresos.model"));
const otros_gastos_model_1 = __importDefault(require("../models/otros_gastos.model"));
const venta_productos_model_2 = __importDefault(require("../models/venta_productos.model"));
const ingreso_productos_model_1 = __importDefault(require("../models/ingreso_productos.model"));
const date_fns_1 = require("date-fns");
const mongoose_1 = __importDefault(require("mongoose"));
class Reportes {
    // Reportes: Ventas
    ventas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fechaDesde, fechaHasta, tipo_venta, mayoristaSeleccionado } = req.body;
                // Creacion de PIPELINE
                const pipeline = [];
                const pipelineOtros = [];
                // Filtro: Todas las ventas
                pipeline.push({ $match: {} });
                pipelineOtros.push({ $match: {} });
                // Filtro: Mayoristas - Todos los mayoristas
                if (tipo_venta === 'sin_mayoristas') {
                    pipeline.push({ $match: { venta_mayorista: false } });
                }
                // Filtro: Mayoristas - Todos los mayoristas
                if (tipo_venta === 'con_mayoristas' && mayoristaSeleccionado === '') {
                    pipeline.push({ $match: { venta_mayorista: true } });
                }
                // Filtro: Mayoristas
                if (tipo_venta === 'con_mayoristas' && mayoristaSeleccionado !== '') {
                    pipeline.push({ $match: { venta_mayorista: true } });
                    pipeline.push({ $match: { mayorista: mongoose_1.default.Types.ObjectId(mayoristaSeleccionado) } });
                }
                const fechaHastaNew = date_fns_1.add(new Date(fechaHasta), { days: 1 });
                // Filtro: fechas [Desde - Hasta]
                if (fechaDesde) {
                    pipeline.push({ $match: { createdAt: { $gte: new Date(fechaDesde) } } });
                    pipelineOtros.push({ $match: { createdAt: { $gte: new Date(fechaDesde) } } });
                }
                if (fechaHasta) {
                    pipeline.push({ $match: { createdAt: { $lte: new Date(fechaHastaNew) } } });
                    pipelineOtros.push({ $match: { createdAt: { $lte: new Date(fechaHastaNew) } } });
                }
                // Ordenando datos
                const ordenar = {};
                if (req.query.columna) {
                    ordenar[req.query.columna] = Number(req.query.direccion);
                    pipeline.push({ $sort: ordenar });
                }
                // Ordenando Gastos e Ingresos
                pipelineOtros.push({ $sort: { createdAt: -1 } });
                // Se ejecuta la busqueda
                const [ventas, otrosIngresos, otrosGastos] = yield Promise.all([
                    yield venta_model_1.default.aggregate(pipeline),
                    yield otros_ingresos_model_1.default.aggregate(pipelineOtros),
                    yield otros_gastos_model_1.default.aggregate(pipelineOtros),
                ]);
                response_1.respuesta.success(res, { ventas, otrosIngresos, otrosGastos });
            }
            catch (error) {
                console.log(chalk_1.default.red(error));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Productos
    productos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fechaDesde, fechaHasta, productoSeleccionado, tipo_filtro, proveedorSeleccionado, tipo_egreso, mayoristaSeleccionado } = req.body;
                const pipeline = [];
                // Filtro: Todas los productos vendidos
                pipeline.push({ $match: {} });
                const fechaHastaNew = date_fns_1.add(new Date(fechaHasta), { days: 1 });
                // Filtro: fechas [Desde - Hasta]
                if (fechaDesde)
                    pipeline.push({ $match: { createdAt: { $gte: new Date(fechaDesde) } } });
                if (fechaHasta)
                    pipeline.push({ $match: { createdAt: { $lte: new Date(fechaHastaNew) } } });
                // Filtro: Proveedor
                if (tipo_filtro === 'Ingresos' && proveedorSeleccionado !== '') {
                    pipeline.push({ $match: { proveedor: mongoose_1.default.Types.ObjectId(proveedorSeleccionado) } });
                }
                // Join con productos
                pipeline.push({
                    $lookup: {
                        from: 'productos',
                        localField: 'producto',
                        foreignField: '_id',
                        as: 'producto'
                    }
                });
                pipeline.push({ $unwind: '$producto' });
                // Filtro: Producto
                if (productoSeleccionado !== 'todo_carnes' && productoSeleccionado !== 'todo_mercaderia') {
                    pipeline.push({ $match: { 'producto._id': mongoose_1.default.Types.ObjectId(productoSeleccionado) } });
                }
                else if (productoSeleccionado === 'todo_carnes') {
                    pipeline.push({ $match: { 'producto.carne': true } });
                }
                else if (productoSeleccionado === 'todo_mercaderia') {
                    pipeline.push({ $match: { 'producto.tipo': 'Normal' } });
                }
                // Join con productos - unidad de medidad
                pipeline.push({
                    $lookup: {
                        from: 'unidad_medida',
                        localField: 'producto.unidad_medida',
                        foreignField: '_id',
                        as: 'producto.unidad_medida'
                    }
                });
                pipeline.push({ $unwind: '$producto.unidad_medida' });
                // Join con ventas
                if (tipo_filtro === 'Egresos') {
                    pipeline.push({
                        $lookup: {
                            from: 'ventas',
                            localField: 'venta',
                            foreignField: '_id',
                            as: 'venta'
                        }
                    });
                    pipeline.push({ $unwind: '$venta' });
                    // No se consideran las anulaciones de balanza
                    pipeline.push({ $match: { 'venta.forma_pago': { $nin: ['Anulacion balanza'] } } });
                }
                // Filtro: Mayoristas
                // Egresos sin mayoristas
                if (tipo_filtro === 'Egresos' && tipo_egreso === 'sin_mayoristas') {
                    pipeline.push({ $match: { 'venta.venta_mayorista': false } });
                }
                // Egreso solo de mayoristas
                if (tipo_filtro === 'Egresos' && tipo_egreso === 'solo_mayoristas' && mayoristaSeleccionado === '') {
                    pipeline.push({ $match: { 'venta.venta_mayorista': true } });
                }
                // Egreso de un mayorista en particular
                if (tipo_filtro === 'Egresos' && tipo_egreso === 'solo_mayoristas' && mayoristaSeleccionado !== '') {
                    pipeline.push({ $match: { 'venta.mayorista': mongoose_1.default.Types.ObjectId(mayoristaSeleccionado) } });
                }
                // GROUP      
                pipeline.push({
                    $group: {
                        _id: { createdAt: { $dateToString: { format: "%d-%m-%Y", date: "$createdAt" } }, tipo: '$producto.tipo', producto: '$producto.descripcion', unidad: '$producto.unidad_medida.descripcion' },
                        cantidad: { $sum: '$cantidad' }
                    }
                });
                // Ordenando datos
                const ordenar = {};
                if (req.query.columna) {
                    ordenar[req.query.columna] = Number(req.query.direccion);
                    pipeline.push({ $sort: ordenar });
                }
                let productos = [];
                if (tipo_filtro === 'Ingresos') {
                    productos = yield ingreso_productos_model_1.default.aggregate(pipeline);
                }
                else {
                    productos = yield venta_productos_model_2.default.aggregate(pipeline);
                }
                response_1.respuesta.success(res, { productos });
            }
            catch (error) {
                console.log(chalk_1.default.red(error));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Cantidades vs Desechos
    cantidadesDesechos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fechaDesde, fechaHasta } = req.body;
                const pipelineDesechos = [];
                const pipelineVentas = [];
                // Filtro: Todas los productos vendidos
                pipelineDesechos.push({ $match: {} });
                pipelineVentas.push({ $match: { carne: true, } });
                const fechaHastaNew = date_fns_1.add(new Date(fechaHasta), { days: 1 });
                // Filtro: fechas [Desde - Hasta]
                if (fechaDesde)
                    pipelineDesechos.push({ $match: { createdAt: { $gte: new Date(fechaDesde) } } });
                if (fechaHasta)
                    pipelineDesechos.push({ $match: { createdAt: { $lte: new Date(fechaHastaNew) } } });
                if (fechaDesde)
                    pipelineVentas.push({ $match: { createdAt: { $gte: new Date(fechaDesde) }, } });
                if (fechaHasta)
                    pipelineVentas.push({ $match: { createdAt: { $lte: new Date(fechaHastaNew) } } });
                // Join (Venta)     
                pipelineVentas.push({ $lookup: {
                        from: 'ventas',
                        localField: 'venta',
                        foreignField: '_id',
                        as: 'venta'
                    } });
                pipelineVentas.push({ $unwind: '$venta' });
                pipelineVentas.push({ $match: {} });
                const desechos = yield desechos_model_1.default.aggregate(pipelineDesechos);
                const productos = yield venta_productos_model_1.default.aggregate(pipelineVentas);
                // Consulta a base de datos
                // const desechos: any[] = await DesechosModel.find({createdAt: { $gte: new Date(fechaDesde), $lte: new Date(fechaHastaNew) }});
                // const productos: any[] = await VentaProductosModel.find({$and: [{createdAt: { $gte: new Date(fechaDesde), $lte: new Date(fechaHastaNew)}}, {carne: true}]});
                let desechosTotal = 0;
                let cantidadTotal = 0;
                // Se calculan los totales
                desechos.forEach(desecho => desechosTotal += desecho.cantidad);
                productos.forEach(producto => { if (producto.venta.forma_pago !== 'Anulacion balanza')
                    cantidadTotal += producto.cantidad; });
                response_1.respuesta.success(res, { desechosTotal, cantidadTotal });
            }
            catch (error) {
                console.log(chalk_1.default.red(error));
                response_1.respuesta.error(res, 500);
            }
        });
    }
}
exports.ReportesController = new Reportes();
