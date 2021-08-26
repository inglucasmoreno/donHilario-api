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

            const workbook = new ExcelJs.Workbook();
            const worksheet = workbook.addWorksheet('Don Hilario - Ventas');
            
            worksheet.columns = [
                { header: 'Fecha', key: 'fecha', width: 18 },
                { header: 'Forma de pago', key: 'forma_pago', width: 18 },
                { header: 'Monto total', key: 'monto_total', width: 18 },
                { header: 'Tipo de venta', key: 'tipo_venta', width: 18 },
            ];

            const nombreReporte = '../reportes/ventas/ventas.xlsx';

            ventas.forEach( venta => {
                worksheet.addRow({
                    'fecha': format(new Date(venta.createdAt), 'dd-MM-yyyy'),
                    'forma_pago': venta.forma_pago,
                    'monto_total': venta.precio_total,
                    'tipo_venta': venta.mayorista ? 'Mayorista' : 'Normal'
                }); 
            });

            worksheet.getRow(1).eachCell((cell) => {
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

            const workbook = new ExcelJs.Workbook();
            const worksheet = workbook.addWorksheet('Don Hilario - Ventas');
            
            worksheet.columns = [
                { header: 'Fecha', key: 'fecha', width: 18 },
                { header: 'Producto', key: 'producto', width: 40 },
                { header: 'Unidad de medida', key: 'unidad_medida', width: 18 },
                { header: 'Cantidad', key: 'cantidad', width: 10 },
            ];

            const nombreReporte = '../reportes/productos/productos.xlsx';

            busquedas.forEach( busqueda => {
                worksheet.addRow({
                    'fecha': busqueda._id.createdAt,
                    'producto': busqueda._id.producto,
                    'unidad_medida': busqueda._id.unidad,
                    'cantidad': busqueda.cantidad
                }); 
            });

            worksheet.getRow(1).eachCell((cell) => {
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

}


export const ReportesExcelController = new ReportesExcel();