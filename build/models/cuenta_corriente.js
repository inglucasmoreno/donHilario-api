"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Modelo - Cuenta corriente
const cuentaCorrienteSchema = new mongoose_1.Schema({
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'usuario',
        required: 'El usuario es obligatorio'
    },
    total: {
        type: Number,
        min: 0,
        required: 'El total es obligatorio'
    },
    productos: [
        {
            descripcion: String,
            unidad_medida: String,
            cantidad: Number,
            carne: Boolean,
            precio_total: Number,
            precio_unitario: Number,
            producto: mongoose_1.Schema.Types.ObjectId,
            promocion: Boolean,
            tipo: String,
        }
    ],
    activo: {
        type: Boolean,
        default: true
    }
}, { timestamps: true, collection: 'cuenta_corriente' });
exports.default = mongoose_1.model('cuenta_corriente', cuentaCorrienteSchema);
