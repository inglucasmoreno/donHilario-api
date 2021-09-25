import mongoose, { Schema, model } from 'mongoose';

// Interfaz - Caja
export interface I_Caja extends mongoose.Document {
    saldo_inicial: Number,
    total_balanza: Number,
    total_mercaderia: Number,
    total_descuento: Number,
    total_efectivo: Number,
    total_efectivo_real: Number,
    diferencia: Number,
    total_postnet: Number,
    total_ventas: Number,
    otros_ingresos: Number,    
    otros_gastos: Number,
    tesoreria: Number,
    saldo_proxima_caja: Number,
    usuario_creacion: String,
    activo: Boolean,
};

// Modelo - caja
const cajaSchema = new Schema({

    saldo_inicial: {
        type: Number,
        min: 0,
        require: 'El saldo inicial es un valor obligatorio'
    },

    total_balanza: {
        type: Number,
        min: 0,
        require: 'El total de balanza es un valor obligatorio'
    },

    total_mercaderia: {
        type: Number,
        min: 0,
        require: 'El total en mercaderia es un valor obligatorio'
    },

    total_adicional_credito: {
        type: Number,
        min: 0,
        default: 0       
    },

    total_descuentos: {
        type: Number,
        min: 0,
        default: 0       
    },

    total_efectivo: {
        type: Number,
        min: 0,
        require: 'El total en efectivo es un valor obligatorio'
    }, 

    total_efectivo_real: {
        type: Number,
        require: 'El total en efectivo real es un valor obligatorio'
    }, 

    diferencia: {
        type: Number,
        require: 'La diferencia es un valor obligatorio'
    }, 
    
    total_postnet: {
        type: Number,
        min: 0,
        require: 'El total en postnet es un valor obligatorio'
    }, 

    total_debito: {
        type: Number,
        min: 0,
        require: 'El total en debito es un valor obligatorio'
    }, 

    total_mercadopago: {
        type: Number,
        min: 0,
        require: 'El total en mercadopago es un valor obligatorio'
    },

    total_credito: {
        type: Number,
        min: 0,
        require: 'El total en credito es un valor obligatorio'
    },

    total_ventas: {
        type: Number,
        min: 0,
        require: 'El total de venta es un valor obligatorio'       
    },

    otros_ingresos: {
        type: Number,
        min: 0,
        require: 'Otros ingresos es un valor obligatorio'       
    },

    otros_gastos: {
        type: Number,
        min: 0,
        require: 'Otros gastos es un valor obligatorio'       
    },

    tesoreria: {
        type: Number,
        default: 0       
    },

    saldo_proxima_caja: {
        type: Number,
        require: 'El saldo de proxima caja es obligatorio'      
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

},{ timestamps: true });

export default model('caja', cajaSchema);