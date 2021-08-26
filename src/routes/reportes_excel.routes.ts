import Router from 'express';
import { check } from 'express-validator';

import { validaciones } from '../middlewares/validations';
import { ReportesExcelController } from '../controllers/reportes-excel';

const router = Router();

// Reporte: Ventas
// POST - http://localhost:3000/api/reportes/ventas
router.post('/ventas', validaciones.jwt, ReportesExcelController.ventas);

// Reporte: Ventas
// POST - http://localhost:3000/api/reportes/productos
router.post('/productos', validaciones.jwt, ReportesExcelController.productos);


export default router;