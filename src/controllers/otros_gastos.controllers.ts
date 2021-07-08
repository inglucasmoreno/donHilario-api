import { Request, Response } from 'express';
import chalk from 'chalk';

import { respuesta } from '../helpers/response';
import OtrosGastosModel, { I_OtrosGastos } from '../models/otros_gastos.model';

class OtrosGastos {

    // Metodo: Nuevo gasto
    public async nuevoGasto(req: Request, res: Response) {
        try{
            const gastoTmp = new OtrosGastosModel(req.body);
            const gasto = await gastoTmp.save();
            respuesta.success(res, { gasto });
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }    
    }

    // Metodo: Listar gastos
    public async listarGastosPorCaja(req: Request, res: Response) {
        try{
            const { caja } = req.params;
            const gastos = await OtrosGastosModel.find({ caja });
            respuesta.success(res, { gastos });
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }      
    }

    // Metodo: Eliminar gasto
    public async eliminarGasto(req: Request, res: Response) {
        try{
            const { id } = req.params;
            const gasto = await OtrosGastosModel.findByIdAndRemove(id);
            respuesta.success(res, { gasto }); 
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }       
    }

}

export const OtrosGastosController = new OtrosGastos();