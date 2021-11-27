"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const server_1 = __importDefault(require("./class/server"));
// Modelos
require('./models/pagosModel');
// rutas
const sucursalRoute_1 = __importDefault(require("./routes/sucursalRoute"));
const workerRoleRoute_1 = __importDefault(require("./routes/workerRoleRoute"));
const workerRoute_1 = __importDefault(require("./routes/workerRoute"));
const clientRoute_1 = __importDefault(require("./routes/clientRoute"));
const productRoute_1 = __importDefault(require("./routes/productRoute"));
const etapaPedidoRoute_1 = __importDefault(require("./routes/etapaPedidoRoute"));
const prioridadPedidoRoute_1 = __importDefault(require("./routes/prioridadPedidoRoute"));
const archivoPedido_1 = __importDefault(require("./routes/archivoPedido"));
const getfileRoute_1 = __importDefault(require("./routes/getfileRoute"));
const metodoPagoRoute_1 = __importDefault(require("./routes/metodoPagoRoute"));
const pagoRoute_1 = __importDefault(require("./routes/pagoRoute"));
const pedidoRoute_1 = __importDefault(require("./routes/pedidoRoute"));
const productoPedidoRoute_1 = __importDefault(require("./routes/productoPedidoRoute"));
const clienteRoleRoute_1 = __importDefault(require("./routes/clienteRoleRoute"));
const origenPedidoRoute_1 = __importDefault(require("./routes/origenPedidoRoute"));
const categoriaRoute_1 = __importDefault(require("./routes/categoriaRoute"));
const gestorCarpetaRoute_1 = __importDefault(require("./routes/gestorCarpetaRoute"));
const ayudaRoute_1 = __importDefault(require("./routes/ayudaRoute"));
// const server = new Server();
const server = server_1.default.instance;
// body parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// file upload
server.app.use((0, express_fileupload_1.default)());
// cors
server.app.use((0, cors_1.default)({ origin: true, credentials: true }));
// conexion local
mongoose_1.default.connect('mongodb://127.0.0.1:27017/todoImpresiones', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: false, autoIndex: false }, (err) => {
    if (err)
        throw err;
    console.log('Base de datos Online');
});
// usar las rutas
server.app.use('/sucursales', sucursalRoute_1.default);
server.app.use('/colrole', workerRoleRoute_1.default);
server.app.use('/clientRole', clienteRoleRoute_1.default);
server.app.use('/worker', workerRoute_1.default);
server.app.use('/client', clientRoute_1.default);
server.app.use('/product', productRoute_1.default);
server.app.use('/etapaPedido', etapaPedidoRoute_1.default);
server.app.use('/prioridad', prioridadPedidoRoute_1.default);
server.app.use('/archivo', archivoPedido_1.default);
server.app.use('/file', getfileRoute_1.default);
server.app.use('/metodoPago', metodoPagoRoute_1.default);
server.app.use('/pago', pagoRoute_1.default);
server.app.use('/pedidos', pedidoRoute_1.default);
server.app.use('/productoPedido', productoPedidoRoute_1.default);
server.app.use('/origenPedido', origenPedidoRoute_1.default);
server.app.use('/categoria', categoriaRoute_1.default);
server.app.use('/gestor', gestorCarpetaRoute_1.default);
server.app.use('/ayuda', ayudaRoute_1.default);
// correr servidor
server.start(() => {
    console.log(`Servidor corriendo en el puerto: ${server.port}`);
});
