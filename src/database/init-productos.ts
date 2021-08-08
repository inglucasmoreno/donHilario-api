import mongoose from 'mongoose';
import chalk from 'chalk';
import data from './mediaRes';

import UnidadModel from '../models/unidad_medida.model';
import ProductoModel from '../models/producto.model';
import MediaResModel from '../models/mediaRes.model';

// Conexion a base de datos
const bdConnection = async () => {
    await mongoose.connect('mongodb://localhost:27017/carniceria', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    });
    console.log(chalk.green('[Equinoccio Technology]') + ' - Conexion a base de datos correcta');
}

const initProductos = async () => {

    // Unidad de medida - UNIDAD
    const nuevaUnidad = new UnidadModel({ descripcion: "UNIDAD", activo: true });
    await nuevaUnidad.save();
    
    // Unidad de medida - Kilogramo
    const nuevoKilogramo = new UnidadModel({ descripcion: "KILOGRAMO", activo: true  });
    const kilogramo = await nuevoKilogramo.save();
    
    // Cortes de Media res
    data.forEach(async producto => {
        
        // Tabla productos
        producto.unidad_medida = kilogramo._id;
        const nuevoProducto = new ProductoModel(producto);
        const productoDB = await nuevoProducto.save();
    
        // Tabla mediaRes
        const nuevoElementoRes = new MediaResModel({
            id_producto: productoDB._id,
            descripcion: producto.descripcion,
            cantidad: producto.cantidad_estandar
        })
        await nuevoElementoRes.save();

    });

}

// Principal: Inicializacion de base de datos
const initialization = async () => {
    try {

        // Conexion con MongoDB
        bdConnection();

        // Inicializacion de usuarios
        await initProductos();

        console.log(chalk.green('[Equinoccio Technology]') + ' - Inicializacion de productos completada');

        console.log('');
        console.log(chalk.green('Unidades de medida creadas'));
        console.log('1 - UNIDAD');
        console.log('2 - KILOGRAMO');

        console.log('');
        console.log(chalk.green('Productos creados'));    
        data.forEach((producto, i) => {
            console.log((i+1) + ' - ' + producto.descripcion);
        });


    } catch (err) {
        console.log(err);
        throw new Error('Error al inicializar la base de datos');
    }
}

// Comienzo de inicialización
initialization();