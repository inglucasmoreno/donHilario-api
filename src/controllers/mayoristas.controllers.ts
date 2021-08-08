import { Request, Response } from 'express';
import chalk from 'chalk';
import { respuesta } from '../helpers/response';
import MayoristasModel, { I_Mayorista } from '../models/mayorista.model';

class Mayoristas {

    // Metodo: Obtener mayorista por ID
    public async getMayorista(req: Request, res: Response){
        try{
            const id = req.params.id;
            const mayorista: I_Mayorista = await MayoristasModel.findById(id);
            if(!mayorista) return respuesta.error(res, 400, 'El mayorista no existe');
            respuesta.success(res, { mayorista }); 
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);    
        }        
    }

    // Metodo: Listar mayoristas
    public async listarMayoristas(req: Request, res: Response) {
        try{
            // Ordenar
            let ordenar = [ req.query.columna || 'razon_social', req.query.direccion || 1 ];
    
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
                filtroOR.push({razon_social: descripcion});
                filtroOR.push({cuit: descripcion});
            }else{
                filtroOR.push({});
            }
    
            const [ mayoristas, total ] = await Promise.all([
                MayoristasModel.find(busqueda)
                            .or(filtroOR)
                            .sort([ordenar]),
                MayoristasModel.find(busqueda)
                            .or(filtroOR)
                            .countDocuments()
            ]);
    
            respuesta.success(res, { mayoristas, total });
    
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }   
    }

     // Metodo: Nuevo mayorista
     public async nuevoMayorista(req: Request, res: Response) {
        try{
            
            const { cuit } = req.body;

            // Se verifica si el CUIT ya esta registrado
            const cuitExiste = await MayoristasModel.findOne({ cuit });
            if(cuitExiste) return respuesta.error(res, 400, 'El CUIT ya esta registrado');
    
            // Se crea el nuevo mayorista
            const mayorista: I_Mayorista = new MayoristasModel(req.body);
            const resultado: I_Mayorista = await mayorista.save();
            respuesta.success(res, {mayorista: resultado});
    
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }
    }

    // Metodo: Actualizar mayorista
    public async actualizarMayorista(req: Request, res: Response) {
        try{

            const id = req.params.id;
            const { cuit, activo } = req.body;
            
            // Se verifica si el mayorista a actualizar existe
            const dbMayorista = await MayoristasModel.findById(id);
            if(!dbMayorista) return respuesta.error(res, 400, 'El mayorista no existe');
    
            // Se verifica que el nuevo CUIT no este registrado - En caso de ser necesario
            if(cuit){
                if(cuit !== dbMayorista.cuit){
                    const cuitExiste = await MayoristasModel.findOne({ cuit });
                    if(cuitExiste) return respuesta.error(res, 400, 'El CUIT ya esta registrado');        
                }    
            }
    
            const mayorista = await MayoristasModel.findByIdAndUpdate(id, req.body, {new: true});
            respuesta.success(res, { mayorista });
        }catch(err){    
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }
    }
    

}

export const MayoristasController = new Mayoristas();


