import { Request, Response } from 'express';
import chalk from 'chalk';
import { respuesta } from '../helpers/response';
import CuentaCorrienteModel, { I_CuentaCorriente} from '../models/cuenta_corriente';
import mongoose from 'mongoose';

class CuentaCorriente {

    // Metodo: Obtener elemento de cuenta corriente por ID
    public async getCuentaCorriente(req: Request, res: Response){
        try{
            const id = req.params.id;
            const cuentaCorriente: I_CuentaCorriente = await CuentaCorrienteModel.findById(id);
            if(!cuentaCorriente) return respuesta.error(res, 400, 'El elemento de cuenta corriente no existe');
            respuesta.success(res, { cuenta_corriente: cuentaCorriente }); 
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);    
        }        
    }

    // Metodo: Listar elementos de cuenta corriente x Usuario
    public async listarCuentasCorrientes(req: any, res: Response) {
        try{

            // Se recibe ID de usuario
            const usuario = req.params.usuario;
            
            // Activo/Inactivo
            const fActivo = req.query.activo || '';
            let activo = true;

            const pipeline: any = [];

            pipeline.push({ $match: { usuario: mongoose.Types.ObjectId(usuario) } });

            if(fActivo !== '' && fActivo){
                pipeline.push({ $match: { activo: fActivo === 'true' ? true : false } });
            } 
                
            // Ordenando datos
            const ordenar: any = {};
            if(req.query.columna){
                ordenar[req.query.columna] = Number(req.query.direccion);
                pipeline.push({$sort: ordenar});
            }

            const cuentas_corrientes = await CuentaCorrienteModel.aggregate(pipeline);
            
            respuesta.success(res, { cuentas_corrientes });
    
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }   
    }

    // Metodo: Nuevo elemento de cuenta corriente
    public async nuevaCuentaCorriente(req: Request, res: Response) {
        try{
                
            // Se crea la nueva cuenta corriente
            const cuenta_corriente: I_CuentaCorriente = new CuentaCorrienteModel(req.body);
            const resultado: I_CuentaCorriente = await cuenta_corriente.save();
            respuesta.success(res, {cuenta_corriente: resultado});
    
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }
    }

    // Metodo: Actualizar elemento de cuenta corriente
    public async actualizarCuentaCorriente(req: Request, res: Response) {
        try{

            const id = req.params.id;
            
            // Se verifica si el elemento de cuenta corriente a actualizar existe
            const dbCuentaCorriente = await CuentaCorrienteModel.findById(id);
            if(!dbCuentaCorriente) return respuesta.error(res, 400, 'El elemento de cuenta corriente no existe');
    
            // Actualizar elemento de cuenta corriente
            const cuenta_corriente = await CuentaCorrienteModel.findByIdAndUpdate(id, req.body, { new: true });
            respuesta.success(res, { cuenta_corriente });

        }catch(err){    
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }
    }

    // Metodo: Completar todos los elementos de cuenta corriente x Usuario
    public async completarCuentasCorrientes(req: Request, res: Response) {
        try{
        
            const usuario = req.params.usuario;
            
            // Actualizar todos los elementos
            await CuentaCorrienteModel.updateMany({ usuario },{ activo: false });
            respuesta.success(res, 'Actualizacion correcta');
        
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }
    }

}

export const CuentaCorrienteController = new CuentaCorriente();