import mongoose, { Schema, model } from 'mongoose';

// Interfaz - Otros gastos
export interface I_OtrosGastos extends mongoose.Document {
    caja: Schema.Types.ObjectId,
    descripcion: String,
    monto: Number,
    usuario_creacion: String,
    activo: Boolean,
};

// Modelo - Otros gastos
const otrosGastosSchema = new Schema({

    caja: {
        type: Schema.Types.ObjectId,
        require: 'La caja es un valor obligatorio'
    },

    descripcion: {
        type: String,
        trim: true,
        uppercase: true,
        require: 'La descripcion es un valor obligatorio'
    },

    monto: {
        type: Number,
        min: 0,
        require: 'El monto es un valor obligatorio'
    },

    usuario_creacion: {
        type: String,
        trim: true,
        uppercase: true,
        require: 'El usuario creador es un valor obligatorio'
    },

    activo: {
        type: Boolean,
        require: 'El campo activo es un valor obligatorio'
    },

},{ timestamps: true, collection: 'otros_gastos' });

export default model('otros_gastos', otrosGastosSchema);