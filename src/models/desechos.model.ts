import mongoose, { Schema, model } from 'mongoose';

// Interfaz - Desechos
export interface I_Desecho extends mongoose.Document {
    descripcion: String,
    cantidad: String,
    activo: Boolean,
}

// Modelo - Desecho
const desechoSchema = new Schema({
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
},{ timestamps: true });

export default model('desecho', desechoSchema);