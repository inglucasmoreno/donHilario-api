import { Request, Response } from 'express';
import chalk from 'chalk';

import { respuesta } from '../helpers/response';
import UsuarioModel from '../models/usuarios.model';
import ProduccionInternaModel, { I_ProduccionInterna } from '../models/produccion_interna.model';
import ProductoModel, { I_Producto } from '../models/producto.model';
import productoModel from '../models/producto.model';

class ProduccionInterna {

    // Metodo: Nueva produccion interna
    public async nuevaProduccionInterna(req: any, res: Response) {
        try{
            
            const { uid } = req;
            const { producto_entrada, cantidad_entrada, producto_salida, cantidad_salida } = req.body;

            // Se agregar el usuario creador a la data
            const usuarioLogin = await UsuarioModel.findById(uid, 'apellido nombre');
            const usuario_creacion = usuarioLogin.apellido + ' ' + usuarioLogin.nombre;
            req.body.usuario_creacion = usuario_creacion;
            
            // Se crea la produccion interna
            const produccionInterna = new ProduccionInternaModel(req.body);
            const produccion: I_ProduccionInterna = await produccionInterna.save();

            // Se altera el stock
            const productoEntradaDB: any = await ProductoModel.findById(producto_entrada);
            const productoSalidaDB: any = await ProductoModel.findById(producto_salida);

            const nuevaCantidadEntrada: number = productoEntradaDB.cantidad - cantidad_entrada;
            const nuevaCantidadSalida: number = productoSalidaDB.cantidad + cantidad_salida;  

            await ProductoModel.findByIdAndUpdate(producto_entrada, { cantidad: nuevaCantidadEntrada });
            await ProductoModel.findByIdAndUpdate(producto_salida, { cantidad: nuevaCantidadSalida });

            respuesta.success(res, { produccion });
        
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }    
    }

    // Metodo: Completar produccion interna
    public async completarProduccionInterna(req: Request, res: Response) {
        try{
            await ProduccionInternaModel.updateMany({activo: true}, {activo: false});
            respuesta.success(res, 'Cierre completado correctamente');
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }
    }

    // Metodo: Listar produccion interna
     public async listarProduccionInterna(req: any, res: Response) {
        try{
            // Pipeline para agregacion
            let pipeline = [];
            
            // Filtro activo
            if(req.query.activo == 'true' || req.query.activo == 'false'){
                pipeline.push({$match: {activo: req.query.activo === 'true' ? true : false}});
            }

            // Join (Producto entrada)     
            pipeline.push(
                { $lookup: { // Lookup - Tipos
                    from: 'productos',
                    localField: 'producto_entrada',
                    foreignField: '_id',
                    as: 'producto_entrada'
                }},
            );

            pipeline.push({ $unwind: '$producto_entrada' });

            // Join (Producto salida)     
            pipeline.push(
                { $lookup: { // Lookup - Tipos
                    from: 'productos',
                    localField: 'producto_salida',
                    foreignField: '_id',
                    as: 'producto_salida'
                }},
            );
            
            pipeline.push({ $unwind: '$producto_salida' });
            
            // Ordenando datos
            const ordenar: any = {};
            if(req.query.columna){
                ordenar[req.query.columna] = Number(req.query.direccion); 
                pipeline.push({$sort: ordenar});
            }
            
            // Se obtienen los datos
            const [produccion, total] = await Promise.all([
                ProduccionInternaModel.aggregate(pipeline),
                ProduccionInternaModel.find().countDocuments()
            ]);
            respuesta.success(res, { produccion, total });
    
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }   
    }

    // Metodo: Actualizar produccion interna
    public async actualizarProduccionInterna(req: Request, res: Response) {
        try{

            const id = req.params.id;
            
            // Se verifica si la produccion a actualizar existe
            const dbProduccion = await ProduccionInternaModel.findById(id);
            if(!dbProduccion) return respuesta.error(res, 400, 'La produccion no existe');
    
            const produccion = await ProduccionInternaModel.findByIdAndUpdate(id, req.body, {new: true});
            respuesta.success(res, { produccion });
        
        }catch(err){    
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }
    }

    // Metodo: Eliminar produccion interna
    public async eliminarProduccionInterna(req: Request, res: Response) {
        try{
            const { id } = req.params;           
            
            // Se busca el ID del producto
            const produccionDB = await ProduccionInternaModel.findById(id);
            
            // Se elimina la produccion interna
            await ProduccionInternaModel.findByIdAndRemove(id);
            
            // Se recupera el stock - Producto entrada
            await ProductoModel.findByIdAndUpdate(produccionDB.producto_entrada, { $inc: { cantidad: produccionDB.cantidad_entrada }  }, {new: true});
            
            // Se recupera el stock - Producto salida
            const productoDB = await ProductoModel.findById(produccionDB.producto_salida);
            const nuevaCantidad = productoDB.cantidad - produccionDB.cantidad_salida;
            await ProductoModel.findByIdAndUpdate(produccionDB.producto_salida, { cantidad: nuevaCantidad }, {new: true}); 

            respuesta.success(res, 'Eliminado correctamente'); 
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }       
    }

}

export const ProduccionInternaController = new ProduccionInterna();