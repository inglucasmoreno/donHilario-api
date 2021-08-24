import Router from 'express';
import { check } from 'express-validator';
import { validaciones } from '../middlewares/validations';
import { IngresoProductoController } from '../controllers/ingreso_productos.controllers';

const router = Router();

// Productos por ID (id de producto)
// GET - http://localhost:3000/api/ingreso_producto/:id
router.get('/:id', validaciones.jwt, IngresoProductoController.getProducto);

// Productos por ingreso 
// GET - http://localhost:3000/api/ingreso_producto/ingreso/:ingreso 
router.get('/ingreso/:ingreso', validaciones.jwt, IngresoProductoController.productosPorIngreso);

// Listar productos
// GET - http://localhost:3000/api/ingreso_producto
// Parametros: columna | direccion
router.get('/', validaciones.jwt, IngresoProductoController.listarProductos);

// Nuevo producto
// POST - http://localhost:3000/api/ingreso_producto
router.post('/', 
            [    
                validaciones.jwt,
                check('codigo', 'El codigo es un campo obligatorio').not().isEmpty(),
                check('ingreso', 'El ingreso es un campo obligatorio').not().isEmpty(),
                check('proveedor', 'El proveedor es un campo obligatorio').not().isEmpty(),
                check('cantidad', 'La cantidad es un campo obligatorio').not().isEmpty(),
                validaciones.campos
            ], IngresoProductoController.nuevoProducto);

// Nueva media res
// POST - http://localhost:3000/api/ingreso_producto/mediaRes
router.post('/mediaRes', 
            [    
                validaciones.jwt,
                check('idIngreso', 'El ID del ingreso es un campo obligatorio').not().isEmpty(),
                check('cantidad', 'La cantidad es un campo obligatorio').not().isEmpty(),
                validaciones.campos
            ], IngresoProductoController.nuevaMediaRes);

// Actualizar producto
// PUT - http://localhost:3000/api/ingresos_producto/:id
router.put('/:id', validaciones.jwt, IngresoProductoController.actualizarProducto);

// Eliminar producto
// DELETE - http://localhost:3000/api/ingresos_producto/:id
router.delete('/:id', validaciones.jwt, IngresoProductoController.eliminarProducto);


export default router;