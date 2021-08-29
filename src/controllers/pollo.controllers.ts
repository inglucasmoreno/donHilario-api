import { Request, Response } from 'express';
import chalk from 'chalk';
import { respuesta } from '../helpers/response';
import PolloModel, {I_Pollo} from '../models/pollo.model'

class Pollo {
    
    // Metodo: Obtener producto de pollo por ID
    public async getPollo(req: Request, res: Response){
        try{
            const id = req.params.id;
            const producto: I_Pollo = await PolloModel.findById(id);
            if(!producto) return respuesta.error(res, 400, 'El producto de pollo no existe');
            respuesta.success(res, { producto }); 
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);    
        }        
    }
    
    // Metodo: Listar productos de pollo
    public async listarPollo(req: Request, res: Response) {
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
                PolloModel.find(busqueda)
                            .or(filtroOR)
                            .sort([ordenar]),
                PolloModel.find(busqueda)
                            .or(filtroOR)
                            .countDocuments()
            ]);
    
            respuesta.success(res, { productos, total });
    
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }   
    }

    // Metodo: Actualizar producto de pollo
    public async actualizarPollo(req: any, res: Response) {
        try{

            const productos: any[] = req.body;
            
            productos.forEach(async producto => {
                await PolloModel.findByIdAndUpdate(producto._id, { cantidad: producto.cantidad }, {new: true});   
            });
        
            respuesta.success(res, 'Actualizacion correcta');

        }catch(err){    
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }
    }
    
}

export const PolloController = new Pollo();