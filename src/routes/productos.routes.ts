import Router from 'express';
import { check } from 'express-validator';
import { validaciones } from '../middlewares/validations';
import { ProductosController } from '../controllers/productos.controllers';

const router = Router();

// Producto por ID
// GET - http://localhost:3000/api/productos/:id 
router.get('/:id', validaciones.jwt, ProductosController.getProducto);

// Listar productos
// GET - http://localhost:3000/api/productos
// Parametros: columna | direccion | desde | limit | codigo | descripcion | activo
router.get('/', validaciones.jwt, ProductosController.listarProductos);

//Nuevo producto
// POST - http://localhost:3000/api/productos
router.post('/', 
            [    
                validaciones.jwt,
                check('codigo', 'Codigo es un campo obligatorio').not().isEmpty(),
                check('descripcion', 'Descripcion es un campo obligatorio').not().isEmpty(),
                check('unidad_medida', 'Unidad de medida es un campo obligatorio').not().isEmpty(),
                check('cantidad', 'Cantidad es un campo obligatorio').not().isEmpty(),
                check('stock_minimo', 'Stock minimo es un campo obligatorio').not().isEmpty(),
                check('precio', 'Precio es un campo obligatorio').not().isEmpty(),
                validaciones.campos
            ], ProductosController.nuevoProducto);

// Actualizar producto
// PUT - http://localhost:3000/api/productos/:id 
router.put('/:id', validaciones.jwt, ProductosController.actualizarProducto);


export default router;