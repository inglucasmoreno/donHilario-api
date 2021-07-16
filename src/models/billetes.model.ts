import mongoose, { Schema, model } from 'mongoose';

// Interfaz - Caja
export interface I_Billetes extends mongoose.Document {
    caja: Schema.Types.ObjectId,
    cinco: Number,
    diez: Number,
    veinte: Number,
    cincuenta: Number,
    cien: Number,
    doscientos: Number,
    quinientos: Number,
    mil: Number,
    monedas: Number,
    activo: Boolean,
};

// Modelo - caja
const billetesSchema = new Schema({

    caja: {
        type: Schema.Types.ObjectId,
        require: 'La caja es un campo obligatorio'
    },

    cinco: {
        type: Number,
        min: 0,
        require: 'Cinco es un valor obligatorio'
    },

    diez: {
        type: Number,
        min: 0,
        require: 'Diez es un valor obligatorio'
    },

    veinte: {
        type: Number,
        min: 0,
        require: 'Veinte es un valor obligatorio'
    },
    
    cincuenta: {
        type: Number,
        min: 0,
        require: 'Cincuenta es un valor obligatorio'
    },

    cien: {
        type: Number,
        min: 0,
        require: 'Cien es un valor obligatorio'
    },

    doscientos: {
        type: Number,
        min: 0,
        require: 'Doscientos es un valor obligatorio'
    },

    quinientos: {
        type: Number,
        min: 0,
        require: 'Quinientos es un valor obligatorio'
    },

    mil: {
        type: Number,
        min: 0,
        require: 'Mil es un valor obligatorio'
    },

    monedas: {
        type: Number,
        min: 0,
        require: 'Monedas es un valor obligatorio'
    },

    activo: {
        type: Boolean,
        require: 'El campo activo es un valor obligatorio'
    },

},{ timestamps: true });

export default model('billete', billetesSchema);