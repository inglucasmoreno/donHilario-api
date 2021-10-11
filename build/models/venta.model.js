"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
;
// Modelo - Venta
const ventaSchema = new mongoose_1.Schema({
    precio_total: {
        type: Number,
        require: 'El precio total es un campo obligatorio'
    },
    total_balanza: {
        type: Number,
        require: 'El total de balanza es un campo obligatorio'
    },
    total_mercaderia: {
        type: Number,
        require: 'El total de mercaderia es un campo obligatorio'
    },
    forma_pago: {
        type: String,
        trim: true,
        require: 'La forma de pago es un campo obligatorio'
    },
    usuario_cuenta_corriente: {
        type: String,
        trim: true,
        default: ''
    },
    forma_pago_personalizada: [{
            tipo: String,
            monto: Number
        }],
    total_adicional_credito: {
        type: Number,
        default: 0
    },
    total_descuento: {
        type: Number,
        default: 0
    },
    venta_mayorista: {
        type: Boolean,
        default: false
    },
    mayorista: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'mayorista',
        default: null
    },
    usuario_creacion: {
        type: String,
        trim: true,
    },
    activo: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });
exports.default = mongoose_1.model('venta', ventaSchema);
