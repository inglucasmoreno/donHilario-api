import chalk from 'chalk';
import { Request, Response } from 'express';

import { respuesta } from '../helpers/response';
import TmpIngresosGastosModel, { I_TmpIngresosGastos } from '../models/tmp_ingresos_gastos.models';

class tmpIngresosGastos {
    
    // Metodo: Nuevo elemento
    public async nuevoElemento(req: Request, res: Response) {
        try{
                
            // Se crea el nuevo elemento
            const elemento: I_TmpIngresosGastos = new TmpIngresosGastosModel(req.body);
            await elemento.save();
            
            // Respuesta
            respuesta.success(res, 'Creacion completada correctamente');
        
        }catch(err){
        
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        
        } 
    }

    // Metodo: Listar elementos
    public async listarElementos(req: Request, res: Response) {
        try{

            // Ordenar
            let ordenar = [ req.query.columna || 'descripcion', req.query.direccion || 1 ];
    
            // Respuesta
            const [ ingresos, gastos ] = await Promise.all([
                TmpIngresosGastosModel.find({ tipo: 'Ingreso' }).sort([ordenar]),
                TmpIngresosGastosModel.find({ tipo: 'Gasto' }).sort([ordenar])
            ]);

            respuesta.success(res, { ingresos, gastos });    

        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }

    }

    // Metodo eliminar elemento
    public async eliminarElemento(req: Request, res: Response) {
        try{
            const { id } = req.params;
            
            // Verificacion: Existe el elemento a eliminar?
            const elementoDB = await TmpIngresosGastosModel.findById(id);
            if(!elementoDB) return respuesta.error(res, 400, 'El elemento no existe');
            
            // Se elimina el elemento
            const elementoEliminado = await TmpIngresosGastosModel.findByIdAndRemove(id);
            respuesta.success(res, { elemento: elementoEliminado });    

        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        }
    }

    // Limpiar elementos
    public async limpiarElementos(req: Request, res: Response) {
        try{
            await TmpIngresosGastosModel.deleteMany({});
            respuesta.success(res, 'Elementos eliminados correctamente');
        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        }
    }

}

export const TmpIngresosGastosController = new tmpIngresosGastos();
