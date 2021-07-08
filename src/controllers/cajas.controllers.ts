import { Request, Response } from 'express';
import chalk from 'chalk';

import { respuesta } from '../helpers/response';

import VentasModel from '../models/venta.model';
import saldoInicialModel, { I_SaldoInicial } from '../models/saldo_inicial.model';
import CajaModel, { I_Caja } from '../models/caja.model';
import OtrosIngresosModel from '../models/otros_ingresos.model';
import OtrosGastosModel from '../models/otros_gastos.model';
import BilletesModel from '../models/billetes.model';
import UsuarioModel from '../models/usuarios.model';

class Caja {
    
    // Metodo: Obtener saldo inicial
    public async getSaldoInicial(req:Request, res:Response){
        try{
            const saldoDB: I_SaldoInicial[] = await saldoInicialModel.find();
            if(saldoDB.length === 0) respuesta.success(res, { monto: 0 });
            else respuesta.success(res, { monto: saldoDB[0].monto });
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }
    }

    // Metodo: Crear o Actualizar saldo inicial
    public async saldoInicial(req: Request, res: Response){
        try{
            const { monto } = req.body;
            const saldoDB: I_SaldoInicial[] = await saldoInicialModel.find();
            
            if(saldoDB.length > 0){ // Existe - Actualizar
                await saldoInicialModel.findByIdAndUpdate(saldoDB[0]._id, { monto });        
            }else{ // No existe - Crear uno nuevo
                const nuevoSaldo = new saldoInicialModel(req.body);
                await nuevoSaldo.save();
            }

            respuesta.success(res, { msg: 'Saldo actualizado correctamente' });
            
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        } 
    }

    // Metodo: Nueva caja
    public async nuevaCaja(req: any, res: Response) {
        try{

            const { uid } = req;
            const ingresos: any[] = req.body.ingresos;
            const gastos: any[] = req.body.gastos;

            // Se crea la nueva caja
            // Se agregar el usuario creador a la data
            const usuarioLogin = await UsuarioModel.findById(uid, 'apellido nombre');
            const usuario_creacion = usuarioLogin.apellido + ' ' + usuarioLogin.nombre;
            req.body.usuario_creacion = usuario_creacion;

            const nuevaCaja = new CajaModel(req.body);
            const cajaDB: I_Caja = await nuevaCaja.save();

            // Se agregan los Ingresos
            ingresos.forEach(async elemento => {
                const data = { 
                    descripcion: elemento.descripcion, 
                    monto: elemento.monto,
                    usuario_creacion: usuario_creacion,
                    caja: cajaDB._id, 
                }
                const nuevoIngreso = new OtrosIngresosModel(data);
                await nuevoIngreso.save();
            });

            // Se agregan los Gastos
            gastos.forEach(async elemento => {
                const data = { 
                    descripcion: elemento.descripcion, 
                    monto: elemento.monto,
                    usuario_creacion: usuario_creacion,
                    caja: cajaDB._id, 
                }
                const nuevoGasto = new OtrosGastosModel(data);
                await nuevoGasto.save();
            });

            // Se agrega el control de billetes
            const dataBilletes = {
                caja: cajaDB._id,
                cinco: req.body.billetes.cantidad_5 || 0,
                diez: req.body.billetes.cantidad_10 || 0,
                veinte: req.body.billetes.cantidad_20 || 0,
                cincuenta: req.body.billetes.cantidad_50 || 0,
                cien: req.body.billetes.cantidad_100 || 0,
                doscientos: req.body.billetes.cantidad_200 || 0,
                quinientos: req.body.billetes.cantidad_500 || 0,
                mil: req.body.billetes.cantidad_1000 || 0,
                monedas: req.body.billetes.cantidad_monedas || 0
            }
            
            // Se deshabilitan las ventas actuales luego del cierre de caja
            await VentasModel.updateMany({activo: true}, {activo: false});

            const nuevosBilletes = new BilletesModel(dataBilletes);
            await nuevosBilletes.save();

            respuesta.success(res, 'Cierre de caja completado');
        
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }
    }

    


}



export const CajasController = new Caja();