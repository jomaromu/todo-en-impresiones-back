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
exports.PedidosClass = void 0;
const mongoose = require('mongoose');
// import { nanoid } from 'nanoid';
const nanoid_1 = require("nanoid");
const environment_1 = require("../environment/environment");
const moment_1 = __importDefault(require("moment"));
moment_1.default.locale('es');
// Modelo
const pedidoModel_1 = __importDefault(require("../models/pedidoModel"));
const workerModel_1 = __importDefault(require("../models/workerModel"));
// Funciones
const castEstado_1 = require("../functions/castEstado");
class PedidosClass {
    constructor() {
        this.pathIds = `pedidosIDs.json`;
        // this.idRef = nanoid(10);
        this.idRef = (0, nanoid_1.customAlphabet)('1234567890', 7);
    }
    crearPedido(req, resp) {
        const idCreador = req.usuario._id;
        // const idReferencia = this.idRef;
        const idReferencia = this.idRef();
        const fecha_alta = (0, moment_1.default)().format('YYYY-MM-DD');
        // const fecha_alta = moment().format('2021-04-15');
        // const fecha_entrega = moment().add(3, 'days').format('YYYY-MM-DD');
        const fecha_entrega = req.body.fecha_entrega;
        const cliente = req.get('cliente');
        const sucursal = req.get('sucursal');
        const vendedor = req.get('vendedor');
        // const origenPedido = req.get('origen');
        const crearPedido = () => {
            const crearNuevoPedido = new pedidoModel_1.default({
                idCreador: idCreador,
                idReferencia: idReferencia,
                fecha_alta: fecha_alta,
                fecha_entrega: fecha_entrega,
                cliente: cliente,
                sucursal: sucursal,
                // asignado_a: vendedor
                // origen_pedido: origenPedido
            });
            crearNuevoPedido.save((err, pedidoDB) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    return resp.json({
                        ok: false,
                        mensaje: `Error interno`,
                        err
                    });
                }
                return resp.json({
                    ok: true,
                    mensaje: `Pedido creado`,
                    pedidoDB,
                });
            }));
        };
        pedidoModel_1.default.find({ cliente: cliente }, (err, pedidosDB) => {
            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }
            if (pedidosDB.length === 0) {
                crearPedido();
            }
            else {
                const hayPendientes = pedidosDB.find((pedido) => pedido.etapa_pedido === 0);
                if (hayPendientes) {
                    // console.log('hay pendientes');
                    return resp.json({
                        ok: false,
                        mensaje: `Este cliente tiene pedidos pendientes`
                    });
                }
                else {
                    // console.log('no hay pendientes');
                    crearPedido();
                }
            }
        });
    }
    editarPedido(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            // cargar los usuarios workers de la sucursal del pedido
            // todas las bandeja de produccion tienen la etapa produccion
            // todo va guardado basado en la sucursal
            const tipo = req.body.tipo;
            const id = new mongoose.Types.ObjectId(req.get('id'));
            const sucursal = req.body.sucursal;
            const etapa_pedido = Number(req.body.etapa_pedido);
            const prioridad_pedido = req.body.prioridad_pedido;
            const asignado_a = req.body.asignado_a;
            const estado_pedido = req.body.estado_pedido;
            const origen_pedido = req.body.origen_pedido;
            const fecha_entrega = req.body.fecha_entrega;
            const itbms = req.body.itbms;
            const subtotal = Number(req.body.subtotal);
            const total = Number(req.body.total);
            const actualizarInfo = () => __awaiter(this, void 0, void 0, function* () {
                const query = {
                    fecha_entrega: fecha_entrega,
                    prioridad_pedido: prioridad_pedido,
                    etapa_pedido: etapa_pedido,
                    asignado_a: asignado_a,
                    estado_pedido: estado_pedido,
                    origen_pedido: origen_pedido,
                    sucursal: sucursal,
                };
                const pedidoDB = yield pedidoModel_1.default.findById(id)
                    .populate('sucursal')
                    .populate('asignado_a')
                    .populate('origen_pedido')
                    .populate('productos_pedidos')
                    .populate('pagos_pedido')
                    .exec();
                if (!query.fecha_entrega) {
                    query.fecha_entrega = pedidoDB.fecha_entrega;
                }
                if (!query.prioridad_pedido) {
                    query.prioridad_pedido = pedidoDB.prioridad_pedido;
                }
                if (isNaN(query.etapa_pedido)) {
                    query.etapa_pedido = pedidoDB.etapa_pedido;
                }
                if (!query.estado_pedido) {
                    query.estado_pedido = pedidoDB.estado_pedido;
                }
                if (!query.origen_pedido) {
                    query.origen_pedido = pedidoDB.origen_pedido;
                }
                if (!query.sucursal) {
                    query.sucursal = pedidoDB.sucursal;
                }
                if (query.asignado_a === 'null') {
                    query.asignado_a = null;
                }
                const actualizarPedido = () => {
                    pedidoModel_1.default.findByIdAndUpdate(id, query, { new: true })
                        .populate('sucursal')
                        // .populate('etapa_pedido')
                        // .populate('prioridad_pedido')
                        .populate('asignado_a')
                        .populate('origen_pedido')
                        .populate('productos_pedidos')
                        .populate('pagos_pedido')
                        .exec((err, pedidoDB) => __awaiter(this, void 0, void 0, function* () {
                        if (err) {
                            return resp.json({
                                ok: false,
                                mensaje: `Error interno`,
                                err
                            });
                        }
                        // if (query.sucursal) {
                        //     await bitacora.crearBitacora(req, `Cambió sucursal del pedido a ${pedidoDB.sucursal.nombre}`, pedidoDB._id);
                        // }
                        // if (query.etapa_pedido) {
                        //     await bitacora.crearBitacora(req, `Cambió etapa del pedido a ${pedidoDB.etapa_pedido.nombre}`, pedidoDB._id);
                        // }
                        // if (query.prioridad_pedido) {
                        //     await bitacora.crearBitacora(req, `Cambió la prioridad del pedido a ${pedidoDB.prioridad_pedido.nombre}`, pedidoDB._id);
                        // }
                        // if (query.asignado_a) {
                        //     await bitacora.crearBitacora(req, `Asginó el pedido a ${pedidoDB.asignado_a.nombre}`, pedidoDB._id);
                        // }
                        // if (query.estado_pedido) {
                        //     await bitacora.crearBitacora(req, `Cambió el estado del pedido a ${pedidoDB.estado_pedido}`, pedidoDB._id);
                        // }
                        return resp.json({
                            ok: true,
                            mensaje: 'Pedido actualizado',
                            pedidoDB,
                            // pedidoDB: pedidoDB
                        });
                    }));
                };
                /*
            1. Si asignado_a es null y se envia null
                busco el pedido en los workers y lo quito
    
            2. Si asignado_a no es null y se envia null
                busco el pedido en los workers y lo quito
    
            3. si asignado_a es null y se envia worker
                busco el pedido en los workers hago pull y se lo pongo al nuevo worker
    
            4. si asignado_a no es null y se envia worker
                busco el pedido en los workers hago pull y se lo pongo al nuevo worker
             */
                const idWorker = new mongoose.Types.ObjectId(query.asignado_a);
                if ((pedidoDB.asginado_a === null && query.asignado_a === null) || (pedidoDB.asginado_a !== null && query.asignado_a === null)) {
                    // console.log('Opcion No. 1 y 2');
                    workerModel_1.default.updateMany({}, { $pull: { pedidos: { $in: [id] } } }, {}, (err, asignadoDB) => {
                        if (err) {
                            return resp.json({
                                ok: false,
                                mensaje: 'Error interno',
                                err
                            });
                        }
                        else {
                            actualizarPedido();
                        }
                    });
                }
                else if ((pedidoDB.asignado_a === null && query.asignado_a !== null) || (pedidoDB.asginado_a !== null && query.asignado_a !== null)) {
                    // console.log('Opcion No. 3 y 4');
                    workerModel_1.default.updateMany({}, { $pull: { pedidos: { $in: [id] } } }, {}, (err, asignadoDB) => {
                        if (err) {
                            return resp.json({
                                ok: false,
                                mensaje: 'Error interno',
                                err
                            });
                        }
                        else {
                            workerModel_1.default.findByIdAndUpdate(idWorker, { $push: { pedidos: id } }, (err, asignadoDB) => {
                                if (err) {
                                    return resp.json({
                                        ok: false,
                                        mensaje: 'Error interno',
                                        err
                                    });
                                }
                                else {
                                    actualizarPedido();
                                }
                            });
                        }
                    });
                }
            });
            const actualizarGeneral = () => __awaiter(this, void 0, void 0, function* () {
                const query = {
                    fecha_entrega: fecha_entrega,
                    prioridad_pedido: prioridad_pedido,
                    etapa_pedido: etapa_pedido,
                    asignado_a: asignado_a,
                    estado_pedido: estado_pedido,
                    origen_pedido: origen_pedido,
                    sucursal: sucursal,
                    itbms: itbms,
                    subtotal,
                    total
                };
                const pedidoDB = yield pedidoModel_1.default.findById(id)
                    .populate('sucursal')
                    .populate('asignado_a')
                    .populate('origen_pedido')
                    .populate('productos_pedidos')
                    .populate('pagos_pedido')
                    .exec();
                if (!query.fecha_entrega) {
                    query.fecha_entrega = pedidoDB.fecha_entrega;
                }
                if (!query.prioridad_pedido) {
                    query.prioridad_pedido = pedidoDB.prioridad_pedido;
                }
                if (isNaN(query.etapa_pedido)) {
                    query.etapa_pedido = pedidoDB.etapa_pedido;
                }
                if (!query.estado_pedido) {
                    query.estado_pedido = pedidoDB.estado_pedido;
                }
                if (!query.origen_pedido) {
                    query.origen_pedido = pedidoDB.origen_pedido;
                }
                if (!query.sucursal) {
                    query.sucursal = pedidoDB.sucursal;
                }
                if (!query.asignado_a) {
                    query.asignado_a = pedidoDB.asignado_a;
                }
                if (isNaN(subtotal)) {
                    query.subtotal = pedidoDB.subtotal;
                }
                if (isNaN(total)) {
                    query.total = pedidoDB.total;
                }
                if (query.itbms === undefined) {
                    query.itbms = pedidoDB.itbms;
                }
                pedidoModel_1.default.findByIdAndUpdate(id, query, { new: true })
                    .populate('sucursal')
                    .populate('asignado_a')
                    .populate('origen_pedido')
                    .populate('productos_pedidos')
                    .populate('pagos_pedido')
                    .exec((err, pedidoDB) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        return resp.json({
                            ok: false,
                            mensaje: `Error interno`,
                            err
                        });
                    }
                    // if (query.sucursal) {
                    //     await bitacora.crearBitacora(req, `Cambió sucursal del pedido a ${pedidoDB.sucursal.nombre}`, pedidoDB._id);
                    // }
                    // if (query.etapa_pedido) {
                    //     await bitacora.crearBitacora(req, `Cambió etapa del pedido a ${pedidoDB.etapa_pedido.nombre}`, pedidoDB._id);
                    // }
                    // if (query.prioridad_pedido) {
                    //     await bitacora.crearBitacora(req, `Cambió la prioridad del pedido a ${pedidoDB.prioridad_pedido.nombre}`, pedidoDB._id);
                    // }
                    // if (query.asignado_a) {
                    //     await bitacora.crearBitacora(req, `Asginó el pedido a ${pedidoDB.asignado_a.nombre}`, pedidoDB._id);
                    // }
                    // if (query.estado_pedido) {
                    //     await bitacora.crearBitacora(req, `Cambió el estado del pedido a ${pedidoDB.estado_pedido}`, pedidoDB._id);
                    // }
                    return resp.json({
                        ok: true,
                        mensaje: 'Pedido actualizado',
                        pedidoDB,
                        // pedidoDB: pedidoDB
                    });
                }));
            });
            const actualizarProducto = () => __awaiter(this, void 0, void 0, function* () {
                const pedidoDB = yield pedidoModel_1.default.findById(id)
                    .populate('sucursal')
                    .populate('asignado_a')
                    .populate('origen_pedido')
                    .populate('productos_pedidos')
                    .populate('pagos_pedido')
                    .exec();
                const query = {
                    itbms: itbms,
                    subtotal,
                    total
                };
                if (isNaN(subtotal)) {
                    query.subtotal = pedidoDB.subtotal;
                }
                if (isNaN(total)) {
                    query.total = pedidoDB.total;
                }
                if (query.itbms === undefined) {
                    query.itbms = pedidoDB.itbms;
                }
                pedidoModel_1.default.findByIdAndUpdate(id, query, { new: true })
                    .populate('sucursal')
                    .populate('asignado_a')
                    .populate('origen_pedido')
                    .populate('productos_pedidos')
                    .populate('pagos_pedido')
                    .exec((err, pedidoDB) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        return resp.json({
                            ok: false,
                            mensaje: `Error interno`,
                            err
                        });
                    }
                    // if (query.sucursal) {
                    //     await bitacora.crearBitacora(req, `Cambió sucursal del pedido a ${pedidoDB.sucursal.nombre}`, pedidoDB._id);
                    // }
                    // if (query.etapa_pedido) {
                    //     await bitacora.crearBitacora(req, `Cambió etapa del pedido a ${pedidoDB.etapa_pedido.nombre}`, pedidoDB._id);
                    // }
                    // if (query.prioridad_pedido) {
                    //     await bitacora.crearBitacora(req, `Cambió la prioridad del pedido a ${pedidoDB.prioridad_pedido.nombre}`, pedidoDB._id);
                    // }
                    // if (query.asignado_a) {
                    //     await bitacora.crearBitacora(req, `Asginó el pedido a ${pedidoDB.asignado_a.nombre}`, pedidoDB._id);
                    // }
                    // if (query.estado_pedido) {
                    //     await bitacora.crearBitacora(req, `Cambió el estado del pedido a ${pedidoDB.estado_pedido}`, pedidoDB._id);
                    // }
                    return resp.json({
                        ok: true,
                        mensaje: 'Pedido actualizado',
                        pedidoDB,
                        // pedidoDB: pedidoDB
                    });
                }));
            });
            console.log(tipo);
            switch (tipo) {
                case 'info':
                    actualizarInfo();
                    break;
                case 'general':
                    actualizarGeneral();
                    break;
                case 'producto':
                    actualizarProducto();
                    break;
            }
        });
    }
    obtenerPedidoID(req, resp) {
        const id = req.get('id') || req.get('pedido');
        pedidoModel_1.default.findById(id)
            .populate('idCreador', 'nombre apellido colaborador_role')
            .populate({ path: 'archivos', populate: { path: 'idCreador', select: 'nombre' } })
            // .populate('etapa_pedido', 'nombre')
            // .populate('prioridad_pedido', 'nombre color_prioridad')
            // .populate({ path: 'productos_pedidos', populate: { path: 'producto' } })
            .populate({ path: 'productos_pedidos', populate: { path: 'producto' } })
            .populate('pagos_pedido')
            .populate('cliente')
            .populate('asignado_a')
            .populate('sucursal')
            .populate('origen_pedido')
            .exec((err, pedidoDB) => {
            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }
            if (!pedidoDB) {
                return resp.json({
                    ok: false,
                    mensaje: `No se encontró un pedido con ese ID`
                });
            }
            // const server = Server.instance;
            // server.io.emit('recibir-pagos', {ok: true, pedidoDB: pedidoDB});
            return resp.json({
                ok: true,
                mensaje: `Pedidos Ok`,
                pedidoDB
            });
        });
    }
    eliminarPedidoID(req, resp) {
        const id = req.get('id');
        pedidoModel_1.default.findByIdAndDelete(id)
            .exec((err, pedidoDB) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }
            if (!pedidoDB) {
                return resp.json({
                    ok: false,
                    mensaje: `No se encontró un pedido`
                });
            }
            return resp.json({
                ok: true,
                pedidoDB
            });
        }));
    }
    obtenerPedidosPorRole(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const role = req.get('role');
            const idSucursalWorker = req.get('idSucursalWorker');
            const idUsuario = req.get('idUsuario');
            // console.log(req.usuario._id);
            const match = {
                $match: {}
            };
            if (role === environment_1.environmnet.colRole.VendedorNormalRole) {
                match.$match = { 'sucursal': new mongoose.Types.ObjectId(idSucursalWorker) };
            }
            if (role === environment_1.environmnet.colRole.produccionNormal) {
                match.$match = { $and: [{ 'sucursal': new mongoose.Types.ObjectId(idSucursalWorker) }, { 'etapa_pedido': 2 }] };
            }
            if (role === environment_1.environmnet.colRole.produccionVIP) {
                match.$match = { 'etapa_pedido': 2 };
            }
            if (role === environment_1.environmnet.colRole.DiseniadorRole) {
                match.$match = { $and: [{ 'etapa_pedido': 1 }, { 'AsignadoA._id': new mongoose.Types.ObjectId(idUsuario) }] };
            }
            const pedidosDB = yield pedidoModel_1.default.aggregate([
                {
                    $lookup: {
                        from: 'prioridadpedidos',
                        localField: 'prioridad_pedido',
                        foreignField: '_id',
                        as: 'PrioridadPedido'
                    }
                },
                {
                    $lookup: {
                        from: 'archivos',
                        localField: 'archivos',
                        foreignField: '_id',
                        as: 'Archivos'
                    }
                },
                {
                    $lookup: {
                        from: 'productopedidos',
                        localField: 'productos_pedidos',
                        foreignField: '_id',
                        as: 'ProductosPedidos'
                    }
                },
                {
                    $lookup: {
                        from: 'pagos',
                        localField: 'pagos_pedido',
                        foreignField: '_id',
                        as: 'PagosPedido'
                    }
                },
                {
                    $lookup: {
                        from: 'userworkers',
                        localField: 'idCreador',
                        foreignField: '_id',
                        as: 'IDCreador'
                    }
                },
                {
                    $lookup: {
                        from: 'userclients',
                        localField: 'cliente',
                        foreignField: '_id',
                        as: 'Cliente'
                    }
                },
                {
                    $lookup: {
                        from: 'userworkers',
                        localField: 'asignado_a',
                        foreignField: '_id',
                        as: 'AsignadoA'
                    }
                },
                {
                    $lookup: {
                        from: 'etapapedidos',
                        localField: 'etapa_pedido',
                        foreignField: '_id',
                        as: 'EtapaPedido'
                    }
                },
                {
                    $lookup: {
                        from: 'sucursales',
                        localField: 'sucursal',
                        foreignField: '_id',
                        as: 'Sucursal'
                    }
                },
                match,
                {
                    $sort: { etapa_pedido: 1, prioridad_pedido: 1, fecha_actual: 1 } // prioridad_pedido: 1, fecha_actual: 1
                },
                {
                    $unset: ['IDCreador.password', 'EtapaPedido.nivel', 'PrioridadPedido.nivel']
                }
            ]);
            if (!pedidosDB || pedidosDB.length === 0) {
                return resp.json({
                    ok: false,
                    mensaje: `No se encontraron pedidos`
                });
            }
            else {
                return resp.json({
                    ok: true,
                    pedidosDB: pedidosDB,
                    cantidad: pedidosDB.length
                });
            }
        });
    }
    obtenerTodos(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            // const estadoHeader: string = req.get('estado');
            // const estado: boolean = castEstado(estadoHeader);
            // const fecha_actual: string = moment().format('YYYY-MM-DD');
            const respPedido = yield pedidoModel_1.default.aggregate([
                {
                    $lookup: {
                        from: 'prioridadpedidos',
                        localField: 'prioridad_pedido',
                        foreignField: '_id',
                        as: 'PrioridadPedido'
                    }
                },
                {
                    $lookup: {
                        from: 'archivos',
                        localField: 'archivos',
                        foreignField: '_id',
                        as: 'Archivos'
                    }
                },
                {
                    $lookup: {
                        from: 'productopedidos',
                        localField: 'productos_pedidos',
                        foreignField: '_id',
                        as: 'ProductosPedidos'
                    }
                },
                {
                    $lookup: {
                        from: 'pagos',
                        localField: 'pagos_pedido',
                        foreignField: '_id',
                        as: 'PagosPedido'
                    }
                },
                {
                    $lookup: {
                        from: 'userworkers',
                        localField: 'idCreador',
                        foreignField: '_id',
                        as: 'IDCreador'
                    }
                },
                {
                    $lookup: {
                        from: 'userclients',
                        localField: 'cliente',
                        foreignField: '_id',
                        as: 'Cliente'
                    }
                },
                {
                    $lookup: {
                        from: 'userworkers',
                        localField: 'asignado_a',
                        foreignField: '_id',
                        as: 'AsignadoA'
                    }
                },
                {
                    $lookup: {
                        from: 'etapapedidos',
                        localField: 'etapa_pedido',
                        foreignField: '_id',
                        as: 'EtapaPedido'
                    }
                },
                {
                    $lookup: {
                        from: 'sucursales',
                        localField: 'sucursal',
                        foreignField: '_id',
                        as: 'Sucursal'
                    }
                },
                // {
                //     $match: { estado: true } // estado: estado
                // },
                {
                    $sort: { etapa_pedido: 1, prioridad_pedido: 1, fecha_actual: 1 } // prioridad_pedido: 1, fecha_actual: 1
                },
                {
                    $unset: ['IDCreador.password', 'EtapaPedido.nivel', 'PrioridadPedido.nivel']
                }
            ]);
            if (!respPedido || respPedido.length === 0) {
                return resp.json({
                    ok: false,
                    mensaje: `No se encontraron pedidos`
                });
            }
            else {
                return resp.json({
                    ok: true,
                    pedidosDB: respPedido,
                    cantidad: respPedido.length
                });
            }
        });
    }
    obtenerDisenio(req, resp, idColaborador) {
        return __awaiter(this, void 0, void 0, function* () {
            const estadoHeader = req.get('estado');
            const estado = (0, castEstado_1.castEstado)(estadoHeader);
            const resPedido = yield pedidoModel_1.default.aggregate([
                {
                    $lookup: {
                        from: 'prioridadpedidos',
                        localField: 'prioridad_pedido',
                        foreignField: '_id',
                        as: 'PrioridadPedido'
                    }
                },
                {
                    $lookup: {
                        from: 'archivos',
                        localField: 'archivos',
                        foreignField: '_id',
                        as: 'Archivos'
                    }
                },
                {
                    $lookup: {
                        from: 'productopedidos',
                        localField: 'productos_pedidos',
                        foreignField: '_id',
                        as: 'ProductosPedidos'
                    }
                },
                {
                    $lookup: {
                        from: 'pagos',
                        localField: 'pagos_pedido',
                        foreignField: '_id',
                        as: 'PagosPedido'
                    }
                },
                {
                    $lookup: {
                        from: 'userworkers',
                        localField: 'idCreador',
                        foreignField: '_id',
                        as: 'IDCreador'
                    }
                },
                {
                    $lookup: {
                        from: 'userclients',
                        localField: 'cliente',
                        foreignField: '_id',
                        as: 'Cliente'
                    }
                },
                {
                    $lookup: {
                        from: 'userworkers',
                        localField: 'asignado_a',
                        foreignField: '_id',
                        as: 'AsignadoA'
                    }
                },
                {
                    $lookup: {
                        from: 'etapapedidos',
                        localField: 'etapa_pedido',
                        foreignField: '_id',
                        as: 'EtapaPedido'
                    }
                },
                {
                    $lookup: {
                        from: 'prioridadpedidos',
                        localField: 'prioridad_pedido',
                        foreignField: '_id',
                        as: 'PrioridadPedido'
                    }
                },
                {
                    $lookup: {
                        from: 'sucursales',
                        localField: 'sucursal',
                        foreignField: '_id',
                        as: 'Sucursal'
                    }
                },
                {
                    $sort: { 'PrioridadPedido.importancia': 1, fecha_actual: 1 }
                },
                {
                    $match: { 'AsignadoA._id': new mongoose.Types.ObjectId(idColaborador), 'EtapaPedido.nombre': 'Diseño gráfico', estado: estado }
                },
                {
                    $unset: ['AsignadoA.password', 'IDCreador.password']
                }
            ]);
            if (!resPedido || resPedido.length === 0) {
                return resp.json({
                    ok: false,
                    mensaje: `No se encontraron pedidos`
                });
            }
            else {
                return resp.json({
                    ok: true,
                    resPedido: resPedido,
                    cantidad: resPedido.length
                });
            }
        });
    }
    obtenerProduccion(req, resp, idColaborador) {
        return __awaiter(this, void 0, void 0, function* () {
            const estadoHeader = req.get('estado');
            const estado = (0, castEstado_1.castEstado)(estadoHeader);
            const role = req.usuario.colaborador_role;
            const sucursalCol = req.usuario.sucursal;
            const match = {
                $match: {}
            };
            if (role === environment_1.environmnet.colRole.produccionNormal) {
                match.$match = { 'EtapaPedido.nombre': 'Producción', 'Sucursal._id': new mongoose.Types.ObjectId(sucursalCol), estado: estado };
            }
            else if (role === environment_1.environmnet.colRole.produccionVIP) {
                match.$match = { 'EtapaPedido.nombre': 'Producción', estado: estado };
            }
            const resPedido = yield pedidoModel_1.default.aggregate([
                {
                    $lookup: {
                        from: 'prioridadpedidos',
                        localField: 'prioridad_pedido',
                        foreignField: '_id',
                        as: 'PrioridadPedido'
                    }
                },
                {
                    $lookup: {
                        from: 'archivos',
                        localField: 'archivos',
                        foreignField: '_id',
                        as: 'Archivos'
                    }
                },
                {
                    $lookup: {
                        from: 'productopedidos',
                        localField: 'productos_pedidos',
                        foreignField: '_id',
                        as: 'ProductosPedidos'
                    }
                },
                {
                    $lookup: {
                        from: 'pagos',
                        localField: 'pagos_pedido',
                        foreignField: '_id',
                        as: 'PagosPedido'
                    }
                },
                {
                    $lookup: {
                        from: 'userworkers',
                        localField: 'idCreador',
                        foreignField: '_id',
                        as: 'IDCreador'
                    }
                },
                {
                    $lookup: {
                        from: 'userclients',
                        localField: 'cliente',
                        foreignField: '_id',
                        as: 'Cliente'
                    }
                },
                {
                    $lookup: {
                        from: 'userworkers',
                        localField: 'asignado_a',
                        foreignField: '_id',
                        as: 'AsignadoA'
                    }
                },
                {
                    $lookup: {
                        from: 'etapapedidos',
                        localField: 'etapa_pedido',
                        foreignField: '_id',
                        as: 'EtapaPedido'
                    }
                },
                {
                    $lookup: {
                        from: 'prioridadpedidos',
                        localField: 'prioridad_pedido',
                        foreignField: '_id',
                        as: 'PrioridadPedido'
                    }
                },
                {
                    $lookup: {
                        from: 'sucursales',
                        localField: 'sucursal',
                        foreignField: '_id',
                        as: 'Sucursal'
                    }
                },
                {
                    $sort: { 'PrioridadPedido.importancia': 1, fecha_actual: 1 }
                },
                match,
                {
                    $unset: ['AsignadoA.password', 'IDCreador.password']
                }
            ]);
            if (!resPedido || resPedido.length === 0) {
                return resp.json({
                    ok: false,
                    mensaje: `No se encontraron pedidos`
                });
            }
            else {
                return resp.json({
                    ok: true,
                    resPedido: resPedido,
                    cantidad: resPedido.length
                });
            }
        });
    }
    obtenerVendedor(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            // const estadoHeader: string = req.get('estado');
            // const estado: boolean = castEstado(estadoHeader);
            const idUsuario = req.get('idUsuario');
            const role = req.usuario.colaborador_role;
            const sucursalCol = req.usuario.sucursal;
            const match = {
                $match: {}
            };
            if (role === environment_1.environmnet.colRole.VendedorNormalRole) {
                // match.$match = { 'Sucursal._id': new mongoose.Types.ObjectId(sucursalCol) } //, estado: estado
                match.$match = { 'IDCreador._id': new mongoose.Types.ObjectId(idUsuario) }; //, estado: estado
            }
            const resPedido = yield pedidoModel_1.default.aggregate([
                {
                    $lookup: {
                        from: 'prioridadpedidos',
                        localField: 'prioridad_pedido',
                        foreignField: '_id',
                        as: 'PrioridadPedido'
                    }
                },
                {
                    $lookup: {
                        from: 'archivos',
                        localField: 'archivos',
                        foreignField: '_id',
                        as: 'Archivos'
                    }
                },
                {
                    $lookup: {
                        from: 'productopedidos',
                        localField: 'productos_pedidos',
                        foreignField: '_id',
                        as: 'ProductosPedidos'
                    }
                },
                {
                    $lookup: {
                        from: 'pagos',
                        localField: 'pagos_pedido',
                        foreignField: '_id',
                        as: 'PagosPedido'
                    }
                },
                {
                    $lookup: {
                        from: 'userworkers',
                        localField: 'idCreador',
                        foreignField: '_id',
                        as: 'IDCreador'
                    }
                },
                {
                    $lookup: {
                        from: 'userclients',
                        localField: 'cliente',
                        foreignField: '_id',
                        as: 'Cliente'
                    }
                },
                {
                    $lookup: {
                        from: 'userworkers',
                        localField: 'asignado_a',
                        foreignField: '_id',
                        as: 'AsignadoA'
                    }
                },
                {
                    $lookup: {
                        from: 'etapapedidos',
                        localField: 'etapa_pedido',
                        foreignField: '_id',
                        as: 'EtapaPedido'
                    }
                },
                {
                    $lookup: {
                        from: 'prioridadpedidos',
                        localField: 'prioridad_pedido',
                        foreignField: '_id',
                        as: 'PrioridadPedido'
                    }
                },
                {
                    $lookup: {
                        from: 'sucursales',
                        localField: 'sucursal',
                        foreignField: '_id',
                        as: 'Sucursal'
                    }
                },
                {
                    $sort: { 'PrioridadPedido.importancia': 1, fecha_actual: 1 }
                },
                match,
                {
                    $unset: ['AsignadoA.password', 'IDCreador.password']
                }
            ]);
            if (!resPedido || resPedido.length === 0) {
                return resp.json({
                    ok: false,
                    mensaje: `No se encontraron pedidos`
                });
            }
            else {
                return resp.json({
                    ok: true,
                    resPedido: resPedido,
                    cantidad: resPedido.length
                });
            }
        });
    }
    obtenerEtapa(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const estadoHeader = req.get('estado');
            const estado = (0, castEstado_1.castEstado)(estadoHeader);
            const idColaborador = req.get('idColaborador');
            const nombreEtapaPedido = req.get('nombreEtapaPedido');
            // const fecha_actual: string = moment().format('YYYY-MM-DD');
            const resPedido = yield pedidoModel_1.default.aggregate([
                {
                    $lookup: {
                        from: 'prioridadpedidos',
                        localField: 'prioridad_pedido',
                        foreignField: '_id',
                        as: 'PrioridadPedido'
                    }
                },
                {
                    $lookup: {
                        from: 'archivos',
                        localField: 'archivos',
                        foreignField: '_id',
                        as: 'Archivos'
                    }
                },
                {
                    $lookup: {
                        from: 'productopedidos',
                        localField: 'productos_pedidos',
                        foreignField: '_id',
                        as: 'ProductosPedidos'
                    }
                },
                {
                    $lookup: {
                        from: 'pagos',
                        localField: 'pagos_pedido',
                        foreignField: '_id',
                        as: 'PagosPedido'
                    }
                },
                {
                    $lookup: {
                        from: 'userworkers',
                        localField: 'idCreador',
                        foreignField: '_id',
                        as: 'IDCreador'
                    }
                },
                {
                    $lookup: {
                        from: 'userclients',
                        localField: 'cliente',
                        foreignField: '_id',
                        as: 'Cliente'
                    }
                },
                {
                    $lookup: {
                        from: 'userworkers',
                        localField: 'asignado_a',
                        foreignField: '_id',
                        as: 'AsignadoA'
                    }
                },
                {
                    $lookup: {
                        from: 'etapapedidos',
                        localField: 'etapa_pedido',
                        foreignField: '_id',
                        as: 'EtapaPedido'
                    }
                },
                {
                    $lookup: {
                        from: 'prioridadpedidos',
                        localField: 'prioridad_pedido',
                        foreignField: '_id',
                        as: 'PrioridadPedido'
                    }
                },
                {
                    $lookup: {
                        from: 'sucursales',
                        localField: 'sucursal',
                        foreignField: '_id',
                        as: 'Sucursal'
                    }
                },
                {
                    $sort: { 'PrioridadPedido.importancia': 1, fecha_actual: 1 }
                },
                {
                    $match: { 'AsignadoA._id': new mongoose.Types.ObjectId(idColaborador), 'EtapaPedido.nombre': nombreEtapaPedido, estado: estado }
                },
                {
                    $unset: ['AsignadoA.password', 'IDCreador.password']
                }
            ]);
            if (!resPedido || resPedido.length === 0) {
                return resp.json({
                    ok: false,
                    mensaje: `No se encontraron pedidos`
                });
            }
            else {
                return resp.json({
                    ok: true,
                    resPedido: resPedido,
                    cantidad: resPedido.length
                });
            }
        });
    }
    redireccionBandejas(req, resp) {
        const role = req.usuario.colaborador_role;
        const idColaborador = req.usuario._id;
        switch (role) {
            case 'DiseniadorRole':
                this.obtenerDisenio(req, resp, idColaborador);
                break;
            case 'ProduccionVIPRole':
                this.obtenerProduccion(req, resp, idColaborador);
                break;
            case 'ProduccionNormalRole':
                this.obtenerProduccion(req, resp, idColaborador);
                break;
            case 'VendedorVIPRole':
                this.obtenerTodos(req, resp);
                break;
            case 'VendedorNormalRole':
                this.obtenerVendedor(req, resp);
                break;
            case 'AdminRole':
                this.obtenerTodos(req, resp);
                break;
            case 'SuperRole':
                this.obtenerTodos(req, resp);
                break;
        }
    }
    busquedaBandeja(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            // const estadoHeader: string = req.get('estado');
            // const estado: boolean = castEstado(estadoHeader);
            const role = req.get('colRole');
            const userID = req.get('userID');
            const sucursal = req.get('sucursal');
            const bandejas = req.get('bandejas');
            const match = {
                $match: {}
            };
            if (bandejas === 'null' && userID === 'null' && sucursal === 'null') {
                match.$match;
            }
            if (bandejas === 'null' && userID !== 'null' && sucursal !== 'null') {
                match.$match = { $and: [{ 'Sucursal._id': new mongoose.Types.ObjectId(sucursal) }, { 'AsignadoA._id': new mongoose.Types.ObjectId(userID) }, { 'AsignadoA.colaborador_role': role }] };
            }
            if (bandejas !== 'null' && userID === 'null' && sucursal === 'null') {
                switch (bandejas) {
                    case 'prod':
                        match.$match = { 'etapa_pedido': 2 };
                        break;
                    case 'vend':
                        match.$match = { $or: [{ 'IDCreador.colaborador_role': 'VendedorVIPRole' }, { 'IDCreador.colaborador_role': 'VendedorNormalRole' }] };
                        break;
                    case 'dise':
                        match.$match = { 'AsignadoA.colaborador_role': 'DiseniadorRole' };
                        break;
                    case 'admin':
                        match.$match = { 'IDCreador.colaborador_role': 'AdminRole' };
                        break;
                }
            }
            if (bandejas !== 'null' && userID !== 'null' && sucursal === 'null') {
                // match.$match = { $and: [{ 'AsignadoA._id': new mongoose.Types.ObjectId(userID) }, { 'AsignadoA.colaborador_role': role }] }
                switch (bandejas) {
                    // case 'prod':
                    //     match.$match = { $and: [{ 'etapa_pedido': 2 }, { 'Sucursal._id': new mongoose.Types.ObjectId(sucursal) }] }
                    //     break;
                    case 'vend':
                        match.$match = { $and: [{ $or: [{ 'IDCreador.colaborador_role': 'VendedorVIPRole' }, { 'IDCreador.colaborador_role': 'VendedorNormalRole' }] }, { 'IDCreador._id': new mongoose.Types.ObjectId(userID) }] };
                        break;
                    case 'dise':
                        match.$match = { 'AsignadoA._id': new mongoose.Types.ObjectId(userID) };
                        break;
                    case 'admin':
                        match.$match = { 'IDCreador._id': new mongoose.Types.ObjectId(userID) };
                        break;
                }
            }
            if (bandejas !== 'null' && userID === 'null' && sucursal !== 'null') {
                switch (bandejas) {
                    case 'prod':
                        match.$match = { $and: [{ 'etapa_pedido': 2 }, { 'Sucursal._id': new mongoose.Types.ObjectId(sucursal) }] };
                        break;
                    case 'vend':
                        match.$match = { $and: [{ $or: [{ 'IDCreador.colaborador_role': 'VendedorVIPRole' }, { 'IDCreador.colaborador_role': 'VendedorNormalRole' }] }, { 'Sucursal._id': new mongoose.Types.ObjectId(sucursal) }] };
                        break;
                    case 'dise':
                        match.$match = { $and: [{ 'AsignadoA.colaborador_role': 'DiseniadorRole' }, { 'Sucursal._id': new mongoose.Types.ObjectId(sucursal) }] };
                        break;
                    case 'admin':
                        match.$match = { $and: [{ 'IDCreador.colaborador_role': 'AdminRole' }, { 'Sucursal._id': new mongoose.Types.ObjectId(sucursal) }] };
                        break;
                }
            }
            if (sucursal !== 'null' && userID === 'null' && bandejas === 'null') {
                match.$match = { 'Sucursal._id': new mongoose.Types.ObjectId(sucursal) };
            }
            if (bandejas === 'null' && userID !== 'null' && sucursal === 'null') {
                match.$match = { $and: [{ 'AsignadoA._id': new mongoose.Types.ObjectId(userID) }, { 'AsignadoA.colaborador_role': role }] };
            }
            if (sucursal !== 'null' && userID !== 'null' && bandejas !== 'null') {
                switch (bandejas) {
                    case 'prod':
                        match.$match = { $and: [{ 'etapa_pedido': 2 }, { 'Sucursal._id': new mongoose.Types.ObjectId(sucursal) }] };
                        break;
                    case 'vend':
                        match.$match = { $and: [{ 'IDCreador._id': new mongoose.Types.ObjectId(userID) }, { 'Sucursal._id': new mongoose.Types.ObjectId(sucursal) }] };
                        break;
                    case 'dise':
                        match.$match = { $and: [{ 'AsignadoA.colaborador_role': 'DiseniadorRole' }, { 'Sucursal._id': new mongoose.Types.ObjectId(sucursal) }] };
                        break;
                    case 'admin':
                        match.$match = { $and: [{ 'IDCreador.colaborador_role': 'AdminRole' }, { 'Sucursal._id': new mongoose.Types.ObjectId(sucursal) }] };
                        break;
                }
                // match.$match = { $and: [{ 'AsignadoA._id': new mongoose.Types.ObjectId(userID) }, { 'AsignadoA.colaborador_role': role }, { 'Sucursal._id': new mongoose.Types.ObjectId(sucursal) }] }
            }
            const pedidosDB = yield pedidoModel_1.default.aggregate([
                {
                    $lookup: {
                        from: 'prioridadpedidos',
                        localField: 'prioridad_pedido',
                        foreignField: '_id',
                        as: 'PrioridadPedido'
                    }
                },
                {
                    $lookup: {
                        from: 'archivos',
                        localField: 'archivos',
                        foreignField: '_id',
                        as: 'Archivos'
                    }
                },
                {
                    $lookup: {
                        from: 'productopedidos',
                        localField: 'productos_pedidos',
                        foreignField: '_id',
                        as: 'ProductosPedidos'
                    }
                },
                {
                    $lookup: {
                        from: 'pagos',
                        localField: 'pagos_pedido',
                        foreignField: '_id',
                        as: 'PagosPedido'
                    }
                },
                {
                    $lookup: {
                        from: 'userworkers',
                        localField: 'idCreador',
                        foreignField: '_id',
                        as: 'IDCreador'
                    }
                },
                {
                    $lookup: {
                        from: 'userclients',
                        localField: 'cliente',
                        foreignField: '_id',
                        as: 'Cliente'
                    }
                },
                {
                    $lookup: {
                        from: 'userworkers',
                        localField: 'asignado_a',
                        foreignField: '_id',
                        as: 'AsignadoA'
                    }
                },
                {
                    $lookup: {
                        from: 'etapapedidos',
                        localField: 'etapa_pedido',
                        foreignField: '_id',
                        as: 'EtapaPedido'
                    }
                },
                {
                    $lookup: {
                        from: 'sucursales',
                        localField: 'sucursal',
                        foreignField: '_id',
                        as: 'Sucursal'
                    }
                },
                {
                    $lookup: {
                        from: 'userworkers',
                        localField: 'idCreador',
                        foreignField: '_id',
                        as: 'Worker'
                    }
                },
                {
                    $sort: { etapa_pedido: 1, prioridad_pedido: 1, fecha_actual: 1 }
                },
                match,
                {
                    $unset: ['AsignadoA.password', 'IDCreador.password']
                }
            ]);
            if (!pedidosDB || pedidosDB.length === 0) {
                return resp.json({
                    ok: false,
                    mensaje: `No se encontraron pedidos`
                });
            }
            else {
                return resp.json({
                    ok: true,
                    pedidosDB: pedidosDB,
                    cantidad: pedidosDB.length
                });
            }
        });
    }
}
exports.PedidosClass = PedidosClass;
/*
           1. Asignado a
           2. etapa
           3. Evitar que otro usuario se le asigne el mismo pedido
       */ 
