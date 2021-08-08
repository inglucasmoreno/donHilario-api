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
exports.ProductosController = void 0;
const chalk_1 = __importDefault(require("chalk"));
const response_1 = require("../helpers/response");
const producto_model_1 = __importDefault(require("../models/producto.model"));
class Producto {
    // Metodo: Nuevo producto
    nuevoProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { codigo } = req.body;
                // Se verifica si el codigo no esta repetido
                const codigoRepetido = yield producto_model_1.default.findOne({ codigo: codigo.toUpperCase() });
                if (codigoRepetido)
                    return response_1.respuesta.error(res, 400, 'El codigo ya esta registrado');
                const producto = new producto_model_1.default(req.body);
                yield producto.save();
                response_1.respuesta.success(res, { producto });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: producto por ID
    getProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const producto = yield producto_model_1.default.findById(req.params.id)
                    .populate('unidad_medida', 'descripcion');
                if (!producto)
                    return response_1.respuesta.error(res, 400, 'El producto no existe');
                response_1.respuesta.success(res, { producto });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Listar productos
    listarProductos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Busqueda para calculo del total
                const busqueda = {};
                // Pipeline para agregacion
                let pipeline = [];
                // Etapa 1 - Filtrado por codigo
                if (req.query.codigo) {
                    const regex = new RegExp(req.query.codigo, 'i'); // Expresion regular para busqueda insensible
                    pipeline.push({ $match: { codigo: regex } });
                    busqueda['codigo'] = regex;
                }
                // Etapa 2 - Filtrado por descripcion o codigo
                let filtroCodigo = {};
                let filtroDescripcion = {};
                if (req.query.descripcion) {
                    const regex = new RegExp(req.query.descripcion, 'i'); // Expresion regular para busqueda insensible
                    pipeline.push({ $match: { $or: [{ descripcion: regex }, { codigo: regex }] } });
                    filtroCodigo = { codigo: regex };
                    filtroDescripcion = { descripcion: regex };
                }
                // Etapa 3 - Filtrado por activo/inactivo
                if (req.query.activo == 'true') {
                    pipeline.push({ $match: { activo: true } });
                    busqueda['activo'] = true;
                }
                else if (req.query.activo == 'false') {
                    pipeline.push({ $match: { activo: false } });
                    busqueda['activo'] = false;
                }
                // Etapa 4 - Join (Unidad de medida)     
                pipeline.push({ $lookup: {
                        from: 'unidad_medida',
                        localField: 'unidad_medida',
                        foreignField: '_id',
                        as: 'unidad_medida'
                    } });
                pipeline.push({ $unwind: '$unidad_medida' });
                // Etapa 5 - Ordenando datos
                const ordenar = {};
                if (req.query.columna) {
                    ordenar[req.query.columna] = Number(req.query.direccion);
                    pipeline.push({ $sort: ordenar });
                }
                // Etapa 6 -  Paginación
                const desde = req.query.desde ? Number(req.query.desde) : 0;
                const limit = req.query.limit ? Number(req.query.limit) : 0;
                if (limit != 0)
                    pipeline.push({ $limit: limit });
                pipeline.push({ $skip: desde });
                // Se obtienen los datos
                const [productos, total] = yield Promise.all([
                    producto_model_1.default.aggregate(pipeline),
                    producto_model_1.default.find(busqueda)
                        .or(filtroCodigo)
                        .or(filtroDescripcion)
                        .countDocuments()
                ]);
                response_1.respuesta.success(res, { productos, total });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Actualizar producto
    actualizarProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                let producto = yield producto_model_1.default.findById(id);
                // Se verifica si el producto a actualizar exite
                if (!producto)
                    return response_1.respuesta.error(res, 400, 'El producto no existe');
                // Se verifica si el nuevo codigo ya esta registrado
                if (req.body.codigo) {
                    if (req.body.codigo.toUpperCase() !== producto.codigo.toUpperCase()) {
                        const codigoExiste = yield producto_model_1.default.findOne({ codigo: req.body.codigo.toUpperCase() });
                        if (codigoExiste)
                            return response_1.respuesta.error(res, 400, 'El codigo ya esta registrado');
                    }
                }
                producto = yield producto_model_1.default.findByIdAndUpdate(id, req.body, { new: true });
                response_1.respuesta.success(res, { producto });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
            }
        });
    }
}
exports.ProductosController = new Producto();
