"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
;
// Modelo - VentaProductos
const ventaProductosSchema = new mongoose_1.Schema({
    venta: {
        type: mongoose_1.Schema.Types.ObjectId,
        trim: true,
        require: 'La venta es un campo obligatorio'
    },
    producto: {
        type: mongoose_1.Schema.Types.ObjectId,
        trim: true,
        require: 'El producto es un campo obligatorio'
    },
    cantidad: {
        type: Number,
        trim: true,
        require: 'La cantidad es un campo obligatorio'
    },
    precio_unitario: {
        type: Number,
        trim: true,
        require: 'El precio unitario es un campo obligatorio'
    },
    promocion: {
        type: Boolean,
        default: false
    },
    precio_total: {
        type: Number,
        trim: true,
        require: 'El precio total es un campo obligatorio'
    },
    usuario_creacion: {
        type: String,
        trim: true
    },
    activo: {
        type: Boolean,
        default: true
    }
}, { timestamps: true, collection: 'venta_productos' });
exports.default = mongoose_1.model('venta_productos', ventaProductosSchema);
