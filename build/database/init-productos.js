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
const mongoose_1 = __importDefault(require("mongoose"));
const chalk_1 = __importDefault(require("chalk"));
const mediaRes_1 = __importDefault(require("./mediaRes"));
const cerdo_1 = __importDefault(require("./cerdo"));
const pollo_1 = __importDefault(require("./pollo"));
const otros_1 = __importDefault(require("./otros"));
const unidad_medida_model_1 = __importDefault(require("../models/unidad_medida.model"));
const producto_model_1 = __importDefault(require("../models/producto.model"));
const mediaRes_model_1 = __importDefault(require("../models/mediaRes.model"));
const cerdo_model_1 = __importDefault(require("../models/cerdo.model"));
const pollo_model_1 = __importDefault(require("../models/pollo.model"));
// Conexion a base de datos
const bdConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect('mongodb://localhost:27017/carniceria', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    });
    console.log(chalk_1.default.green('[Equinoccio Technology]') + ' - Conexion a base de datos correcta');
});
const initProductos = () => __awaiter(void 0, void 0, void 0, function* () {
    // Unidad de medida - UNIDAD
    const nuevaUnidad = new unidad_medida_model_1.default({ descripcion: "UNIDAD", activo: true });
    yield nuevaUnidad.save();
    // Unidad de medida - Kilogramo
    const nuevoKilogramo = new unidad_medida_model_1.default({ descripcion: "KILOGRAMO", activo: true });
    const kilogramo = yield nuevoKilogramo.save();
    // Cortes de Media res
    mediaRes_1.default.forEach((producto) => __awaiter(void 0, void 0, void 0, function* () {
        // Tabla productos
        producto.unidad_medida = kilogramo._id;
        const nuevoProducto = new producto_model_1.default(producto);
        const productoDB = yield nuevoProducto.save();
        // Tabla mediaRes
        const nuevoElementoRes = new mediaRes_model_1.default({
            id_producto: productoDB._id,
            descripcion: producto.descripcion,
            cantidad: producto.cantidad_estandar
        });
        yield nuevoElementoRes.save();
    }));
    // Cortes de cerdo
    cerdo_1.default.forEach((producto) => __awaiter(void 0, void 0, void 0, function* () {
        // Tabla productos
        producto.unidad_medida = kilogramo._id;
        const nuevoProducto = new producto_model_1.default(producto);
        const productoDB = yield nuevoProducto.save();
        // Tabla cerdo
        const nuevoElementoCerdo = new cerdo_model_1.default({
            id_producto: productoDB._id,
            descripcion: producto.descripcion,
            cantidad: producto.cantidad_estandar
        });
        yield nuevoElementoCerdo.save();
    }));
    // Cortes de pollo
    pollo_1.default.forEach((producto) => __awaiter(void 0, void 0, void 0, function* () {
        // Tabla productos
        producto.unidad_medida = kilogramo._id;
        const nuevoProducto = new producto_model_1.default(producto);
        const productoDB = yield nuevoProducto.save();
        // Tabla pollo
        const nuevoElementoPollo = new pollo_model_1.default({
            id_producto: productoDB._id,
            descripcion: producto.descripcion,
            cantidad: producto.cantidad_estandar
        });
        yield nuevoElementoPollo.save();
    }));
    // Otros productos de balanza
    otros_1.default.forEach((producto) => __awaiter(void 0, void 0, void 0, function* () {
        producto.unidad_medida = kilogramo._id;
        const nuevoProducto = new producto_model_1.default(producto);
        yield nuevoProducto.save();
    }));
});
// Principal: Inicializacion de base de datos
const initialization = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Conexion con MongoDB
        bdConnection();
        // Inicializacion de usuarios
        yield initProductos();
        console.log(chalk_1.default.green('[Equinoccio Technology]') + ' - Inicializacion de productos completada');
        // Unidades de medida creadas
        console.log('');
        console.log(chalk_1.default.green('Unidades de medida creadas'));
        console.log('1 - UNIDAD');
        console.log('2 - KILOGRAMO');
        // Productos de media res creados
        console.log('');
        console.log(chalk_1.default.green('Productos creados - Media Res'));
        mediaRes_1.default.forEach((producto, i) => {
            console.log((i + 1) + ' - ' + producto.descripcion);
        });
        // Productos de cerdo creados
        console.log('');
        console.log(chalk_1.default.green('Productos creados - Cerdo'));
        cerdo_1.default.forEach((producto, i) => {
            console.log((i + 1) + ' - ' + producto.descripcion);
        });
        // Productos de pollo creados
        console.log('');
        console.log(chalk_1.default.green('Productos creados - Pollo'));
        pollo_1.default.forEach((producto, i) => {
            console.log((i + 1) + ' - ' + producto.descripcion);
        });
        // Productos de pollo creados
        console.log('');
        console.log(chalk_1.default.green('Otros productos de balanza creados'));
        otros_1.default.forEach((producto, i) => {
            console.log((i + 1) + ' - ' + producto.descripcion);
        });
    }
    catch (err) {
        console.log(err);
        throw new Error('Error al inicializar la base de datos');
    }
});
// Comienzo de inicialización
initialization();
