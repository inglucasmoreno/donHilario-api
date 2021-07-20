"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
;
// Modelo - Saldo inicial
const saldoInicialSchema = new mongoose_1.Schema({
    monto: {
        type: Number,
        require: 'El saldo inicial es obligatorio'
    },
    activo: {
        type: Boolean,
        require: 'El campo activo es un valor obligatorio'
    },
}, { timestamps: true, collection: 'saldo_inicial' });
exports.default = mongoose_1.model('saldo_inicial', saldoInicialSchema);
