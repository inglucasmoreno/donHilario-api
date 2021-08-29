/*
    Desarrollador: Equinoccio Technology
    CEO: ing. Lucas Omar Moreno
    Año: 2021
    Cliente: Carniceria Don Hilario
*/

// Imports
import express from 'express';
import chalk from 'chalk';
import path from 'path';
import { db } from './database/config';

// Imports - Rutas
import UsuariosRoutes from './routes/usuarios.routes';
import AuthRoutes from './routes/auth.routes';
import UnidadMedidaRoutes from './routes/unidad_medida.routes';
import ProductoRoutes from './routes/productos.routes';
import ProveedoresRoutes from './routes/proveedores.routes';
import MayoristasRoutes from './routes/mayoristas.routes';
import IngresoRoutes from './routes/ingreso.routes';
import IngresoProductoRoutes from './routes/ingreso_productos.routes';
import DesechosRoutes from './routes/desechos.routes';
import ProduccionInternaRoutes from './routes/produccion_interna.routes';
import MediaResRoutes from './routes/mediaRes.routes';
import CerdoRoutes from './routes/cerdo.routes';
import PolloRoutes from './routes/pollo.routes';
import VentasRoutes from './routes/ventas.routes';
import VentasProductosRoutes from './routes/ventas_productos.routes';
import OtrosIngresosRoutes from './routes/otros_ingresos.routes';
import OtrosGastosRoutes from './routes/otros_gastos.routes';
import ReportesRoutes from './routes/reportes.routes';
import CajasRoutes from './routes/caja.routes';
import ReportesExcelRoutes from './routes/reportes_excel.routes';

// [Express]
const app = express();
app.set('PORT', process.env.PORT || 3000);
app.use(require('cors')());
app.use(express.json());
app.use(express.static('public'));

// [MongoDB]
db.connection();

// [Rutas]
app.use('/api/usuarios', UsuariosRoutes);
app.use('/api/auth', AuthRoutes);
app.use('/api/unidad_medida', UnidadMedidaRoutes);
app.use('/api/productos', ProductoRoutes);
app.use('/api/proveedores', ProveedoresRoutes);
app.use('/api/mayoristas', MayoristasRoutes);
app.use('/api/ingresos', IngresoRoutes);
app.use('/api/desechos', DesechosRoutes);
app.use('/api/produccion-interna', ProduccionInternaRoutes);
app.use('/api/ingreso_productos', IngresoProductoRoutes);
app.use('/api/media-res', MediaResRoutes);
app.use('/api/cerdo', CerdoRoutes);
app.use('/api/pollo', PolloRoutes);
app.use('/api/ventas', VentasRoutes);
app.use('/api/ventas_productos', VentasProductosRoutes);
app.use('/api/otros_gastos', OtrosGastosRoutes);
app.use('/api/otros_ingresos', OtrosIngresosRoutes);
app.use('/api/reportes', ReportesRoutes);
app.use('/api/reportes-excel', ReportesExcelRoutes);
app.use('/api/cajas', CajasRoutes);

// [Necesario para no perder las rutas en produccion]
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'))
});

// Ejecución de servidor
app.listen(app.get('PORT'), () => {
    console.log(chalk.blue('[Desarrollador] - ') + 'Equinoccio Technology');
    console.log(chalk.blue('[Express] - ') + `Servidor corriendo en http://localhost:${app.get('PORT')}`)    
});

