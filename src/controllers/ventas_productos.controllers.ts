import chalk from 'chalk';
import { Request, Response } from 'express';

import { respuesta } from '../helpers/response';
import VentaProductosModel, { I_VentaProductos } from '../models/venta_productos.model'
import UsuarioModel from '../models/usuarios.model';
import mongoose from 'mongoose';


class VentasProductos {

    // Metodo: producto por ID
    public async getProducto(req: Request, res: Response) {
        try{
            const id = req.params.id;
            const producto: I_VentaProductos = await VentaProductosModel.findById(id);        
            if(!producto) return respuesta.error(res, 400, 'El producto no existe');
            respuesta.success(res, { producto });
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }
    }

    // Metodo: nuevo producto
    public async nuevoProducto(req: any, res: Response) {
        try{
            
            const { uid } = req;

            // Se agregar el usuario creador a la data
            const usuarioLogin = await UsuarioModel.findById(uid, 'apellido nombre');
            const usuario_creacion = usuarioLogin.apellido + ' ' + usuarioLogin.nombre;
            req.body.usuario_creacion = usuario_creacion;
            
            const producto = new VentaProductosModel(req.body);
            const productoCreado = await producto.save();
            respuesta.success(res, { producto: productoCreado });
        
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }           
    }

    // Metodo: listar productos
    public async listarProductos(req: any, res: Response) {
        const pipeline = []; 
        
        // Join (productos)
        pipeline.push({
            $lookup: {
                from: 'productos',
                localField: 'producto',
                foreignField: '_id',
                as: 'producto'
            }
        });
        pipeline.push({ $unwind: '$producto' });

        // Join (productos -> Unidad de medida)
        pipeline.push({
            $lookup: {
                from: 'unidad_medida',
                localField: 'producto.unidad_medida',
                foreignField: '_id',
                as: 'producto.unidad_medida'
            }
        });
        pipeline.push({$unwind: '$producto.unidad_medida'});
        
        // Ordenando datos
        const ordenar: any = {};
        if(req.query.columna){
            ordenar[req.query.columna] = Number(req.query.direccion);
            pipeline.push({$sort: ordenar});
        }

        // Se genera el listado de productos
        const productos = await VentaProductosModel.aggregate(pipeline);
        respuesta.success( res, { productos } );
    }

    // Metodo: listar productos por venta
    public async listarProductosPorVenta(req: any, res: Response) {

        const { venta } = req.params;

        const pipeline = []; 
        
        // Matcheo con el ID de venta
        pipeline.push({ $match: { venta: mongoose.Types.ObjectId(venta) } });

        // Join (productos)
        pipeline.push({
            $lookup: {
                from: 'productos',
                localField: 'producto',
                foreignField: '_id',
                as: 'producto'
            }
        });
        pipeline.push({ $unwind: '$producto' });

        // Join (productos -> Unidad de medida)
        pipeline.push({
            $lookup: {
                from: 'unidad_medida',
                localField: 'producto.unidad_medida',
                foreignField: '_id',
                as: 'producto.unidad_medida'
            }
        });
        pipeline.push({$unwind: '$producto.unidad_medida'});
        
        // Ordenando datos
        const ordenar: any = {};
        if(req.query.columna){
            ordenar[req.query.columna] = Number(req.query.direccion);
            pipeline.push({$sort: ordenar});
        }

        // Se genera el listado de productos
        const productos = await VentaProductosModel.aggregate(pipeline);
        respuesta.success( res, { productos } );
    }

    // Metodo: Actualizar producto
    public async actualizarProducto(req: Request, res: Response) {
        try{
            const id = req.params.id;
            const data = req.body;
            const producto = await VentaProductosModel.findById(id);
            if(!producto) return respuesta.error(res, 400, 'El producto no existe');
            const productoActualizado = await VentaProductosModel.findByIdAndUpdate(id, data, { new: true });
            respuesta.success(res, { producto: productoActualizado });
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }
    }

    // Metodo: Eliminar producto
    public async eliminarProducto(req: Request, res: Response) {
        try{
            const id = req.params.id;
            const producto = await VentaProductosModel.findById(id);            
            if(!producto) return respuesta.error(res, 400, 'El producto no existe'); 
            const productoEliminado = await VentaProductosModel.findByIdAndRemove(id);
            respuesta.success(res, { producto: productoEliminado });
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }        
    } 

}

export const VentasProductosController = new VentasProductos();