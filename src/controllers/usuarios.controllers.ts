import {Request, Response} from 'express';
import chalk from 'chalk';
import bcryptjs from 'bcryptjs';

import { respuesta } from '../helpers/response';
import { jsonwebtoken } from '../helpers/jwt';
import UsuarioModel, { I_Usuario } from '../models/usuarios.model';

// Clase: Usuarios
class Usuarios {
    
    // Metodo: Usuario por ID
    public async getUsuario(req: Request, res: Response) { 
        try{
            const id: string = req.params.id;
            const usuario: I_Usuario = await UsuarioModel.findById(id, 'usuario nombre apellido role email activo');
            if(!usuario) return respuesta.error(res, 400, 'El usuario no existe');
            respuesta.success(res, { usuario });
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }
    }
    
    // Metodo: Listar usuarios
    public async listarUsuarios(req: Request, res: Response) { 
        try{
            
            const { columna, direccion, desde, limit, parametro, activo } = req.query;
        
            // Ordenar
            let ordenar = [columna || 'apellido', direccion || 1];
            
            // Busqueda
            let busqueda = activo ? { activo }  : {};
            
            // Filtro OR
            let filtroOR = []; 
            const filtroParametro: any = parametro || '';
            
            if(filtroParametro){
                const parametro = new RegExp(filtroParametro, 'i'); // Expresion regular para busqueda insensible
                filtroOR.push({nombre: parametro});
                filtroOR.push({apellido: parametro});
                filtroOR.push({usuario: parametro});
            }else{
                filtroOR.push({});
            }
            
            // Ejecución de consulta
            const [usuarios, total] = await Promise.all([
                UsuarioModel.find(busqueda, 'usuario apellido nombre role email activo createdAt')
                       .or(filtroOR)
                       .sort([ordenar]),
                UsuarioModel.find(busqueda)
                       .or(filtroOR)
                       .countDocuments()
            ]);
            
            respuesta.success(res, { usuarios, total });
    
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }           
    } 

    // Metodo: Nuevo usuario
    public async nuevoUsuario(req: Request, res: Response) { 
        try{
            const {usuario, password, email} = req.body;
            
            // Verificacion: Usuario repetido?
            const existeUsuario: I_Usuario = await UsuarioModel.findOne({ usuario });
            if(existeUsuario) return respuesta.error(res, 400, 'El usuario ya existe');
                
            // Verificacion: Email repetido?
            const existeEmail: I_Usuario = await UsuarioModel.findOne({ email });
            if(existeEmail) return respuesta.error(res, 400, 'Ese correo ya esta registrado');
    
            // Se crea la instancia de usuario
            const usuarioObj: I_Usuario = new UsuarioModel(req.body);
    
            // Se encript la contraseña
            const salt = bcryptjs.genSaltSync();
            usuarioObj.password = bcryptjs.hashSync(password, salt);
            
            // Se almacena en base de datos y se genera el token
            await usuarioObj.save();
            const token = await jsonwebtoken.generar(usuario.id);
    
            respuesta.success(res, {
                usuario,
                token
            });
    
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }   
    }
    
    // Metodo: Actualizar usuario
    public async actualizarUsuario(req: Request, res: Response) { 
        try{
            const { usuario, email, password } = req.body;
            const uid = req.params.id;
    
            // Verificacion: EL usuario existe?
            const usuarioDB: I_Usuario = await UsuarioModel.findById(uid);
            if(!usuarioDB) return respuesta.error(res, 400, 'El usuario no existe');
    
            // Verificacion: El Usuario esta registrado?
            if(usuario !== usuarioDB.usuario){
                const usuarioExiste: I_Usuario = await UsuarioModel.findOne({ usuario });
                if(usuarioExiste) return respuesta.error(res, 400, 'El usuario ya esta registrado');   
            } 
    
            // Verificacion: El Correo ya esta registrado?
            if(email !==  usuarioDB.email){
                const emailExiste: I_Usuario = await UsuarioModel.findOne({email});
                if(emailExiste) return respuesta.error(res, 400, 'Ese email ya esta registrado');
            }
    
            // Se encripta el password en caso de que sea necesario
            if(password){
                const salt = bcryptjs.genSaltSync();
                req.body.password = bcryptjs.hashSync(password, salt);     
            }
    
            // Se actualiza el usuario
            const usuarioRes: I_Usuario = await UsuarioModel.findByIdAndUpdate(uid, req.body, {new: true});
            respuesta.success(res, { usuario: usuarioRes });
    
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }     
    }


}

export const UsuariosController = new Usuarios();