import { Request, Response } from 'express';
import chalk from 'chalk';
import { respuesta } from '../helpers/response';
import ProveedorModel, { I_Proveedor } from '../models/proveedor.model';

class Proveedores {

    // Metodo: Obtener proveedor por ID
    public async getProveedor(req: Request, res: Response){
        try{
            const id = req.params.id;
            const proveedor: I_Proveedor = await ProveedorModel.findById(id);
            if(!proveedor) return respuesta.error(res, 400, 'El proveedor no existe');
            respuesta.success(res, { proveedor }); 
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);    
        }        
    }

    // Metodo: Listar proveedores
    public async listarProveedores(req: Request, res: Response) {
        try{
            // Ordenar
            let ordenar = [ req.query.columna || 'razon_social', req.query.direccion || 1 ];
    
            // Paginación
            const desde = Number(req.query.desde) || 0;
            const limit = Number(req.query.limit) || 0;
    
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
    
            const [ proveedores, total ] = await Promise.all([
                ProveedorModel.find(busqueda)
                            .or(filtroOR)
                            .sort([ordenar])
                            .skip(desde)
                            .limit(limit),
                ProveedorModel.find(busqueda)
                            .or(filtroOR)
                            .countDocuments()
            ]);
    
            respuesta.success(res, { proveedores, total });
    
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }   
    }

    // Metodo: Nuevo proveedor
    public async nuevoProveedor(req: Request, res: Response) {
        try{
            
            const { cuit } = req.body;
    
            // Se verifica si el CUIT ya esta registrado
            const cuitExiste = await ProveedorModel.findOne({ cuit });
            if(cuitExiste) return respuesta.error(res, 400, 'El CUIT ya esta registrado');
    
            // Se crea el nuevo proveedor
            const proveedor: I_Proveedor = new ProveedorModel(req.body);
            const resultado: I_Proveedor = await proveedor.save();
            respuesta.success(res, {proveedor: resultado});
    
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }
    }

    // Metodo: Actualizar proveedor
    public async actualizarProveedor(req: Request, res: Response) {
        try{

            const id = req.params.id;
            const { cuit } = req.body;
            
            // Se verifica si el proveedor a actualizar existe
            const dbProveedor = await ProveedorModel.findById(id);
            if(!dbProveedor) return respuesta.error(res, 400, 'El proveedor no existe');
    
            // Se verifica que el nuevo CUIT no este registrado - En caso de ser necesario
            if(cuit){
                if(cuit !== dbProveedor.cuit){
                    const cuitExiste = await ProveedorModel.findOne({ cuit });
                    if(cuitExiste) return respuesta.error(res, 400, 'El CUIT ya esta registrado');        
                }    
            }
    
            const proveedor = await ProveedorModel.findByIdAndUpdate(id, req.body, {new: true});
            respuesta.success(res, { proveedor });
        }catch(err){    
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }
    }

}

export const ProveedoresController = new Proveedores();