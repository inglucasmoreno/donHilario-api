import mongoose, { Schema, model } from 'mongoose';

// Interfaz - Venta
export interface I_Venta extends mongoose.Document {
    codigo: Number,
    precio_total: Number,
    usuario_creacion: String,
    activo: Boolean,
};

// Modelo - Venta
const ventaSchema = new Schema({
    codigo: {
        type: Number,
        trim: true
    },
    precio_total: {
        type: Number,
        trim: true,
        require: 'El precio total es un campo obligatorio'
    },
    total_balanza: {
        type: Number,
        trim: true,
        require: 'El total de balanza es un campo obligatorio'
    },
    total_mercaderia: {
        type: Number,
        trim: true,
        require: 'El total de mercaderia es un campo obligatorio'
    },
    forma_pago: {
        type: String,
        trim: true,
        require: 'La forma de pago es un campo obligatorio'      
    },
    descuento_porcentual: {
        type: Number,
        trim: true,
        require: 'EL descuento porcentual es un campo obligatorio' 
    },
    usuario_creacion: {
        type: String,
        trim: true,
    },
    activo: {
        type: Boolean,
        default: true
    }
},{ timestamps: true });

export default model('venta', ventaSchema);