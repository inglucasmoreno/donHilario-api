import { Request, response, Response } from 'express';

import chalk from 'chalk';
import { respuesta } from '../helpers/response';

import ProductoModel from '../models/producto.model';
import UsuarioModel from '../models/usuarios.model'; 
import IngresoProductoModel, { I_IngresoProducto } from '../models/ingreso_productos.model';
import ingreso_productosModel from '../models/ingreso_productos.model';

class IngresoProducto {
    
    // Metodo: Producto - Ingreso por ID
    public async getProducto(req: Request, res: Response) {
        try{
            
            const { id } = req.params;
            const ingresoProducto = await IngresoProductoModel.findById(id)
                                                              .populate('ingreso')
                                                              .populate('producto')
            respuesta.success(res, { producto: ingresoProducto })
        
        }catch(err){
        
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        
        }    
    }

    // Metodo: Nuevo Producto - Ingreso
    public async nuevoProducto(req: any, res: Response) {
        try{
            
            const uid = req.uid;
            const {codigo, ingreso, cantidad} = req.body;
            
            // Se obtiene el producto
            const producto: any = await ProductoModel.findOne({ codigo });
            if(!producto) return respuesta.error(res, 400, 'El producto no existe');

            // Se verifica si el producto ya esta cargado en el ingreso
            const productoCargado: I_IngresoProducto = await IngresoProductoModel.findOne({ codigo, ingreso });
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
            // Ordenar
            let ordenar = [ req.query.columna || 'createdAt', req.query.direccion || 1 ];
            
            // Se obtienen los productos
            const productos: I_IngresoProducto[] = await IngresoProductoModel.find()
                                                                             .populate('ingreso')
                                                                             .populate('producto')
                                                                             .sort([ordenar])
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