import mongoose, { Schema, model } from 'mongoose';

// Interfaz - Ingresos y Gastos temporales
export interface I_TmpIngresosGastos extends mongoose.Document {
    descripcion: String,
    tipo: String,
    monto: Number,
    activo: Boolean    
}

// Modelo - Ingresos y Gastos temporales
const tmpIngresosGastosSchema = new Schema({
    
    descripcion: {
        type: String,
        trim: true,
        uppercase: true,
        required: 'La descripcion es un campo obligatorio'
    },

    tipo: {
        type: String,
        trim: true,
        required: 'El tipo es un campo obligatorio'
    },

    monto: {
        type: Number,
        required: 'El monto es un campo obligatorio'
    },
    
    activo: {
        type: Boolean,
        required: 'Activo es un campo obligatorio',
        default: true
    }

}, { timestamps: true, collection: 'tmp_ingresos_gastos' } );

export default model('tmp_ingresos_gastos', tmpIngresosGastosSchema);