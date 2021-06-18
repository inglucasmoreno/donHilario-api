import Router from 'express';
import { check } from 'express-validator';

import { validaciones } from '../middlewares/validations';
import { ProveedoresController } from '../controllers/proveedores.controllers';

const router = Router();

// Proveedor por ID
// GET - http://localhost:3000/api/proveedores/:id 
router.get('/:id', validaciones.jwt, ProveedoresController.getProveedor);

// Listar proveedores
// GET - http://localhost:3000/api/proveedores
// Parametros: columna | direccion | descripcion | activo
router.get('/', validaciones.jwt, ProveedoresController.listarProveedores);

// Nuevo proveedor
// POST - http://localhost:3000/api/proveedores 
router.post('/', 
            [    
                validaciones.jwt,
                check('razon_social', 'Razon social es un campo obligatorio').not().isEmpty(),
                check('cuit', 'Cuit es un campo obligatorio').not().isEmpty(),
                check('condicion_iva', 'La condicion frente al IVA es un campo obligatorio').not().isEmpty(),
                validaciones.campos
            ], ProveedoresController.nuevoProveedor);

// Actualizar proveedores
// PUT - http://localhost:3000/api/proveedores/:id 
router.put('/:id', validaciones.jwt, ProveedoresController.actualizarProveedor);

export default router;