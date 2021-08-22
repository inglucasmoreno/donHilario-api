import mongoose, { Schema, model } from 'mongoose';

// Interfaz - Produccion interna
export interface I_ProduccionInterna extends mongoose.Document {
    producto_entrada: Schema.Types.ObjectId,
    producto_salida: String,
    cantidad: String,
    usuario_creacion: String,
    activo: Boolean,
};

// Modelo - Otros ingresos
const produccionInternaSchema = new Schema({

    producto_entrada: {
        type: Schema.Types.ObjectId,
        required: 'El producto de entrada es obligatorio',
        ref: 'producto'
    },

    producto_salida: {
        type: String,
        trim: true,
        uppercase: true,
        required: 'El producto de salida es obligatorio'
    },

    cantidad_entrada: {
        type: Number,
        min: 0,
        required: 'La cantidad de entrada es un valor obligatorio'
    },

    cantidad_salida: {
        type: Number,
        min: 0,
        required: 'La cantidad de salida es un valor obligatorio'
    },

    usuario_creacion: {
        type: String,
        trim: true,
        uppercase: true,
        required: 'El usuario creador es un valor obligatorio'
    },

    activo: {
        type: Boolean,
        default: true
    },

},{ timestamps: true, collection: 'produccion_interna' });

export default model('produccion_interna', produccionInternaSchema);