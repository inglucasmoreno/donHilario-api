import { Request, Response } from 'express';
import chalk from 'chalk';
import { respuesta } from '../helpers/response';
import ProductoModel, { I_Producto } from '../models/producto.model';

class Producto{
    
    // Metodo: Nuevo producto
    public async nuevoProducto(req: Request, res: Response) {
        try{
        
            const { codigo } = req.body;
            
            // Se verifica si el codigo no esta repetido
            const codigoRepetido = await ProductoModel.findOne({ codigo: codigo.toUpperCase() });
            if(codigoRepetido) return respuesta.error(res, 400, 'El codigo ya esta registrado');
    
            const producto: I_Producto = new ProductoModel(req.body);
            await producto.save();
            respuesta.success(res, { producto });
       
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }            
    }
    
    // Metodo: producto por ID
    public async getProducto(req: Request, res: Response) {
        try{
            const producto: I_Producto = await ProductoModel.findById(req.params.id)
                                                            .populate('unidad_medida', 'descripcion')
            if(!producto) return respuesta.error(res, 400, 'El producto no existe');
            respuesta.success(res, { producto });
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }
    }

    // Metodo: producto por Codigo
    public async productoPorCodigo(req: Request, res: Response) {
        try{
            
            const { codigo } = req.params;
            
            let producto: I_Producto;

            // Busqueda dentro de productos normales
            producto = await ProductoModel.findOne({ codigo })
                                                            .populate('unidad_medida', 'descripcion')
            if(!producto) {
                
                // Busqueda dentro de productos de balanza
                const codigoBalanza = codigo.slice(0, 7);
                
                producto = await ProductoModel.findOne({ codigo: codigoBalanza })
                                              .populate('unidad_medida', 'descripcion')
                
                // No se encontro el producto
                if(!producto){
                    return respuesta.error(res, 400, 'El producto no existe');
                }
            
            }
            
            respuesta.success(res, { producto });
        
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }
    }

    // Metodo: Listar productos
    public async listarProductos(req: any, res: Response) {
        try{    
    
            // Pipeline para agregacion
            let pipeline = [];
                                
            // Join (Unidad de medida)     
            pipeline.push(
                { $lookup: { // Lookup - Tipos
                    from: 'unidad_medida',
                    localField: 'unidad_medida',
                    foreignField: '_id',
                    as: 'unidad_medida'
                }},
            );
            pipeline.push({ $unwind: '$unidad_medida' });
            
            // Ordenando datos
            const ordenar: any = {};
            if(req.query.columna){
                ordenar[req.query.columna] = Number(req.query.direccion); 
                pipeline.push({$sort: ordenar});
            }
            
            // Se obtienen los datos
            const [productos, total] = await Promise.all([
                ProductoModel.aggregate(pipeline),
                ProductoModel.find().countDocuments()
            ]);
    
           respuesta.success(res, { productos, total });    
    
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }        
    }

    // Metodo: Actualizar producto
    public async actualizarProducto(req: Request, res: Response) {
        try{
            const { id } = req.params;
            let producto: I_Producto = await ProductoModel.findById(id);
    
            // Se verifica si el producto a actualizar exite
            if(!producto) return respuesta.error(res, 400, 'El producto no existe');
            
            // Se verifica si el nuevo codigo ya esta registrado
            if(req.body.codigo){
                if(req.body.codigo.toUpperCase() !== producto.codigo.toUpperCase()){
                    const codigoExiste = await ProductoModel.findOne({ codigo: req.body.codigo.toUpperCase() });
                    if(codigoExiste) return respuesta.error(res, 400, 'El codigo ya esta registrado');
                }
            }
            
            producto = await ProductoModel.findByIdAndUpdate(id, req.body, { new: true });
            respuesta.success(res, { producto }) 
        }catch(err){
            console.log(chalk.red(err));
        }        
    }

}

export const ProductosController = new Producto();


