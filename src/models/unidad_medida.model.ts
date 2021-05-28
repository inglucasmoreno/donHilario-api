import mongoose, { Schema, model } from 'mongoose';

// Interfaz - Unidad de medida
export interface I_UnidadMedida extends mongoose.Document {
    descripcion: String,
    activo: Boolean    
}

// Modelo - Unidad de medida
const unidadMedidaSchema = new Schema({
    
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

}, { timestamps: true, collection: 'unidad_medida' } );

export default model('unidad_medida', unidadMedidaSchema);