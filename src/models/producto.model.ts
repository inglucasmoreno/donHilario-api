import mongoose, { Schema, model } from 'mongoose';

// Interfaz - Producto
export interface I_Producto extends mongoose.Document {
    _id: String,
    codigo: String,
    descripcion: String,
    unidad_medida: Schema.Types.ObjectId,
    cantidad: Number,
    stock_minimo: Number,
    cantidad_minima: Number,
    precio: Number,
    activo: Number
}

// Modelo - Producto
const productoSchema = new Schema({
    
    codigo: {
        type: String,
        trim: true,
        uppercase: true,
        require: 'El codigo es un valor obligatorio'
    },

    tipo: {
        type: String,
        trim: true,
        required: 'El tipo de producto es obligatorio'
    },

    descripcion: {
        type: String,
        trim: true,
        uppercase: true,
        required: 'La descripcion es un valor obligatorio'
    },

    unidad_medida: {
        type: Schema.Types.ObjectId,
        ref: 'unidad_medida',
        uppercase: true,
        required: 'La unidad de medida es un valor obligatorio'
    },

    cantidad: {
        type: Number,
        required: 'La cantidad es un valor obligatorio',
        min: 0
    },

    stock_minimo: {
        type: Boolean,
        required: 'El stock minimo es un campo obligatorio',
        default: false
    },
   
    cantidad_minima: {
        type: Number,
        required: 'La cantidad minima es un campo obligatorio',
        default: 0,
        min: 0          
    },
   
    precio: {
        type: Number, // revisar decimales
        required: 'El precio es un campo obligatorio',
        min: 0
    },
   
    activo: {
        type: Boolean,
        required: 'Activo es un campo obligatorio',
        default: true 
    }  

}, { timestamps: true });

export default model('producto', productoSchema);
