import mongoose, { Schema, model } from 'mongoose';

// Interfaz - Proveedor
export interface I_Proveedor extends mongoose.Document {
    razon_social: String,
    cuit: String,
    domicilio: String,
    condicion_iva: String,
    activo: Boolean,
}

// Modelo - Proveedor
const proveedorSchema = new Schema({
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

    condicion_iva: {
        type: String,
        trim: true,
        required: 'La condicion frente al IVA es obligatoria'
    },  

    activo: {
        type: Boolean,
        default: true
    }
},{ timestamps: true, collection: 'proveedores' });

export default model('proveedor', proveedorSchema);