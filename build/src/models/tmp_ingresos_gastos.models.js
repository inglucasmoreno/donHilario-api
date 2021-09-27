"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Modelo - Ingresos y Gastos temporales
const tmpIngresosGastosSchema = new mongoose_1.Schema({
    descripcion: {
        type: String,
        trim: true,
        uppercase: true,
        required: 'La descripcion es un campo obligatorio'
    },
    tipo: {
        type: String,
        trim: true,
        required: 'El tipo es un campo obligatorio'
    },
    monto: {
        type: Number,
        required: 'El monto es un campo obligatorio'
    },
    activo: {
        type: Boolean,
        required: 'Activo es un campo obligatorio',
        default: true
    }
}, { timestamps: true, collection: 'tmp_ingresos_gastos' });
exports.default = mongoose_1.model('tmp_ingresos_gastos', tmpIngresosGastosSchema);
