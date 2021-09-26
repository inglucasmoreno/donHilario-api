import mongoose, { Schema, model } from 'mongoose';

// Interfaz - Venta
export interface I_Venta extends mongoose.Document {
    precio_total: Number,
    total_balanza: Number,
    total_mercaderia: Number,
    forma_pago: String,
    forma_pago_personalizada: [{ tipo: String, monto: Number }],
    total_adicional_credito: Number,
    total_descuento: Number,
    venta_mayorista: Boolean,
    mayorista: Schema.Types.ObjectId,
    usuario_creacion: String,
    activo: Boolean,
};

// Modelo - Venta
const ventaSchema = new Schema({
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
    forma_pago_personalizada: [{
        tipo: String,
        monto: Number
    }],
    total_adicional_credito: { 
        type: Number,
        trim: true,
        default: 0
    },
    total_descuento: { 
        type: Number,
        trim: true,
        default: 0
    },
    venta_mayorista: {
        type: Boolean,
        default: false    
    },
    mayorista: {
        type: Schema.Types.ObjectId,
        ref: 'mayorista',
        default: null
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