import chalk from 'chalk';
import { Request, Response } from 'express';
import ExcelJs from 'exceljs';
import { respuesta } from '../helpers/response';
import { format } from 'date-fns';
import path from 'path';

class ReportesExcel {

    // Reportes - Ventas
    public async ventas(req: any, res: Response){
        try{

            const ventas: any[] = req.body.ventas;
            const { totalVentas, montoTotalBalanza, montoTotalMercaderia, totalAdicionalCredito, totalDescuentos, totalOtrosIngresos, totalOtrosGastos } = req.body;

            const workbook = new ExcelJs.Workbook();
            const worksheet = workbook.addWorksheet('Don Hilario - Ventas');

            worksheet.addRow(['Cantidad de ventas', ventas.length]);
            worksheet.addRow(['Total balanza', montoTotalBalanza,'','Total en ventas', totalVentas]);
            worksheet.addRow(['Total mercaderia', montoTotalMercaderia, '', 'Total otros ingresos', totalOtrosIngresos]);
            worksheet.addRow(['Total adicional por credito', totalAdicionalCredito,'', 'Total otros gastos', totalOtrosGastos]);
            worksheet.addRow(['Total descuentos por sistema', totalDescuentos,'', 'Total', (totalVentas + totalOtrosIngresos - totalOtrosGastos)]);
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

            ventas.forEach( venta => {
                worksheet.addRow([format(new Date(venta.createdAt), 'dd-MM-yyyy'), venta.forma_pago, venta.precio_total, venta.mayorista ? 'Mayorista' : 'Normal']);    
            });

            worksheet.getRow(8).eachCell((cell) => {
                cell.font = { bold: true };
                
            })

            workbook.xlsx.writeFile(path.join(__dirname, nombreReporte)).then(async data => {
                const pathReporte = path.join(__dirname, nombreReporte);
                res.sendFile(pathReporte);
            });
        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        }
    }

    // Reporte - Productos
    public async productos(req: Request, res: Response){
        try{
            const busquedas: any[] = req.body.busqueda;
            const cantidad: number = req.body.cantidad;

            const workbook = new ExcelJs.Workbook();
            const worksheet = workbook.addWorksheet('Don Hilario - Productos');

            worksheet.addRow(['Total de filas', busquedas.length]);
            worksheet.addRow(['Total de productos', cantidad]);
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

            busquedas.forEach( busqueda => {
                worksheet.addRow([busqueda._id.createdAt, busqueda._id.producto, busqueda._id.unidad, busqueda.cantidad]);    
            });

            worksheet.getRow(4).eachCell((cell) => {
                cell.font = { bold: true };
            })

            const nombreReporte = '../reportes/productos/productos.xlsx';

            workbook.xlsx.writeFile(path.join(__dirname, nombreReporte)).then(async data => {
                const pathReporte = path.join(__dirname, nombreReporte);
                res.sendFile(pathReporte);
            });
        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        }
    }

}


export const ReportesExcelController = new ReportesExcel();