"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportesExcelController = void 0;
const chalk_1 = __importDefault(require("chalk"));
const exceljs_1 = __importDefault(require("exceljs"));
const response_1 = require("../helpers/response");
const date_fns_1 = require("date-fns");
const path_1 = __importDefault(require("path"));
class ReportesExcel {
    // Reportes - Ventas
    ventas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ventas = req.body.ventas;
                const { totalVentas, montoTotalBalanza, montoTotalAnulacionBalanza, montoTotalMercaderia, totalAdicionalCredito, totalDescuentos, totalOtrosIngresos, totalOtrosGastos } = req.body;
                const workbook = new exceljs_1.default.Workbook();
                const worksheet = workbook.addWorksheet('Don Hilario - Ventas');
                worksheet.addRow(['Cantidad de ventas', ventas.length]);
                worksheet.addRow(['Total balanza con anulaciones', (montoTotalBalanza + montoTotalAnulacionBalanza), '', 'Total en ventas', totalVentas]);
                worksheet.addRow(['Total anulación balanza', montoTotalAnulacionBalanza, '', 'Total otros ingresos', totalOtrosIngresos]);
                worksheet.addRow(['Total balanza sin anulaciones', montoTotalBalanza, '', 'Total otros gastos', totalOtrosGastos]);
                worksheet.addRow(['Total mercaderia', montoTotalMercaderia, '', 'Total', (totalVentas + totalOtrosIngresos - totalOtrosGastos)]);
                worksheet.addRow(['Total adicional por credito', totalAdicionalCredito]);
                worksheet.addRow(['Total descuentos por sistema', totalDescuentos]);
                worksheet.addRow(['Total en ventas', totalVentas]);
                worksheet.addRow(['']);
                worksheet.addRow(['Fecha', 'Forma de pago', 'Monto total', 'Tipo de venta']);
                const nombreReporte = '../reportes/ventas/ventas.xlsx';
                // ventas.forEach( venta => {
                //     worksheet.addRow({
                //         'fecha': format(new Date(venta.createdAt), 'dd-MM-yyyy'),
                //         'forma_pago': venta.forma_pago,
                //         'monto_total': venta.precio_total,
                //         'tipo_venta': venta.mayorista ? 'Mayorista' : 'Normal'
                //     }); 
                // });
                ventas.forEach(venta => {
                    worksheet.addRow([date_fns_1.format(new Date(venta.createdAt), 'dd-MM-yyyy'), venta.forma_pago, venta.precio_total, venta.mayorista ? 'Mayorista' : 'Normal']);
                });
                worksheet.getRow(8).eachCell((cell) => {
                    cell.font = { bold: true };
                });
                workbook.xlsx.writeFile(path_1.default.join(__dirname, nombreReporte)).then((data) => __awaiter(this, void 0, void 0, function* () {
                    const pathReporte = path_1.default.join(__dirname, nombreReporte);
                    res.sendFile(pathReporte);
                }));
            }
            catch (error) {
                console.log(chalk_1.default.red(error));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Reporte - Productos
    productos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const busquedas = req.body.busqueda;
                const cantidad = req.body.cantidad;
                const tipo_filtro = req.body.tipo_filtro;
                const workbook = new exceljs_1.default.Workbook();
                const worksheet = workbook.addWorksheet('Don Hilario - Productos');
                worksheet.addRow(['Total de elementos', busquedas.length]);
                worksheet.addRow(['Tipo de filtrado', tipo_filtro]);
                worksheet.addRow(['Cantidad total', cantidad]);
                worksheet.addRow(['']);
                worksheet.addRow(['Fecha', 'Producto', 'Unidad de medida', 'Cantidad']);
                // worksheet.columns = [
                //     { header: 'Fecha', key: 'fecha', width: 18 },
                //     { header: 'Producto', key: 'producto', width: 40 },
                //     { header: 'Unidad de medida', key: 'unidad_medida', width: 18 },
                //     { header: 'Cantidad', key: 'cantidad', width: 10 },
                // ];
                // busquedas.forEach( busqueda => {
                //     worksheet.addRow({
                //         'fecha': busqueda._id.createdAt,
                //         'producto': busqueda._id.producto,
                //         'unidad_medida': busqueda._id.unidad,
                //         'cantidad': busqueda.cantidad
                //     }); 
                // });
                busquedas.forEach(busqueda => {
                    worksheet.addRow([busqueda._id.createdAt, busqueda._id.producto, busqueda._id.unidad, busqueda.cantidad]);
                });
                worksheet.getRow(5).eachCell((cell) => {
                    cell.font = { bold: true };
                });
                const nombreReporte = '../reportes/productos/productos.xlsx';
                workbook.xlsx.writeFile(path_1.default.join(__dirname, nombreReporte)).then((data) => __awaiter(this, void 0, void 0, function* () {
                    const pathReporte = path_1.default.join(__dirname, nombreReporte);
                    res.sendFile(pathReporte);
                }));
            }
            catch (error) {
                console.log(chalk_1.default.red(error));
                response_1.respuesta.error(res, 500);
            }
        });
    }
}
exports.ReportesExcelController = new ReportesExcel();
