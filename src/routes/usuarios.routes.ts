import Router from 'express';
import { check } from 'express-validator';

import { validaciones } from '../middlewares/validations';
import { UsuariosController } from '../controllers/usuarios.controllers'

const router = Router();

router.get('/:id', validaciones.jwt, UsuariosController.getUsuario);
router.get('/', validaciones.jwt, UsuariosController.listarUsuarios);
router.post('/', 
            [    
                validaciones.jwt,
                check('usuario', 'El Usuario es obligatorio').not().isEmpty(),
                check('apellido', 'El Apellido es obligatorio').not().isEmpty(),
                check('nombre', 'El Nombre es obligatorio').not().isEmpty(),
                check('password', 'El Password es obligatorio').not().isEmpty(),
                check('email', 'El Email es obligatorio').not().isEmpty(),
                validaciones.campos
            ], UsuariosController.nuevoUsuario);
router.put('/:id', validaciones.jwt, UsuariosController.actualizarUsuario);

export default router;