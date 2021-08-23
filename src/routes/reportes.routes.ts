import Router from 'express';
import { check } from 'express-validator';

import { validaciones } from '../middlewares/validations';
import { ReportesController } from '../controllers/reportes.controllers';

const router = Router();

// Reporte: Ventas
// POST - http://localhost:3000/api/reportes/ventas
router.post('/ventas', validaciones.jwt, ReportesController.ventas);

// Reporte: Ventas
// POST - http://localhost:3000/api/reportes/productos
router.post('/productos', validaciones.jwt, ReportesController.productos);

// Reporte: Cantidades vs Desechos
// GET - http://localhost:3000/api/reportes/cantidades-desechos
router.post('/cantidades-desechos', validaciones.jwt, ReportesController.cantidadesDesechos);

export default router;