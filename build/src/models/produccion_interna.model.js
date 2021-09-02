"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
;
// Modelo - Otros ingresos
const produccionInternaSchema = new mongoose_1.Schema({
    producto_entrada: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: 'El producto de entrada es obligatorio',
        ref: 'producto'
    },
    producto_salida: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: 'El producto de salida es obligatorio',
        ref: 'producto'
    },
    cantidad_entrada: {
        type: Number,
        min: 0,
        required: 'La cantidad de entrada es un valor obligatorio'
    },
    cantidad_salida: {
        type: Number,
        min: 0,
        required: 'La cantidad de salida es un valor obligatorio'
    },
    usuario_creacion: {
        type: String,
        trim: true,
        uppercase: true,
        required: 'El usuario creador es un valor obligatorio'
    },
    activo: {
        type: Boolean,
        default: true
    },
}, { timestamps: true, collection: 'produccion_interna' });
exports.default = mongoose_1.model('produccion_interna', produccionInternaSchema);
