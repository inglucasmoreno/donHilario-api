import { Request, Response } from 'express';
import chalk from 'chalk';

import { respuesta } from '../helpers/response';
import OtrosIngresosModel, { I_OtrosIngresos } from '../models/otros_ingresos.model';

class OtrosIngresos {

    // Metodo: Nuevo ingreso
    public async nuevoIngreso(req: Request, res: Response) {
        try{
            const ingresoTmp = new OtrosIngresosModel(req.body);
            const ingreso = await ingresoTmp.save();
            respuesta.success(res, { ingreso });
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }    
    }

    // Metodo: Listar ingresos
    public async listarIngresosPorCaja(req: Request, res: Response) {
        try{
            const { caja } = req.params;
            const ingresos = await OtrosIngresosModel.find({ caja });
            respuesta.success(res, { ingresos });
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }      
    }

    // Metodo: Eliminar ingreso
    public async eliminarIngreso(req: Request, res: Response) {
        try{
            const { id } = req.params;
            const ingreso = await OtrosIngresosModel.findByIdAndRemove(id);
            respuesta.success(res, { ingreso }); 
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }       
    }

}

export const OtrosIngresosController = new OtrosIngresos();