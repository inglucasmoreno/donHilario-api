import mongoose, { Schema, model } from 'mongoose';

// Interfaz - ProductoIngreso
export interface I_IngresoProducto extends mongoose.Document {
    ingreso: Schema.Types.ObjectId,
    producto: Schema.Types.ObjectId,
    cantidad: Number,
    usuario_creacion: String,   
    activo: Boolean                    
}

// Modelo - ProductoIngreso
const ingresoProductoSchema = new Schema({

    ingreso: {
        type: Schema.Types.ObjectId,
        ref: 'ingreso',
        required: 'El ingreso es obligatorio'
    },

    producto: {
        type: Schema.Types.ObjectId,
        ref: 'producto',
        required: 'El producto es obligatorio'
    },

    cantidad: {
        type: Number,
        min: 0,
        required: 'La cantidad es obligatoria'
    },

    usuario_creacion: {
       type: String,
       required: 'El usuario es obligatorio'     
    },

    activo: {
        type: Boolean,
        default: true
    }

}, { timestamps: true, collection: 'ingreso_producto' });

export default model('ingreso_producto', ingresoProductoSchema)