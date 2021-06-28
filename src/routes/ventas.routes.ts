import Router from 'express';
import { check } from 'express-validator';

import { validaciones } from '../middlewares/validations';
import { VentasController } from '../controllers/ventas.controllers';

const router = Router();

// Venta por ID
// GET - http://localhost:3000/api/ventas/:id 
router.get('/:id', validaciones.jwt, VentasController.getVenta);

// Listar ventas
// GET - http://localhost:3000/api/ventas
// Parametros: columna | direccion
router.get('/', validaciones.jwt, VentasController.listarVentas);

// Nueva venta
// POST - http://localhost:3000/api/ventas 
router.post('/', 
            [    
                validaciones.jwt,
                check('precio_total', 'El precio total es un campo obligatorio').not().isEmpty(),
                validaciones.campos
            ], VentasController.nuevaVenta);

// Actualizar venta
// PUT - http://localhost:3000/api/ventas/:id 
router.put('/:id', validaciones.jwt, VentasController.actualizarVenta);


export default router;
