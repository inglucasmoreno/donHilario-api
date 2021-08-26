import chalk from 'chalk';
import { Request, Response } from 'express';
import ExcelJs from 'exceljs';
import { respuesta } from '../helpers/response';
import path from 'path';

class ReportesExcel {

    public async ventas(req: Request, res: Response){
        try{
            const workbook = new ExcelJs.Workbook();
            const worksheet = workbook.addWorksheet('Don Hilario - Ventas');
            
            worksheet.columns = [
                { header: 'Fecha', key: 'fecha', width: 18 },
                { header: 'Forma de pago', key: 'forma_pago', width: 18 },
                { header: 'Monto total', key: 'monto_total', width: 18 },
                { header: 'Tipo de venta', key: 'tipo_venta', width: 18 },
            ];

            const nombreReporte = '../reportes/ventas/ventas.xlsx';
            
            workbook.xlsx.writeFile(path.join(__dirname, nombreReporte)).then(async data => {
                const pathReporte = path.join(__dirname, nombreReporte);
                res.sendFile(pathReporte);
            });
        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        }
    }

    public async productos(req: Request, res: Response){
        try{

        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        }
    }

}


export const ReportesExcelController = new ReportesExcel();