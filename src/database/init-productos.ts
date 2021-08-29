import mongoose from 'mongoose';
import chalk from 'chalk';
import dataMediaRes from './mediaRes';
import dataCerdo from './cerdo';
import dataPollo from './pollo';
import dataOtros from './otros';

import UnidadModel from '../models/unidad_medida.model';
import ProductoModel from '../models/producto.model';
import MediaResModel from '../models/mediaRes.model';
import CerdoModel from '../models/cerdo.model';
import PolloModel from '../models/pollo.model';

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
    dataMediaRes.forEach(async producto => {
        
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

    // Cortes de cerdo
    dataCerdo.forEach(async producto => {
    
        // Tabla productos
        producto.unidad_medida = kilogramo._id;
        const nuevoProducto = new ProductoModel(producto);
        const productoDB = await nuevoProducto.save();
    
        // Tabla cerdo
        const nuevoElementoCerdo = new CerdoModel({
            id_producto: productoDB._id,
            descripcion: producto.descripcion,
            cantidad: producto.cantidad_estandar
        })
        await nuevoElementoCerdo.save();

    });

    // Cortes de pollo
    dataPollo.forEach(async producto => {

        // Tabla productos
        producto.unidad_medida = kilogramo._id;
        const nuevoProducto = new ProductoModel(producto);
        const productoDB = await nuevoProducto.save();
    
        // Tabla pollo
        const nuevoElementoPollo = new PolloModel({
            id_producto: productoDB._id,
            descripcion: producto.descripcion,
            cantidad: producto.cantidad_estandar
        })
        await nuevoElementoPollo.save();

    });

    // Otros productos de balanza
    dataOtros.forEach(async producto => {
        producto.unidad_medida = kilogramo._id;
        const nuevoProducto = new ProductoModel(producto);
        await nuevoProducto.save();
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

        // Unidades de medida creadas
        console.log('');
        console.log(chalk.green('Unidades de medida creadas'));
        console.log('1 - UNIDAD');
        console.log('2 - KILOGRAMO');
        
        // Productos de media res creados
        console.log('');
        console.log(chalk.green('Productos creados - Media Res'));    
        dataMediaRes.forEach((producto, i) => {
            console.log((i+1) + ' - ' + producto.descripcion);
        });

        // Productos de cerdo creados
        console.log('');
        console.log(chalk.green('Productos creados - Cerdo'));    
        dataCerdo.forEach((producto, i) => {
            console.log((i+1) + ' - ' + producto.descripcion);
        });

        // Productos de pollo creados
        console.log('');
        console.log(chalk.green('Productos creados - Pollo'));    
        dataPollo.forEach((producto, i) => {
            console.log((i+1) + ' - ' + producto.descripcion);
        });

        // Productos de pollo creados
        console.log('');
        console.log(chalk.green('Otros productos de balanza creados'));    
        dataOtros.forEach((producto, i) => {
            console.log((i+1) + ' - ' + producto.descripcion);
        });


    } catch (err) {
        console.log(err);
        throw new Error('Error al inicializar la base de datos');
    }
}

// Comienzo de inicialización
initialization();