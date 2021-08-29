"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
;
// Modelo - Otros gastos
const otrosGastosSchema = new mongoose_1.Schema({
    caja: {
        type: mongoose_1.Schema.Types.ObjectId,
        require: 'La caja es un valor obligatorio'
    },
    descripcion: {
        type: String,
        trim: true,
        uppercase: true,
        require: 'La descripcion es un valor obligatorio'
    },
    monto: {
        type: Number,
        min: 0,
        require: 'El monto es un valor obligatorio'
    },
    usuario_creacion: {
        type: String,
        trim: true,
        uppercase: true,
        require: 'El usuario creador es un valor obligatorio'
    },
    activo: {
        type: Boolean,
        require: 'El campo activo es un valor obligatorio'
    },
}, { timestamps: true, collection: 'otros_gastos' });
exports.default = mongoose_1.model('otros_gastos', otrosGastosSchema);
