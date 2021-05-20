import Router from 'express';
import { check } from 'express-validator';

import { validaciones } from '../middlewares/validations';
import { AuthController } from '../controllers/auth.controllers'

const router = Router();

router.get('/', validaciones.jwt, AuthController.renewtoken);
router.post('/',
        [
            check('usuario', 'El Usuario es obligatorio').not().isEmpty(),
            check('password', 'El password es obligatorio').not().isEmpty(),
            validaciones.campos
        ], 
        AuthController.login);

export default router;