import mongoose, { Schema, model } from 'mongoose';

// Interfaz - Pollo
export interface I_Pollo extends mongoose.Document {
    id_producto: String,
    descripcion: String,
    cantidad: String,
    activo: Boolean
}

// Modelo - Pollo
const polloSchema = new Schema({
    
    id_producto: {
        type: String,
        trim: true,
        required: 'El ID de producto es obligatorio'
    },

    descripcion: {
        type: String,
        trim: true,
        uppercase: true,
        required: 'La descripcion es obligatoria'
    },

    cantidad: {
        type: Number,
        min: 0,
        required: 'La cantidad es obligatoria'
    },

    activo: {
        type: Boolean,
        default: true
    }

},{ timestamps: true, collection: 'pollo' });

export default model('pollo', polloSchema);