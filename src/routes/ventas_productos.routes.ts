import Router from 'express';
import { check } from 'express-validator';

import { validaciones } from '../middlewares/validations';
import { VentasProductosController } from '../controllers/ventas_productos.controllers';

const router = Router();

// Venta por ID
// GET - http://localhost:3000/api/ventas_productos/:id 
router.get('/:id', validaciones.jwt, VentasProductosController.getProducto);

// Listar productos
// GET - http://localhost:3000/api/ventas_productos
// Parametros: columna | direccion
router.get('/', validaciones.jwt, VentasProductosController.listarProductos);

// Listar productos por venta
// GET - http://localhost:3000/api/ventas_productos/venta/:venta
// Parametros: columna | direccion
router.get('/venta/:venta', validaciones.jwt, VentasProductosController.listarProductosPorVenta);

// Nuevo producto
// POST - http://localhost:3000/api/ventas_productos
router.post('/', 
            [    
                validaciones.jwt,
                check('producto', 'El producto es un campo obligatorio').not().isEmpty(),
                check('precio_unitario', 'El precio unitario es un campo obligatorio').not().isEmpty(),
                check('precio_total', 'El precio total es un campo obligatorio').not().isEmpty(),
                validaciones.campos
            ], VentasProductosController.nuevoProducto);

// Actualizar producto
// PUT - http://localhost:3000/api/ventas_productos/:id 
router.put('/:id', validaciones.jwt, VentasProductosController.actualizarProducto);

// Eliminar producto
// DELETE - http://localhost:3000/api/ventas_productos/:id 
router.delete('/:id', validaciones.jwt, VentasProductosController.eliminarProducto);

export default router;
