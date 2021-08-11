import chalk from 'chalk';
import { Request, Response } from 'express';
import { respuesta } from '../helpers/response';

class Reportes {
      
    // Reportes: Ventas
    public async listartVentas(req: Request, res: Response) {
        respuesta.success(res, 'Lista de ventas');
    }

}

export const ReportesController = new Reportes();