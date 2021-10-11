import Router from 'express';
import { check } from 'express-validator';

import { validaciones } from '../middlewares/validations';
import { CuentaCorrienteController } from '../controllers/cuenta_corriente.controllers';

const router = Router();

// Cuenta Corriente por ID
// GET - http://localhost:3000/api/cuenta_corriente/:id 
router.get('/:id', validaciones.jwt, CuentaCorrienteController.getCuentaCorriente);

// Listar cuentas corrientes x Usuario
// GET - http://localhost:3000/api/cuenta_corriente/usuario/:usuario
// Parametros: columna | direccion | descripcion | activo
router.get('/usuario/:usuario', validaciones.jwt, CuentaCorrienteController.listarCuentasCorrientes);

// Nueva cuenta corriente
// POST - http://localhost:3000/api/cuenta_corriente
router.post('/', 
            [    
                validaciones.jwt,
                check('usuario', 'El usuario es un campo obligatorio').not().isEmpty(),
                check('total', 'El total es un campo obligatorio').not().isEmpty(),
                validaciones.campos
            ], CuentaCorrienteController.nuevaCuentaCorriente);

// Actualizar cuenta corriente
// PUT - http://localhost:3000/api/cuenta_corriente/:id 
router.put('/:id', validaciones.jwt, CuentaCorrienteController.actualizarCuentaCorriente);

// Completar cuentas corrientes (Ingresos)
// PUT - http://localhost:3000/api/cuenta_corriente/todos/:usuario 
router.put('/todos/:usuario', validaciones.jwt, CuentaCorrienteController.completarCuentasCorrientes);

export default router;