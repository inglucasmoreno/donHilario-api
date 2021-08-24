import chalk from 'chalk';
import { Request, Response } from 'express';
import { respuesta } from '../helpers/response';
import DesechosModel from '../models/desechos.model';
import VentaProductosModel from '../models/venta_productos.model';
import VentaModel from '../models/venta.model';
import OtrosIngresosModel from '../models/otros_ingresos.model';
import OtrosGastosModel from '../models/otros_gastos.model';
import VentaProductoModel from '../models/venta_productos.model';
import IngresoProductoModel from '../models/ingreso_productos.model';
import mongoose from 'mongoose';

class Reportes {
      
     // Reportes: Ventas
     public async ventas(req: any, res: Response) {
        try{
            
            const { fechaDesde, fechaHasta, tipo_venta, mayoristaSeleccionado } = req.body;
            
            // Creacion de PIPELINE
            const pipeline = [];
            const pipelineOtros = [];
            
            // Filtro: Todas las ventas
            pipeline.push({ $match: { }});
            pipelineOtros.push({ $match: { }});

            // Filtro: Mayoristas - Todos los mayoristas
            if(tipo_venta === 'sin_mayoristas'){
                pipeline.push({ $match: { venta_mayorista: false }});
            }

            // Filtro: Mayoristas - Todos los mayoristas
            if(tipo_venta === 'con_mayoristas' && mayoristaSeleccionado === ''){
                pipeline.push({ $match: { venta_mayorista: true }});
            }

            // Filtro: Mayoristas
            if(tipo_venta === 'con_mayoristas' && mayoristaSeleccionado !== ''){
                pipeline.push({ $match: { venta_mayorista: true }});
                pipeline.push({ $match: { mayorista: mongoose.Types.ObjectId(mayoristaSeleccionado) }});
            }

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
    
    // Productos
    public async productos(req: any, res: Response) {
        try{
               
            const { fechaDesde, fechaHasta, productoSeleccionado, tipo_filtro, proveedorSeleccionado, tipo_egreso, mayoristaSeleccionado } = req.body;

            const pipeline = [];

            // Filtro: Todas los productos vendidos
            pipeline.push({ $match: { }});

            // Filtro: fechas [Desde - Hasta]
            if(fechaDesde) pipeline.push({$match: { createdAt: { $gte: new Date(fechaDesde) } }});
            if(fechaHasta) pipeline.push({$match: { createdAt: { $lte: new Date(fechaHasta) } }});
            
            // Filtro: Producto
            if(productoSeleccionado) pipeline.push({$match: { producto: mongoose.Types.ObjectId(productoSeleccionado) }});

            // Filtro: Proveedor
            if(tipo_filtro === 'Ingresos' && proveedorSeleccionado !== ''){
                pipeline.push({$match: { proveedor: mongoose.Types.ObjectId(proveedorSeleccionado) }});               
            }

            // Join con productos
            pipeline.push({
                $lookup: {
                    from: 'productos',
                    localField: 'producto',
                    foreignField: '_id',
                    as: 'producto'
                }
            });
            pipeline.push({$unwind: '$producto'});   

            // Join con productos - unidad de medidad
            pipeline.push({
                $lookup: {
                    from: 'unidad_medida',
                    localField: 'producto.unidad_medida',
                    foreignField: '_id',
                    as: 'producto.unidad_medida'
                }
            });
            pipeline.push({$unwind: '$producto.unidad_medida'});  

            // Join con ventas
            if(tipo_filtro === 'Egresos'){
                pipeline.push({
                    $lookup: {
                        from: 'ventas',
                        localField: 'venta',
                        foreignField: '_id',
                        as: 'venta'
                    }
                });
                pipeline.push({$unwind: '$venta'});   
            }

            // Filtro: Mayoristas

            // Egresos sin mayoristas
            if(tipo_filtro === 'Egresos' && tipo_egreso === 'sin_mayoristas'){
                pipeline.push({$match: { 'venta.venta_mayorista': false }});    
            }

            // Egreso solo de mayoristas
            if(tipo_filtro === 'Egresos' && tipo_egreso === 'solo_mayoristas' && mayoristaSeleccionado === ''){
                pipeline.push({$match: { 'venta.venta_mayorista': true }});
            }

            // Egreso de un mayorista en particular
            if(tipo_filtro === 'Egresos' && tipo_egreso === 'solo_mayoristas' && mayoristaSeleccionado !== ''){
                pipeline.push({$match: { 'venta.mayorista': mongoose.Types.ObjectId(mayoristaSeleccionado)}});
            }
    
            // Ordenando datos
            const ordenar: any = {};
            if(req.query.columna){
                ordenar[req.query.columna] = Number(req.query.direccion); 
                pipeline.push({$sort: ordenar});
            }
            
            let productos: any[] = [];

            if(tipo_filtro === 'Ingresos'){
                productos =  await IngresoProductoModel.aggregate(pipeline);
            }else{
                productos =  await VentaProductoModel.aggregate(pipeline);
            }

            // Se obtienen los datos
    
            respuesta.success(res, { productos });  
                
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