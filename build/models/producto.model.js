"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Modelo - Producto
const productoSchema = new mongoose_1.Schema({
    codigo: {
        type: String,
        trim: true,
        uppercase: true,
        require: 'El codigo es un valor obligatorio'
    },
    descripcion: {
        type: String,
        trim: true,
        uppercase: true,
        required: 'La descripcion es un valor obligatorio'
    },
    unidad_medida: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'unidad_medida',
        uppercase: true,
        required: 'La unidad de medida es un valor obligatorio'
    },
    cantidad: {
        type: Number,
        required: 'La cantidad es un valor obligatorio',
        min: 0
    },
    stock_minimo: {
        type: Boolean,
        required: 'El stock minimo es un campo obligatorio',
        default: false
    },
    cantidad_minima: {
        type: Number,
        required: 'La cantidad minima es un campo obligatorio',
        default: 0,
        min: 0
    },
    precio: {
        type: Number,
        required: 'El precio es un campo obligatorio',
        min: 0
    },
    activo: {
        type: Boolean,
        required: 'Activo es un campo obligatorio',
        default: true
    }
}, { timestamps: true });
exports.default = mongoose_1.model('producto', productoSchema);
