import { Request, Response } from 'express';

import chalk from 'chalk';
import { respuesta } from '../helpers/response';

import UsuarioModel from '../models/usuarios.model'; 
import IngresoModel, { I_Ingreso } from '../models/ingreso.model';


class Ingreso {

    // Metodo: Ingreso por ID
    public async getIngreso(req: Request, res: Response) {
        try{
            const { id } = req.params;
            const ingreso = await IngresoModel.findById(id)
                                              .populate('proveedor')
                                        
            if(!ingreso) return respuesta.error(res, 400, 'El ingreso no existe');
            respuesta.success(res, { ingreso });    
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        } 
    }

    // Metodo: Listar ingreso
    public async listarIngresos(req: Request, res: Response) { 
        try{

            // Filtrado
            let pipeline = [];
            let pipelineTotal = [];

            const { activo, columna, direccion, limit, desde, codigo } = req.query;

            // Etapa 1 - Filtrado por codigo
            if(codigo){
                pipeline.push({$match: { codigo: Number(codigo) }});
                pipelineTotal.push({$match: { codigo: Number(codigo) }});
            }
            
            // Etapa 2 - Filtrado por Activo/Inactivo
            if(activo == 'true'){
                pipeline.push({$match: { activo: true }});
                pipelineTotal.push({$match: { activo: true }});
            }else if(activo == 'false'){
                pipeline.push({$match: { activo: false }});
                pipelineTotal.push({$match: { activo: false }});
            }

            // Etapa 3 - Join (Proveedor)
            pipeline.push(
                { $lookup: { // Lookup - Tipos
                    from: 'proveedores',
                    localField: 'proveedor',
                    foreignField: '_id',
                    as: 'proveedor'
                }},
            );
            
            pipelineTotal.push(
                { $lookup: { // Lookup - Tipos
                    from: 'proveedores',
                    localField: 'proveedor',
                    foreignField: '_id',
                    as: 'proveedor'
                }},
            );
    
            pipeline.push({ $unwind: '$proveedor' });
            pipelineTotal.push({ $unwind: '$proveedor' });        
    
            // Etapa 4 - Filtrado por descripcion - Filtro OR
            // - Razon social de proveedor | CUIT de proveedor
            if(req.query.descripcion){
                const descripcion: any = new RegExp(String(req.query.descripcion), 'i'); // Expresion regular para busqueda insensible
                pipeline.push({$match: { $or: [{ 'codigo' : Number(descripcion) }, { 'proveedor.razon_social' : descripcion }, {'proveedor.cuit': descripcion}] }});
                pipelineTotal.push({$match: { $or: [{ 'codigo' : Number(descripcion) }, {'proveedor.cuit': descripcion}] }});
            }
    
            // Etapa 5 - Ordenando datos
            const ordenar: any = {};
            if(req.query.columna){
                ordenar[String(columna)] = Number(direccion); 
                pipeline.push({$sort: ordenar});
            } 
    
            // Etapa 6 -  Paginación
            const desdePag = desde ? Number(desde) : 0;
            const limitPag = limit ? Number(limit) : 0;       
            if(limitPag != 0) pipeline.push({$limit: limitPag});
            pipeline.push({$skip: desdePag});
    
            const [ingresos, ingresosTotal] = await Promise.all([
                IngresoModel.aggregate(pipeline),
                IngresoModel.aggregate(pipelineTotal)
            ]);
    
            const total = ingresosTotal.length;
            respuesta.success(res, { ingresos, total});
    
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }   
    }

    // Metodo: Nuevo ingreso
    public async nuevoIngreso(req: any, res: Response) {
        try{
            const { proveedor } = req.body;
            const { uid } = req;   // ID de usuario logueado 

            // Se buscan los datos del usuario logueado
            const usuarioLogin = await UsuarioModel.findById(uid, 'apellido nombre');
            const usuario_creacion = usuarioLogin.apellido + ' ' + usuarioLogin.nombre;
            
            // Se genera codigo de ingreso
            const ingresos: any= await IngresoModel.find().sort({ createdAt: -1 });
            var codigo = ingresos.length != 0 ? ingresos[0].codigo + 1 : 0;
        
            // Se genera la data para almacenar en la DB
            const data = { 
                codigo,
                proveedor, 
                usuario_creacion, 
                usuario_cierre: 'Todavia activo'
            };

            // Se crea el remito de ingreso
            const ingreso: I_Ingreso = new IngresoModel(data);
            const resultado = await ingreso.save();
            respuesta.success(res, { ingreso: resultado });
            
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }
    }

    // Metodo: Actualizar ingreso
    public async actualizarIngreso(req: any, res: Response) {
        try{
        
            const { uid } = req;
            const { id } = req.params;
            const { activo } = req.body;
                
            // Verificacion: El ingreso existe?
            const ingresoBD: I_Ingreso = await IngresoModel.findById(id);
            if(!ingresoBD) return respuesta.error(res, 400, 'El ingreso no existe');
            
            // Actualizacion de usuario_cierre - Al cerrar el ingreso
            if(activo === false){
                const usuarioLogin = await UsuarioModel.findById(uid, 'apellido nombre');
                const usuario_cierre = usuarioLogin.apellido + ' ' + usuarioLogin.nombre;
                req.body.usuario_cierre = usuario_cierre; 
            }

            // Se actualiza el ingreso    
            const ingreso = await IngresoModel.findByIdAndUpdate(id, req.body, { new: true });
            respuesta.success(res, { ingreso });
    
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }
    }
}

export const IngresoController = new Ingreso();