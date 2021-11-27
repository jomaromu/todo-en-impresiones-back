import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import Server from './class/server';

// Modelos
require('./models/pagosModel');

// rutas
import sucursalRouter from './routes/sucursalRoute';
import roleColRouter from './routes/workerRoleRoute';
import workerRouter from './routes/workerRoute';
import clientRouter from './routes/clientRoute';
import productRouter from './routes/productRoute';
import etapaRouter from './routes/etapaPedidoRoute';
import prioridadRouter from './routes/prioridadPedidoRoute';
import archivoRouter from './routes/archivoPedido';
import getFileRouter from './routes/getfileRoute';
import metodoPagoRoute from './routes/metodoPagoRoute';
import pagoRoute from './routes/pagoRoute';
import pedidoRouter from './routes/pedidoRoute';
import productoPedidoRouter from './routes/productoPedidoRoute';
import roleClientRouter from './routes/clienteRoleRoute';
import origenRouter from './routes/origenPedidoRoute';
import categoriaRouter from './routes/categoriaRoute';
import gestorRoute from './routes/gestorCarpetaRoute';
import ayudaRoute from './routes/ayudaRoute';

// const server = new Server();
const server = Server.instance;

// body parser
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());

// file upload
server.app.use(fileUpload());

// cors
server.app.use(cors({ origin: true, credentials: true }));

// conexion local
mongoose.connect('mongodb://127.0.0.1:27017/todoImpresiones', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: false, autoIndex: false }, (err) => {
    if (err) throw err;
    console.log('Base de datos Online');
});

// usar las rutas
server.app.use('/sucursales', sucursalRouter);
server.app.use('/colrole', roleColRouter);
server.app.use('/clientRole', roleClientRouter);
server.app.use('/worker', workerRouter);
server.app.use('/client', clientRouter);
server.app.use('/product', productRouter);
server.app.use('/etapaPedido', etapaRouter);
server.app.use('/prioridad', prioridadRouter);
server.app.use('/archivo', archivoRouter);
server.app.use('/file', getFileRouter);
server.app.use('/metodoPago', metodoPagoRoute);
server.app.use('/pago', pagoRoute);
server.app.use('/pedidos', pedidoRouter);
server.app.use('/productoPedido', productoPedidoRouter);
server.app.use('/origenPedido', origenRouter);
server.app.use('/categoria', categoriaRouter);
server.app.use('/gestor', gestorRoute);
server.app.use('/ayuda', ayudaRoute);

// correr servidor
server.start(() => {
    console.log(`Servidor corriendo en el puerto: ${server.port}`);
});