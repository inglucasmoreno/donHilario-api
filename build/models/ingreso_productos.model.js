"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Modelo - ProductoIngreso
const ingresoProductoSchema = new mongoose_1.Schema({
    ingreso: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'ingreso',
        required: 'El ingreso es obligatorio'
    },
    proveedor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'proveedor',
        required: 'El proveedor es obligatorio'
    },
    producto: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'producto',
        required: 'El producto es obligatorio'
    },
    cantidad: {
        type: Number,
        min: 0,
        required: 'La cantidad es obligatoria'
    },
    usuario_creacion: {
        type: String,
        required: 'El usuario es obligatorio'
    },
    activo: {
        type: Boolean,
        default: true
    }
}, { timestamps: true, collection: 'ingreso_producto' });
exports.default = mongoose_1.model('ingreso_producto', ingresoProductoSchema);
