import { Request, Response } from 'express';
import chalk from 'chalk';
import { respuesta } from '../helpers/response';
import DesechoModel, { I_Desecho } from '../models/desechos.model';

class Desecho {

    // Metodo: Obtener desecho por ID
    public async getDesecho(req: Request, res: Response){
        try{
            const id = req.params.id;
            const desecho: I_Desecho = await DesechoModel.findById(id);
            if(!desecho) return respuesta.error(res, 400, 'El desecho no existe');
            respuesta.success(res, { desecho }); 
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);    
        }        
    }

    // Metodo: Completar desechos
    public async completarDesechos(req: Request, res: Response) {
        try{
            await DesechoModel.updateMany({activo: true}, {activo: false});
            respuesta.success(res, 'Cierre completado correctamente');
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }
    }

    // Metodo: Listar desechos
    public async listarDesechos(req: Request, res: Response) {
        try{
            // Ordenar
            let ordenar = [ req.query.columna || 'createdAt', req.query.direccion || 1 ];
    
            // Filtrado
            const busqueda: any = {};
            let filtroOR = [];
            const fDescripcion: any = req.query.descripcion || '';
            const fActivo = req.query.activo || '';
            
            // Filtro activo
            if(fActivo) busqueda.activo = fActivo;
            
            // Filtro OR
            if(fDescripcion){
                const descripcion = new RegExp(fDescripcion, 'i'); // Expresion regular para busqueda insensible
                filtroOR.push({descripcion: descripcion});
            }else{
                filtroOR.push({});
            }
    
            const [ desechos, total ] = await Promise.all([
                DesechoModel.find(busqueda)
                            .or(filtroOR)
                            .sort([ordenar]),
                DesechoModel.find(busqueda)
                            .or(filtroOR)
                            .countDocuments()
            ]);
    
            respuesta.success(res, { desechos, total });
    
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }   
    }

     // Metodo: Nuevo desecho
     public async nuevoDesecho(req: Request, res: Response) {
        try{

            // Se crea el nuevo desecho
            const desecho: I_Desecho = new DesechoModel(req.body);
            const resultado: I_Desecho = await desecho.save();
            respuesta.success(res, {desecho: resultado});
    
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }
    }

    // Metodo: Actualizar desecho
    public async actualizarDesecho(req: Request, res: Response) {
        try{

            const id = req.params.id;
            
            // Se verifica si el desecho a actualizar existe
            const dbDesecho = await DesechoModel.findById(id);
            if(!dbDesecho) return respuesta.error(res, 400, 'El desecho no existe');
    
            const desecho = await DesechoModel.findByIdAndUpdate(id, req.body, {new: true});
            respuesta.success(res, { desecho });
        
        }catch(err){    
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }
    }

    // Metodo: Eliminar desecho
    public async eliminarDesecho(req: Request, res: Response) {
        try{
            const { id } = req.params;
            await DesechoModel.findByIdAndDelete(id);
            respuesta.success(res, 'Producto eliminado correctamente');
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }
    }
    

}

export const DesechoController = new Desecho();


