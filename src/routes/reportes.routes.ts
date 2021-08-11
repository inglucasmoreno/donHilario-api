import Router from 'express';
import { check } from 'express-validator';

import { validaciones } from '../middlewares/validations';
import { ReportesController } from '../controllers/reportes.controllers';

const router = Router();

// Reporte: Ventas
// GET - http://localhost:3000/api/reportes/ventas
router.get('/ventas', validaciones.jwt, ReportesController.listartVentas);

export default router;