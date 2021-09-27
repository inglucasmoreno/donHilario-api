"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Modelo - Proveedor
const proveedorSchema = new mongoose_1.Schema({
    razon_social: {
        type: String,
        trim: true,
        uppercase: true,
        required: 'La razon social es un campo obligatorio'
    },
    cuit: {
        type: String,
        unique: true,
        trim: true,
        uppercase: true,
        required: 'El CUIT es un campo obligatorio'
    },
    domicilio: {
        type: String,
        trim: true,
        uppercase: true,
        default: 'SIN DOMICILIO'
    },
    telefono: {
        type: String,
        trim: true,
        uppercase: true,
        default: 'SIN TELEFONO'
    },
    condicion_iva: {
        type: String,
        trim: true,
        required: 'La condicion frente al IVA es obligatoria'
    },
    activo: {
        type: Boolean,
        default: true
    }
}, { timestamps: true, collection: 'proveedores' });
exports.default = mongoose_1.model('proveedor', proveedorSchema);
