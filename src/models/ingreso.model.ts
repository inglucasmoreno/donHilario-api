import mongoose, { Schema, model } from 'mongoose';

// Interfaz - Ingreso
export interface I_Ingreso extends mongoose.Document {
    codigo: Number,
    proveedor: Schema.Types.ObjectId,
    fecha_cierre?: Date,
    usuario_creacion: String,
    usuario_cierre: String,
    activo: Boolean
}

// Modelo - Ingreso
const ingresoSchema = new Schema({

    codigo: {
        type: Number,
        trim: true,
        required: 'Codigo de ingreso'
    },

    proveedor: {   
        type: Schema.Types.ObjectId,
        ref: 'proveedor',
        required: 'El proveedor es obligatorio'
    },

    fecha_cierre: {
        type: Date,
        default: Date.now()
    },

    usuario_creacion: {    // Usuario de creacion de ingreso
        type: String,
        trim: true,
        required: 'El usuario creador es necesario' 
    },

    usuario_cierre: {      // Usuario de cierre de ingreso 
        type: String,
        trim: true,
        required: 'El usuario de cierre es necesario' 
    },

    activo: {
        type: Boolean,
        default: true
    },

},{ timestamps: true });

export default model('ingreso', ingresoSchema);