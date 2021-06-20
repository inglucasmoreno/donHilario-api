import Router from 'express';
import { check } from 'express-validator';
import { validaciones } from '../middlewares/validations';
import { IngresoProductoController } from '../controllers/ingreso_productos.controllers';

const router = Router();

// Producto - Ingreso por ID
// GET - http://localhost:3000/api/ingreso_producto/:id 
router.get('/:id', validaciones.jwt, IngresoProductoController.getProducto);

// Listar Productos - Ingreso
// GET - http://localhost:3000/api/ingreso_producto
// Parametros: columna | direccion
router.get('/', validaciones.jwt, IngresoProductoController.listarProductos);

// Nuevo Producto - Ingreso
// POST - http://localhost:3000/api/ingreso_producto
router.post('/', 
            [    
                validaciones.jwt,
                check('codigo', 'El codigo es un campo obligatorio').not().isEmpty(),
                check('ingreso', 'El ingreso es un campo obligatorio').not().isEmpty(),
                check('cantidad', 'La cantidad es un campo obligatorio').not().isEmpty(),
                validaciones.campos
            ], IngresoProductoController.nuevoProducto);

// Actualizar Producto - Ingreso
// PUT - http://localhost:3000/api/ingresos_producto/:id
router.put('/:id', validaciones.jwt, IngresoProductoController.actualizarProducto);

// Eliminar Producto - Ingreso
// DELETE - http://localhost:3000/api/ingresos_producto/:id
router.delete('/:id', validaciones.jwt, IngresoProductoController.eliminarProducto);


export default router;