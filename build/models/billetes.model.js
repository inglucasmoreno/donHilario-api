"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
;
// Modelo - caja
const billetesSchema = new mongoose_1.Schema({
    caja: {
        type: mongoose_1.Schema.Types.ObjectId,
        require: 'La caja es un campo obligatorio'
    },
    cinco: {
        type: Number,
        min: 0,
        require: 'Cinco es un valor obligatorio'
    },
    diez: {
        type: Number,
        min: 0,
        require: 'Diez es un valor obligatorio'
    },
    veinte: {
        type: Number,
        min: 0,
        require: 'Veinte es un valor obligatorio'
    },
    cincuenta: {
        type: Number,
        min: 0,
        require: 'Cincuenta es un valor obligatorio'
    },
    cien: {
        type: Number,
        min: 0,
        require: 'Cien es un valor obligatorio'
    },
    doscientos: {
        type: Number,
        min: 0,
        require: 'Doscientos es un valor obligatorio'
    },
    quinientos: {
        type: Number,
        min: 0,
        require: 'Quinientos es un valor obligatorio'
    },
    mil: {
        type: Number,
        min: 0,
        require: 'Mil es un valor obligatorio'
    },
    monedas: {
        type: Number,
        min: 0,
        require: 'Monedas es un valor obligatorio'
    },
    activo: {
        type: Boolean,
        require: 'El campo activo es un valor obligatorio'
    },
}, { timestamps: true });
exports.default = mongoose_1.model('billete', billetesSchema);
