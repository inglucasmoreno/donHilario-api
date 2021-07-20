"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Modelo - Ingreso
const ingresoSchema = new mongoose_1.Schema({
    codigo: {
        type: Number,
        trim: true,
        required: 'Codigo de ingreso'
    },
    proveedor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'proveedor',
        required: 'El proveedor es obligatorio'
    },
    fecha_cierre: {
        type: Date,
        default: Date.now()
    },
    usuario_creacion: {
        type: String,
        trim: true,
        required: 'El usuario creador es necesario'
    },
    usuario_cierre: {
        type: String,
        trim: true,
        required: 'El usuario de cierre es necesario'
    },
    activo: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });
exports.default = mongoose_1.model('ingreso', ingresoSchema);
