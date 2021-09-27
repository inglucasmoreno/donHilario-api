"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Modelo - Unidad de medida
const unidadMedidaSchema = new mongoose_1.Schema({
    descripcion: {
        type: String,
        trim: true,
        uppercase: true,
        required: 'Descripcion es un campo obligatorio'
    },
    activo: {
        type: Boolean,
        required: 'Activo es un campo obligatorio',
        default: true
    }
}, { timestamps: true, collection: 'unidad_medida' });
exports.default = mongoose_1.model('unidad_medida', unidadMedidaSchema);
