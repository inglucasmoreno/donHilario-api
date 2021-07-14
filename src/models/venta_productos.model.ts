import mongoose, {Schema, model} from 'mongoose';

// Interfaz - VentaProductos
export interface I_VentaProductos extends mongoose.Document {
    venta: Schema.Types.ObjectId,
    producto: Schema.Types.ObjectId,
    cantidad: Number,
    precio_unitario: Number,
    precio_total: Number,
    usuario_crecion: String,
    activo: Boolean
};

// Modelo - VentaProductos
const ventaProductosSchema = new Schema({
    venta: {
        type: Schema.Types.ObjectId,
        trim: true,
        require: 'La venta es un campo obligatorio'
    },
    producto: {
        type: Schema.Types.ObjectId,
        trim: true,
        require: 'El producto es un campo obligatorio'
    },
    cantidad: {
        type: Number,
        trim: true,
        require: 'La cantidad es un campo obligatorio'
    },
    precio_unitario: {
        type: Number,
        trim: true,
        require: 'El precio unitario es un campo obligatorio'
    },
    promocion: {
        type: Boolean,
        default: false
    },
    precio_total: {
        type: Number,
        trim: true,
        require: 'El precio total es un campo obligatorio'
    },
    usuario_creacion: {
        type: String,
        trim: true
    },
    activo: {
        type: Boolean,
        default: true
    }
},{ timestamps: true, collection: 'venta_productos' });

export default model('venta_productos', ventaProductosSchema);

