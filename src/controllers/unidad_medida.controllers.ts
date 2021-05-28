import chalk from 'chalk';
import { Request, Response } from 'express';

import { respuesta } from '../helpers/response';
import ProductoModel, { I_Producto } from '../models/producto.model';
import UnidadModel, { I_UnidadMedida } from '../models/unidad_medida.model';

class UnidadMedida {
    
    // Metodo: Nueva unidad de medida
    public async nuevaUnidad(req: Request, res: Response) {
        try{
        
            // Verificación - Unidad con misma descripcion
            const { descripcion } = req.body;
            const unidadExiste = await UnidadModel.findOne({ descripcion: descripcion.toUpperCase() });
            if(unidadExiste) return respuesta.error(res, 400, 'La unidad ya existe');
            
            // Se crea la nueva unidad
            const unidad: I_UnidadMedida =  new UnidadModel(req.body);
            const resultado: I_UnidadMedida = await unidad.save();
            
            // Respuesta
            respuesta.success(res, { resultado });
        
        }catch(err){
        
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        
        } 
    }

    // Metodo: Unidad de medida por ID
    public async getUnidad(req: Request, res: Response) {
        try{
            
            // Verificacion: ¿La unidad existe?
            const unidad: I_UnidadMedida = await UnidadModel.findById(req.params.id);
            if(!unidad) return respuesta.error(res, 400, 'La unidad no existe');
            
            // Respuesta
            respuesta.success(res, { unidad });
        
        }catch(err){
        
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        
        }    
    }

    // Metodo: Listar unidades
    public async listarUnidades(req: Request, res: Response) {
        try{

            const { activo, descripcion } = req.query;

            // 1) - Ordenar
            let ordenar = [ req.query.columna || 'descripcion', req.query.direccion || 1 ];
    
            // 2) - Paginación
            const desde = Number(req.query.desde) || 0;
            const limit = Number(req.query.limit) || 0;
    
            // 3) - Filtrado            
            let busqueda = activo ? { activo } : {};
            let filtroOR: any = [];            
            
            // Filtrado activo
            const filtroDescripcion: any = descripcion || '';

            // Filtrado OR
            if(filtroDescripcion){
                const iDescripcion = new RegExp(filtroDescripcion, 'i'); // Expresion regular para busqueda insensible
                filtroOR.push({descripcion: iDescripcion});
            }else{
                filtroOR.push({});
            }
            
            // Respuesta
            const [ unidades, total ] = await Promise.all([
                UnidadModel.find(busqueda)
                           .or(filtroOR)
                           .sort([ordenar])
                           .skip(desde)
                           .limit(limit),
                UnidadModel.find(busqueda).countDocuments()
            ]);
    
            respuesta.success(res, { unidades, total });    
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }
    }

    // Metodo: Actualizar unidad
    public async actualizarUnidad(req: Request, res: Response) {
        try{
            const { id } = req.params;
            const { activo, descripcion } = req.body;
    
            // Se verifica si la unidad de medida existe
            let unidad: I_UnidadMedida = await UnidadModel.findById(id);
            if(!unidad) return respuesta.error(res, 400, 'La unidad no existe');
            
            // Se verifica si la nueva unidad no esta registrada
            if(descripcion && unidad.descripcion != descripcion.toUpperCase()){
                const unidadExiste: I_UnidadMedida = await UnidadModel.findOne({ descripcion: descripcion.toUpperCase() });
                if(unidadExiste) return respuesta.error(res, 400, 'La unidad ya existe');
            }
    
            // Si se va a dar de baja - No debe haber producto asociado
            if(activo == false || activo == 'false'){
                const productoAsociado: I_Producto = await ProductoModel.findOne({ unidad_medida: id, activo: true });
                if(productoAsociado) return respuesta.error(res, 400, 'Existe un producto asociado a esta unidad');
            }
            
            unidad = await UnidadModel.findByIdAndUpdate(id, req.body, { new: true });
            respuesta.success(res, { unidad })
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }        
    }

}

export const UnidadMedidaController = new UnidadMedida();
