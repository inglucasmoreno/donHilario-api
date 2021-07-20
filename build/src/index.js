"use strict";
/*
    Desarrollador: Equinoccio Technology
    CEO: ing. Lucas Omar Moreno
    Año: 2021
    Cliente: Carniceria Don Hilario
*/
var __importDefault = (this && this.__importDefault) || function(mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Imports
const express_1 = __importDefault(require("express"));
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const config_1 = require("./database/config");
// Imports - Rutas
const usuarios_routes_1 = __importDefault(require("./routes/usuarios.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const unidad_medida_routes_1 = __importDefault(require("./routes/unidad_medida.routes"));
const productos_routes_1 = __importDefault(require("./routes/productos.routes"));
const proveedores_routes_1 = __importDefault(require("./routes/proveedores.routes"));
const ingreso_routes_1 = __importDefault(require("./routes/ingreso.routes"));
const ingreso_productos_routes_1 = __importDefault(require("./routes/ingreso_productos.routes"));
const ventas_routes_1 = __importDefault(require("./routes/ventas.routes"));
const ventas_productos_routes_1 = __importDefault(require("./routes/ventas_productos.routes"));
const otros_ingresos_routes_1 = __importDefault(require("./routes/otros_ingresos.routes"));
const otros_gastos_routes_1 = __importDefault(require("./routes/otros_gastos.routes"));
const caja_routes_1 = __importDefault(require("./routes/caja.routes"));
// [Express]
const app = express_1.default();
app.set('PORT', process.env.PORT || 3000);
app.use(require('cors')());
app.use(express_1.default.json());
app.use(express_1.default.static('public'));
// [MongoDB]
config_1.db.connection();
// [Rutas]
app.use('/api/usuarios', usuarios_routes_1.default);
app.use('/api/auth', auth_routes_1.default);
app.use('/api/unidad_medida', unidad_medida_routes_1.default);
app.use('/api/productos', productos_routes_1.default);
app.use('/api/proveedores', proveedores_routes_1.default);
app.use('/api/ingresos', ingreso_routes_1.default);
app.use('/api/ingreso_productos', ingreso_productos_routes_1.default);
app.use('/api/ventas', ventas_routes_1.default);
app.use('/api/ventas_productos', ventas_productos_routes_1.default);
app.use('/api/otros_gastos', otros_gastos_routes_1.default);
app.use('/api/otros_ingresos', otros_ingresos_routes_1.default);
app.use('/api/cajas', caja_routes_1.default);
// [Necesario para no perder las rutas en produccion]
app.get('*', (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, 'public/index.html'));
});
// Ejecución de servidor
app.listen(app.get('PORT'), () => {
    console.log(chalk_1.default.blue('[Desarrollador] - ') + 'Equinoccio Technology');
    console.log(chalk_1.default.blue('[Express] - ') + `Servidor corriendo en http://localhost:${app.get('PORT')}`);
});