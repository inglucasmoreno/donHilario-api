import mongoose, { Schema, model } from 'mongoose';

// Interfaz - ProductoIngreso
export interface I_IngresoProducto extends mongoose.Document {
    ingreso: Schema.Types.ObjectId,
    producto: Schema.Types.ObjectId,
    cantidad: Number,
    fecha_ingreso: Date,
    usuario: String,   
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

    fecha_ingreso: {
        type: Date,
        default: Date.now()
    },

    activo: {
        type: Boolean,
        default: true
    }

}, { timestamps: true, collection: 'producto_ingreso' });

export default model('producto_ingreso', ingresoProductoSchema)