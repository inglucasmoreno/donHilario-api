import mongoose, { Schema, model } from 'mongoose';

// Interfaz - Venta
export interface I_Venta extends mongoose.Document {
    codigo: Number,
    precio_total: Number,
    usuario_creacion: String,
    activo: Boolean,
};

// Modelo - Venta
const ventaSchema = new Schema({
    codigo: {
        type: Number,
        trim: true
    },
    precio_total: {
        type: Number,
        trim: true,
        require: 'El precio total es un campo obligatorio'
    },
    usuario_creacion: {
        type: String,
        trim: true,
    },
    activo: {
        type: Boolean,
        default: true
    }
},{ timestamps: true });

export default model('venta', ventaSchema);