import chalk from 'chalk';
import { Request, Response } from 'express';
import { respuesta } from '../helpers/response';
import DesechosModel from '../models/desechos.model';
import VentaProductosModel from '../models/venta_productos.model';

class Reportes {
      
    // Reportes: Ventas
    public async listartVentas(req: Request, res: Response) {
        respuesta.success(res, 'Lista de ventas');
    }

    // Cantidades vs Desechos
    public async cantidadesDesechos(req: Request, res: Response) {
        try{
            const {fechaDesde, fechaHasta} = req.body;

            // Consulta a base de datos
            const desechos: any[] = await DesechosModel.find({createdAt: { $gte: new Date(fechaDesde), $lte: new Date(fechaHasta) }});
            const productos: any[] = await VentaProductosModel.find({$and: [{createdAt: { $gte: new Date(fechaDesde), $lte: new Date(fechaHasta)}}, {tipo:'Balanza'}]});

            let desechosTotal = 0;
            let cantidadTotal = 0;
            
            // Se calculan los totales
            desechos.forEach(desecho => desechosTotal += desecho.cantidad );
            productos.forEach(producto => cantidadTotal += producto.cantidad );

            respuesta.success(res, { desechosTotal, cantidadTotal });
        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        }
    }

}

export const ReportesController = new Reportes();