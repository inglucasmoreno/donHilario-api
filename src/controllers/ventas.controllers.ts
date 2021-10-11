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
            const venta: I_Venta = await VentaModel.findById(id).populate('mayorista');
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
            const [ventas, personalizadas] = await Promise.all([
                VentaModel.find({ activo }).sort([ordenar]),
                VentaModel.find({ activo,  forma_pago: 'Personalizada'}).sort([ordenar])
            ]);

            respuesta.success(res, { ventas, personalizadas });

        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }
    }
    
    // Metodo: Nueva venta
    public async nuevaVenta(req: any, res: Response) {
        try{

            const { uid } = req;
            const { precio_total, 
                    descuento_porcentual, 
                    forma_pago, 
                    usuario_cuenta_corriente,
                    forma_pago_personalizada,
                    total_balanza, 
                    total_anulacion_balanza,
                    total_mercaderia, 
                    total_adicional_credito,
                    venta_mayorista,
                    mayorista,
                    total_descuento
                } = req.body;
        
            // Recepcion de productos
            const productos: any[] = req.body.productos;

            // Se agregar el usuario creador a la data
            const usuarioLogin = await UsuarioModel.findById(uid, 'apellido nombre');
            const usuario_creacion = usuarioLogin.apellido + ' ' + usuarioLogin.nombre;
            req.body.usuario_creacion = usuario_creacion;

            // Se genera la data para almacenar en la DB
            const data = { 
                descuento_porcentual,
                forma_pago,
                usuario_cuenta_corriente,
                forma_pago_personalizada,
                total_balanza,
                total_anulacion_balanza,
                precio_total,
                total_mercaderia,
                total_adicional_credito,
                venta_mayorista,
                mayorista: mayorista !== '' ? mayorista : null,
                total_descuento,
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
                    promocion: elemento.promocion,
                    precio_total: elemento.precio_total,
                    tipo: elemento.tipo,
                    carne: elemento.carne,
                    usuario_creacion
                }
                
                // Se agrega el producto a la venta
                const productoTemp = new VentaProductos(data);
                await productoTemp.save();
            

                // Se impacta sobre el stock si es necesario
                if(forma_pago !== 'Anulacion balanza'){
                    const productoDB: any = await ProductoModel.findById(elemento.producto);
                    const nuevaCantidad: number = productoDB.cantidad - elemento.cantidad;  
                    await ProductoModel.findByIdAndUpdate(elemento.producto, { cantidad: nuevaCantidad });
                }
            
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