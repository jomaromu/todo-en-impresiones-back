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
const nanoid_1 = require("nanoid");
const environment_1 = require("../environment/environment");
const moment_1 = __importDefault(require("moment"));
moment_1.default.locale('es');
// Modelo
const pedidoModel_1 = __importDefault(require("../models/pedidoModel"));
// Clases
const bitacoraClass_1 = require("./bitacoraClass");
// Funciones
const castEstado_1 = require("../functions/castEstado");
class PedidosClass {
    constructor() {
        this.pathIds = `pedidosIDs.json`;
        this.idRef = (0, nanoid_1.nanoid)(10);
    }
    crearPedido(req, resp) {
        const idCreador = req.usuario._id;
        const idReferencia = this.idRef;
        const fecha_alta = (0, moment_1.default)().format('YYYY-MM-DD');
        // const fecha_alta = moment().format('2021-04-15');
        const fecha_entrega = (0, moment_1.default)().add(3, 'days').format('YYYY-MM-DD');
        const cliente = req.get('cliente');
        const sucursal = req.get('sucursal');
        const origenPedido = req.get('origen');
        const crearNuevoPedido = new pedidoModel_1.default({
            idCreador: idCreador,
            idReferencia: idReferencia,
            fecha_alta: fecha_alta,
            fecha_entrega: fecha_entrega,
            cliente: cliente,
            sucursal: sucursal,
            origen_pedido: origenPedido
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
    }
    editarPedido(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.get('id');
            const sucursal = req.body.sucursal;
            const etapa_pedido = req.body.etapa_pedido;
            const prioridad_pedido = req.body.prioridad_pedido;
            const asignado_a = req.body.asignado_a;
            const estado_pedido = req.body.estado_pedido;
            const itbms = req.body.itbms;
            let montoItbms = 0;
            let total = 0;
            const estadoHeader = req.get('estado');
            const estado = (0, castEstado_1.castEstado)(estadoHeader);
            const itbm_s = (0, castEstado_1.castITBMS)(itbms);
            const bitacora = new bitacoraClass_1.BitacoraClass();
            const pedidoDB = yield pedidoModel_1.default.findById(id)
                .populate('sucursal')
                .populate('etapa_pedido')
                .populate('prioridad_pedido')
                .populate('asignado_a')
                .exec();
            if (pedidoDB.productos_pedidos.length <= 0) {
                return resp.json({
                    ok: false,
                    mensaje: `Debe agregar un producto para poder editar un pedido`
                });
            }
            if (pedidoDB.itbms !== itbm_s) {
                // Existen pagos
                if (pedidoDB.pagos_pedido.length > 0) {
                    return resp.json({
                        ok: false,
                        mensaje: `No puede editar el pedido ya que existen pagos registrados`
                    });
                }
            }
            const query = {
                sucursal: sucursal,
                etapa_pedido: etapa_pedido,
                prioridad_pedido: prioridad_pedido,
                asignado_a: asignado_a,
                estado: estado,
                estado_pedido: estado_pedido,
                itbms: itbms
            };
            if (!query.sucursal) {
                query.sucursal = pedidoDB.sucursal;
            }
            if (!query.etapa_pedido) {
                query.etapa_pedido = pedidoDB.etapa_pedido;
            }
            if (!query.prioridad_pedido) {
                query.prioridad_pedido = pedidoDB.prioridad_pedido;
            }
            if (!query.asignado_a) {
                query.asignado_a = pedidoDB.asignado_a;
            }
            if (!query.estado) {
                query.estado = pedidoDB.estado;
            }
            if (!query.itbms) {
                query.itbms = pedidoDB.itbms;
            }
            else {
                if (itbm_s === true) {
                    montoItbms = parseFloat((pedidoDB.subtotal * 0.07).toFixed(2));
                    total = parseFloat((pedidoDB.subtotal + montoItbms).toFixed(2));
                    Object.assign(query, { monto_itbms: montoItbms, total: total });
                }
                else if (itbm_s === false) {
                    Object.assign(query, { monto_itbms: 0, total: (pedidoDB.subtotal + 0) });
                }
            }
            if (!query.estado_pedido) {
                query.estado_pedido = pedidoDB.estado_pedido;
            }
            pedidoModel_1.default.findByIdAndUpdate(id, query, { new: true })
                .populate('sucursal')
                .populate('etapa_pedido')
                .populate('prioridad_pedido')
                .populate('asignado_a')
                .exec((err, pedidoActualizadoDB) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    return resp.json({
                        ok: false,
                        mensaje: `Error interno`,
                        err
                    });
                }
                if (query.sucursal) {
                    yield bitacora.crearBitacora(req, `Cambió sucursal del pedido a ${pedidoActualizadoDB.sucursal.nombre}`, pedidoDB._id);
                }
                if (query.etapa_pedido) {
                    yield bitacora.crearBitacora(req, `Cambió etapa del pedido a ${pedidoActualizadoDB.etapa_pedido.nombre}`, pedidoDB._id);
                }
                if (query.prioridad_pedido) {
                    yield bitacora.crearBitacora(req, `Cambió la prioridad del pedido a ${pedidoActualizadoDB.prioridad_pedido.nombre}`, pedidoDB._id);
                }
                if (query.asignado_a) {
                    yield bitacora.crearBitacora(req, `Asginó el pedido a ${pedidoActualizadoDB.asignado_a.nombre}`, pedidoDB._id);
                }
                if (query.estado_pedido) {
                    yield bitacora.crearBitacora(req, `Cambió el estado del pedido a ${pedidoActualizadoDB.estado_pedido}`, pedidoDB._id);
                }
                return resp.json({
                    pedidoActualizadoDB,
                    // pedidoDB: pedidoDB
                });
            }));
        });
    }
    obtenerPedidoID(req, resp) {
        const id = req.get('id');
        pedidoModel_1.default.findById(id)
            .populate('idCreador', 'nombre apellido colaborador_role')
            .populate({ path: 'archivos', populate: { path: 'idCreador', select: 'nombre' } })
            .populate('etapa_pedido', 'nombre')
            .populate('prioridad_pedido', 'nombre color_prioridad')
            .populate({ path: 'productos_pedidos', populate: { path: 'producto' } })
            .populate({ path: 'productos_pedidos', populate: { path: 'producto' } })
            .populate('pagos_pedido')
            .populate('cliente')
            .populate('asignado_a')
            .populate('sucursal')
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
            return resp.json({
                ok: true,
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
    obtenerTodos(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const estadoHeader = req.get('estado');
            const estado = (0, castEstado_1.castEstado)(estadoHeader);
            const fecha_actual = (0, moment_1.default)().format('YYYY-MM-DD');
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
                    $match: { estado: estado }
                },
                {
                    $sort: { 'PrioridadPedido.importancia': 1, fecha_actual: 1 }
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
                    pedidoDB: respPedido,
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
            const estadoHeader = req.get('estado');
            const estado = (0, castEstado_1.castEstado)(estadoHeader);
            const role = req.usuario.colaborador_role;
            const sucursalCol = req.usuario.sucursal;
            const match = {
                $match: {}
            };
            if (role === environment_1.environmnet.colRole.VendedorNormalRole) {
                match.$match = { 'Sucursal._id': new mongoose.Types.ObjectId(sucursalCol), estado: estado };
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
}
exports.PedidosClass = PedidosClass;
/*
           1. Asignado a
           2. etapa
           3. Evitar que otro usuario se le asigne el mismo pedido
       */ 