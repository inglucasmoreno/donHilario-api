import chalk from 'chalk';
import { Request, Response } from 'express';

import { respuesta } from '../helpers/response';
import VentaModel, { I_Venta } from '../models/venta.model';
import UsuarioModel from '../models/usuarios.model';

class Ventas {

    // Metodo: Obtener venta por ID
    public async getVenta(req: Request, res: Response) {
        try{
            const id = req.params.id;
            console.log(id);
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

            const { columna, direccion } = req.query;
            
            // Ordenar
            let ordenar = [columna || 'createdAt', direccion || -1];    
            
            // Se listan las ventas
            const ventas: I_Venta = await VentaModel.find().sort([ordenar]);
            
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
            const { precio_total } = req.body;

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
                usuario_creacion
            };

            // Se agregan los productos a la venta y se impacta sobre el stock
            // -----------------------------------
            
            // Se crea la venta
            const ventaObj: I_Venta = new VentaModel(data);
            const venta: I_Venta = await ventaObj.save();
                    
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