import mongoose, { Schema, model } from 'mongoose';

// Interfaz - Saldo inicial
export interface I_SaldoInicial extends mongoose.Document { 
    monto: Number 
};

// Modelo - Saldo inicial
const saldoInicialSchema = new Schema({
    monto: {
        type: Number,
        require: 'El saldo inicial es obligatorio'
    },
    activo: {
        type: Boolean,
        require: 'El campo activo es un valor obligatorio'
    },

},{ timestamps: true, collection: 'saldo_inicial' });

export default model('saldo_inicial', saldoInicialSchema);