import mongoose, { Schema, model } from 'mongoose';

// Interfaz - Media res
export interface I_MediaRes extends mongoose.Document {
    id_producto: String,
    descripcion: String,
    cantidad: String,
    activo: Boolean
}

// Modelo - Media res
const mediaResSchema = new Schema({
    
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

},{ timestamps: true, collection: 'media_res' });

export default model('media_res', mediaResSchema);