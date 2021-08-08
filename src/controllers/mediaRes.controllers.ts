import { Request, Response } from 'express';
import chalk from 'chalk';
import { respuesta } from '../helpers/response';
import MediaResModel, {I_MediaRes} from '../models/mediaRes.model'

class MediaRes {
    
    // Metodo: Obtener producto de media res por ID
    public async getMediaRes(req: Request, res: Response){
        try{
            const id = req.params.id;
            const producto: I_MediaRes = await MediaResModel.findById(id);
            if(!producto) return respuesta.error(res, 400, 'El producto de media res no existe');
            respuesta.success(res, { producto }); 
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);    
        }        
    }
    
    // Metodo: Listar productos de media res
    public async listarMediaRes(req: Request, res: Response) {
        try{
            // Ordenar
            let ordenar = [ req.query.columna || 'descripcion', req.query.direccion || 1 ];
    
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
    
            const [ productos, total ] = await Promise.all([
                MediaResModel.find(busqueda)
                            .or(filtroOR)
                            .sort([ordenar]),
                MediaResModel.find(busqueda)
                            .or(filtroOR)
                            .countDocuments()
            ]);
    
            respuesta.success(res, { productos, total });
    
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }   
    }

    // Metodo: Actualizar producto de media res
    public async actualizarMediaRes(req: Request, res: Response) {
        try{
    
            const id = req.params.id;
            
            // Se verifica si el producto a actualizar existe
            const dbMediaRes = await MediaResModel.findById(id);
            if(!dbMediaRes) return respuesta.error(res, 400, 'El producto no existe');
        
            const producto = await MediaResModel.findByIdAndUpdate(id, req.body, {new: true});
            respuesta.success(res, { producto });
        }catch(err){    
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }
    }
    
}

export const MediaResController = new MediaRes();