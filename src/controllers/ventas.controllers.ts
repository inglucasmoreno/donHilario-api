import chalk from 'chalk';
import { Request, Response } from 'express';

import { respuesta } from '../helpers/response';
import VentaProductos from '../models/venta_productos.model';
import ProductoModel from '../models/producto.model';
import VentaModel, { I_Venta } from '../models/venta.model';
import UsuarioModel from '../models/usuarios.model';


class Ventas {

    // Metodo: Obtener venta por ID
    public async getVenta(req: Request, res: Response) {
        try{
            const id = req.params.id;
            const venta: I_Venta = await VentaModel.findById(id);
            respuesta.success(res, { venta });
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }
    }

    // Metodo: Listar ventas
    public async listarVentas(req: Request, res: Response){
        try{

            const { columna, direccion, activo = true } = req.query;

            // Ordenar
            let ordenar = [columna || 'createdAt', direccion || -1];    
            
            // Se listan las ventas
            const ventas: I_Venta = await VentaModel.find({ activo }).sort([ordenar]);
            
            respuesta.success(res, { ventas });

        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }
    }
    
    // Metodo: Nueva venta
    public async nuevaVenta(req: any, res: Response) {
        try{

            const { uid } = req;
            const { precio_total, descuento_porcentual, forma_pago, total_balanza, total_mercaderia } = req.body;

            // Recepcion de productos
            const productos: any[] = req.body.productos;

            // Se genera codigo de ingreso
            const ultimaVenta: any = await VentaModel.find().sort({ createdAt: -1 });
            var codigo = ultimaVenta.length != 0 ? ultimaVenta[0].codigo + 1 : 0;

            // Se agregar el usuario creador a la data
            const usuarioLogin = await UsuarioModel.findById(uid, 'apellido nombre');
            const usuario_creacion = usuarioLogin.apellido + ' ' + usuarioLogin.nombre;
            req.body.usuario_creacion = usuario_creacion;

            // Se genera la data para almacenar en la DB
            const data = { 
                codigo,
                precio_total,
                total_balanza,
                total_mercaderia,
                forma_pago,
                descuento_porcentual,
                usuario_creacion
            };
            
            // Se crea la venta
            const ventaObj: I_Venta = new VentaModel(data);
            const venta: I_Venta = await ventaObj.save();
                    
            // Se agregan los productos a la venta y se impacta sobre el stock
            productos.forEach( async (elemento: any) => {
                const data = {
                    venta: venta._id,
                    cantidad: elemento.cantidad,
                    producto: elemento.producto,
                    precio_unitario: elemento.precio_unitario,
                    precio_total: elemento.precio_total,
                    usuario_creacion
                }
                
                // Se agrega el producto a la venta
                const productoTemp = new VentaProductos(data);
                await productoTemp.save();
            

                // Se impacta sobre el stock
                const productoDB: any = await ProductoModel.findById(elemento.producto);
                const nuevaCantidad: number = productoDB.cantidad - elemento.cantidad;  
                await ProductoModel.findByIdAndUpdate(elemento.producto, { cantidad: nuevaCantidad });
            
            });

            respuesta.success(res, { venta });
            
        }catch(err){     
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }
    }

    // Metodo: Actualizar venta
    public async actualizarVenta(req: Request, res: Response){
        try{
            const id = req.params.id;
        
            // Se verifica si el producto a actualizar existe
            const ventaExiste: I_Venta = await VentaModel.findById(id);
            if(!ventaExiste) return respuesta.error(res, 400, 'La venta no existe');
            
            // Se actualiza la venta
            const venta: I_Venta = await VentaModel.findByIdAndUpdate(id, req.body, { new: true });
            respuesta.success(res, { venta });
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500)
        }
    }

}

export const VentasController = new Ventas();