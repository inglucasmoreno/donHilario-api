"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validations_1 = require("../middlewares/validations");
const reportes_excel_1 = require("../controllers/reportes-excel");
const router = express_1.default();
// Reporte: Ventas
// POST - http://localhost:3000/api/reportes/ventas
router.post('/ventas', validations_1.validaciones.jwt, reportes_excel_1.ReportesExcelController.ventas);
// Reporte: Ventas
// POST - http://localhost:3000/api/reportes/productos
router.post('/productos', validations_1.validaciones.jwt, reportes_excel_1.ReportesExcelController.productos);
exports.default = router;
