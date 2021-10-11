import mongoose, { Schema, model, Types } from 'mongoose';

// Interfaz - Cuenta corriente
export interface I_CuentaCorriente extends mongoose.Document {
    usuario: Schema.Types.ObjectId,
    total: Number,
    activo: Boolean,
}

// Modelo - Cuenta corriente
const cuentaCorrienteSchema = new Schema({
    
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'usuario',
        required: 'El usuario es obligatorio'
    },

    total: {
        type: Number,
        min: 0,
        required: 'El total es obligatorio'
    },

    productos: [
        {
            descripcion: String,
            unidad_medida: String,
            cantidad: Number,
            carne: Boolean,
            precio_total: Number,
            precio_unitario: Number,
            producto: Schema.Types.ObjectId,
            promocion: Boolean,
            tipo: String,       
        }
    ],

    activo: {
        type: Boolean,
        default: true
    }

},{ timestamps: true, collection: 'cuenta_corriente' });

export default model('cuenta_corriente', cuentaCorrienteSchema);