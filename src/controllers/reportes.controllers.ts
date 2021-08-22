import chalk from 'chalk';
import { Request, Response } from 'express';
import { respuesta } from '../helpers/response';
import DesechosModel from '../models/desechos.model';
import VentaProductosModel from '../models/venta_productos.model';
import VentaModel from '../models/venta.model';
import OtrosIngresosModel from '../models/otros_ingresos.model';
import OtrosGastosModel from '../models/otros_gastos.model';
import mongoose from 'mongoose';

class Reportes {
      
     // Reportes: Ventas
     public async ventas(req: any, res: Response) {
        try{
            
            const { fechaDesde, fechaHasta } = req.body;
    
            // Creacion de PIPELINE
            const pipeline = [];
            const pipelineOtros = [];
            
            // Filtro: Todas las ventas
            pipeline.push({ $match: { }});
            pipelineOtros.push({ $match: { }});

            // Filtro: fechas [Desde - Hasta]
            if(fechaDesde){
                pipeline.push({$match: { createdAt: { $gte: new Date(fechaDesde) } }});
                pipelineOtros.push({$match: { createdAt: { $gte: new Date(fechaDesde) } }});    
            }
    
            if(fechaHasta){
                pipeline.push({$match: { createdAt: { $lte: new Date(fechaHasta) } }});
                pipelineOtros.push({$match: { createdAt: { $lte: new Date(fechaHasta) } }});    
            }

            // Ordenando datos
            const ordenar: any = {};
            if(req.query.columna){
                ordenar[req.query.columna] = Number(req.query.direccion); 
                pipeline.push({$sort: ordenar});
            }
            
            // Ordenando Gastos e Ingresos
            pipelineOtros.push({$sort: {createdAt: -1}});

            // Se ejecuta la busqueda
            const [ventas, otrosIngresos, otrosGastos ] = await Promise.all([
                await VentaModel.aggregate(pipeline),
                await OtrosIngresosModel.aggregate(pipelineOtros),
                await OtrosGastosModel.aggregate(pipelineOtros), 
            ]);
    
            respuesta.success(res, { ventas, otrosIngresos, otrosGastos });
    
        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        }
    }

    // Reportes: Ventas - Mayoristas
    public async ventasMayoristas(req: Request, res: Response) {
        try{
            
            const { fechaDesde, fechaHasta, mayorista } = req.body;

            // Creacion de PIPELINE
            const pipeline = [];
            
            // Filtro: Ventas a mayorista
            pipeline.push({ $match: { venta_mayorista: true }});

            // Filtro: Por ID de mayorista
            if(mayorista){
                pipeline.push({$match: { mayorista: mongoose.Types.ObjectId(mayorista) }});
            }

            // Filtro: fechas [Desde - Hasta]
            if(fechaDesde){
                pipeline.push({$match: { createdAt: { $gte: new Date(fechaDesde) } }});    
            }

            if(fechaHasta){
                pipeline.push({$match: { createdAt: { $lte: new Date(fechaHasta) } }});    
            }
            
            const ventaMayorista = await VentaModel.aggregate(pipeline);
    
            respuesta.success(res, {ventaMayorista});

        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        }
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