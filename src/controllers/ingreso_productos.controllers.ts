import { Request, Response } from 'express';

import chalk from 'chalk';
import { respuesta } from '../helpers/response';

import ProductoModel from '../models/producto.model';
import UsuarioModel from '../models/usuarios.model';
import MediaResModel from '../models/mediaRes.model';
import IngresoProductoModel, { I_IngresoProducto } from '../models/ingreso_productos.model';
import mongoose from 'mongoose';

class IngresoProducto {
    
    // Metodo: Producto - Ingreso por ID
    public async getProducto(req: Request, res: Response) {
        try{

            const { id } = req.params;
            const producto = await IngresoProductoModel.findById(id)
                                                       .populate('ingreso')
                                                       .populate('producto')
            respuesta.success(res, { producto })

        }catch(err){

            console.log(chalk.red(err));
            respuesta.error(res, 500);

        }
    }

    // Metodo: Productos por ingreso
    public async productosPorIngreso(req: any, res: Response) {
        try{

            const { ingreso } = req.params;

            const pipeline = [];

            // Filtrado por ingreso
            pipeline.push({ $match: { ingreso: mongoose.Types.ObjectId(ingreso) }});

            // Join (Productos)
            pipeline.push(
                { $lookup: { // Lookup - Productos
                    from: 'productos',
                    localField: 'producto',
                    foreignField: '_id',
                    as: 'producto'
                }},
            );
            pipeline.push({ $unwind: '$producto' });

            // Join (Producto - Unidad de medida)
            pipeline.push(
            { $lookup: { // Lookup - Unidad de medida
                from: 'unidad_medida',
                localField: 'producto.unidad_medida',
                foreignField: '_id',
                as: 'producto.unidad_medida'
            }},
            );
            pipeline.push({ $unwind: '$producto.unidad_medida' });

            // Ordenando datos
            const ordenar: any = {};
            if(req.query.columna){
                ordenar[req.query.columna] = Number(req.query.direccion);
                pipeline.push({$sort: ordenar});
            }

            const productos = await IngresoProductoModel.aggregate(pipeline);

            respuesta.success(res, { productos });
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }
    }

    // Metodo: Nueva media res
    public async nuevaMediaRes(req: any, res: Response){
         try{

            const uid = req.uid;
            const {idIngreso, cantidad} = req.body;

            // Se traen los productos de la media res
            const productos: any[] = await MediaResModel.find();

            // Se buscan los datos del usuario logueado
            const usuarioLogin = await UsuarioModel.findById(uid, 'apellido nombre');
            const usuario_creacion = usuarioLogin.apellido + ' ' + usuarioLogin.nombre;

            // Se verifica si ya hay un corte de res cargado
            const productosIngreso = await IngresoProductoModel.find({ ingreso: idIngreso });
           
            for(let prodIngreso of productosIngreso){
                for(let producto of productos){
                    if(String(producto.id_producto) === String(prodIngreso.producto)) {
                        return respuesta.error(res, 400, 'Corte de media res repetido');
                    } 
                }
            }

            // Ingreso de productos
            productos.forEach( async producto => {
                const nuevoProducto = new IngresoProductoModel({
                    activo: true,
                    ingreso: idIngreso,
                    producto: producto.id_producto,
                    cantidad: Number((producto.cantidad * cantidad).toFixed(2)),
                    usuario_creacion
                });
                await nuevoProducto.save();
            });

            respuesta.success(res, 'Media res cargada');

        }catch(err){
             console.log(chalk.red(err));
             respuesta.error(res, 500);
         }
    }

    // Metodo: Nuevo Producto - Ingreso
    public async nuevoProducto(req: any, res: Response) {
        try{

            const uid = req.uid;
            let {codigo, ingreso, cantidad} = req.body;

            let producto: any;

            // Se busca el producto como tipo: normal
            producto = await ProductoModel.findOne({ codigo });

            if(!producto) {

                // Se busca el producto como tipo: balanza
                const codigoBalanza = codigo.slice(0, 7);
                producto = await ProductoModel.findOne({ codigo: codigoBalanza });
                codigo = codigoBalanza;

                if(!producto) return respuesta.error(res, 400, 'El producto no existe');

            }

            // Se verifica si el producto ya esta cargado en el ingreso
            const productoCargado: I_IngresoProducto = await IngresoProductoModel.findOne({ producto: producto._id, ingreso });
            if(productoCargado) return respuesta.error(res, 400, 'El producto ya esta cargado');

            // Se buscan los datos del usuario logueado
            const usuarioLogin = await UsuarioModel.findById(uid, 'apellido nombre');
            const usuario_creacion = usuarioLogin.apellido + ' ' + usuarioLogin.nombre;

            // Se crea el nuevo productoIngreso
            const data = { ingreso, producto: producto._id , cantidad, usuario_creacion };
            const ingresoProducto = new IngresoProductoModel(data);
            const response = await ingresoProducto.save();

            respuesta.success(res, { producto: response});

        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }
    }

    // Metodo: Listar Producto - Ingreso
    public async listarProductos(req: Request, res: Response) {
        try{
            const productos: I_IngresoProducto = await IngresoProductoModel.find();
            respuesta.success(res, { productos });
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }
    }

    // Metodo: Actualizar Producto - Ingreso por ID
    public async actualizarProducto(req: Request, res: Response) {
        try{
            const { id } = req.params;
            const producto = await IngresoProductoModel.findByIdAndUpdate(id, req.body, { new: true });
            respuesta.success(res, { producto});
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }
    }

    // Metodo: Eliminar Producto - Ingreso por ID
    public async eliminarProducto(req: Request, res: Response) {
        try{
            const { id } = req.params;
            await IngresoProductoModel.findByIdAndDelete(id);
            respuesta.success(res, 'Producto eliminado correctamente');
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }
    }

}

export const IngresoProductoController = new IngresoProducto();