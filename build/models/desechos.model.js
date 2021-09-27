"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Modelo - Desecho
const desechoSchema = new mongoose_1.Schema({
    descripcion: {
        type: String,
        trim: true,
        uppercase: true,
        required: 'La descripcion es un campo obligatorio'
    },
    cantidad: {
        type: Number,
        min: 0,
        required: 'La cantidad es un campo obligatorio'
    },
    activo: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });
exports.default = mongoose_1.model('desecho', desechoSchema);
