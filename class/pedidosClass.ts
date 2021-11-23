import { Response } from 'express';
import { CallbackError, Mongoose } from 'mongoose';
const mongoose = require('mongoose');
// import { nanoid } from 'nanoid';
import { customAlphabet } from 'nanoid';
import { environmnet } from '../environment/environment';

import moment from 'moment';
moment.locale('es');

// Modelo
import pedidoModel from '../models/pedidoModel';

// Interface
import { PedidoModelInterface } from '../interfaces/pedidos';

// Clases
import { BitacoraClass } from './bitacoraClass';

// Funciones
import { castEstado, castITBMS } from '../functions/castEstado';

export class PedidosClass {

    private idRef: any;
    private pathIds = `pedidosIDs.json`;

    constructor() {
        // this.idRef = nanoid(10);
        this.idRef = customAlphabet('1234567890', 9);
    }

    crearPedido(req: any, resp: Response): void {


        const idCreador = req.usuario._id;
        // const idReferencia = this.idRef;
        const idReferencia = this.idRef();
        const fecha_alta = moment().format('YYYY-MM-DD');
        // const fecha_alta = moment().format('2021-04-15');
        // const fecha_entrega = moment().add(3, 'days').format('YYYY-MM-DD');
        const fecha_entrega = req.body.fecha_entrega;
        const cliente = req.get('cliente');
        const sucursal = req.get('sucursal');
        const vendedor = req.get('vendedor');
        // const origenPedido = req.get('origen');

        const crearPedido = () => {

            const crearNuevoPedido = new pedidoModel({

                idCreador: idCreador,
                idReferencia: idReferencia,
                fecha_alta: fecha_alta,
                fecha_entrega: fecha_entrega,
                cliente: cliente,
                sucursal: sucursal,
                // asignado_a: vendedor
                // origen_pedido: origenPedido

            });

            crearNuevoPedido.save(async (err: CallbackError, pedidoDB: PedidoModelInterface) => {

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

            });
        }


        pedidoModel.find({ cliente: cliente }, (err: any, pedidosDB: Array<PedidoModelInterface>) => {

            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }

            if (pedidosDB.length === 0) {
                crearPedido();
            } else {
                const hayPendientes = pedidosDB.find((pedido) => pedido.etapa_pedido === 0);

                if (hayPendientes) {
                    // console.log('hay pendientes');
                    return resp.json({
                        ok: false,
                        mensaje: `Este cliente tiene pedidos pendientes`
                    })
                } else {
                    // console.log('no hay pendientes');
                    crearPedido();
                }
            }
        });
    }

    async editarPedido(req: any, resp: Response): Promise<any> {

        // cargar los usuarios workers de la sucursal del pedido
        // todas las bandeja de produccion tienen la etapa produccion
        // todo va guardado basado en la sucursal

        const id = new mongoose.Types.ObjectId(req.get('id'));
        const sucursal = req.body.sucursal;
        const etapa_pedido = req.body.etapa_pedido;
        const prioridad_pedido = req.body.prioridad_pedido;
        const asignado_a = req.body.asignado_a;
        const estado_pedido = req.body.estado_pedido;
        const origen_pedido = req.body.origen_pedido;
        const fecha_entrega = req.body.fecha_entrega;
        const itbms = req.body.itbms;

        let montoItbms: number = 0;
        let total: number = 0;

        // const estadoHeader: string = req.get('estado');
        // const estado: boolean = castEstado(estadoHeader);
        // const itbm_s: boolean = castITBMS(itbms);

        const bitacora = new BitacoraClass();

        const pedidoDB: any = await pedidoModel.findById(id)
            .populate('sucursal')
            // .populate('etapa_pedido')
            // .populate('prioridad_pedido')
            .populate('asignado_a')
            .populate('origen_pedido')
            .populate('productos_pedidos')
            .exec();

        // if (pedidoDB.productos_pedidos.length <= 0) {

        //     return resp.json({
        //         ok: false,
        //         mensaje: `Debe agregar un producto para poder editar un pedido`
        //     });
        // }

        // if (pedidoDB.itbms !== itbm_s) {

        //     // Existen pagos
        //     if (pedidoDB.pagos_pedido.length > 0) {
        //         return resp.json({
        //             ok: false,
        //             mensaje: `No puede editar el pedido ya que existen pagos registrados`
        //         });
        //     }
        // }

        const query = {
            sucursal: sucursal,
            etapa_pedido: etapa_pedido,
            prioridad_pedido: prioridad_pedido,
            asignado_a: asignado_a,
            // estado: estado,
            estado_pedido: estado_pedido,
            origen_pedido: origen_pedido,
            fecha_entrega: fecha_entrega,
            itbms: itbms
        }

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

        // if (!query.estado) {
        //     query.estado = pedidoDB.estado;
        // }

        // if (!query.itbms) {
        //     query.itbms = pedidoDB.itbms;
        // } else {

        //     if (itbm_s === true) {

        //         montoItbms = parseFloat((pedidoDB.subtotal * 0.07).toFixed(2));
        //         total = parseFloat((pedidoDB.subtotal + montoItbms).toFixed(2));
        //         Object.assign(query, { monto_itbms: montoItbms, total: total });

        //     } else if (itbm_s === false) {

        //         Object.assign(query, { monto_itbms: 0, total: (pedidoDB.subtotal + 0) });
        //     }
        // }

        if (!query.estado_pedido) {
            query.estado_pedido = pedidoDB.estado_pedido;
        }

        if (!query.origen_pedido) {
            query.origen_pedido = pedidoDB.origen_pedido;
        }

        if (!query.fecha_entrega) {
            query.fecha_entrega = pedidoDB.fecha_entrega;
        }

        // if (!query.itbms) {
        //     query.itbms = pedidoDB.itbms;
        // }

        // console.log(itbms);



        pedidoModel.findByIdAndUpdate(id, query, { new: true })
            .populate('sucursal')
            // .populate('etapa_pedido')
            // .populate('prioridad_pedido')
            .populate('asignado_a')
            .populate('origen_pedido')
            .populate('productos_pedidos')
            .exec(async (err: CallbackError, pedidoDB: PedidoModelInterface | any) => {

                if (err) {
                    return resp.json({
                        ok: false,
                        mensaje: `Error interno`,
                        err
                    });
                }

                if (query.sucursal) {
                    await bitacora.crearBitacora(req, `Cambió sucursal del pedido a ${pedidoDB.sucursal.nombre}`, pedidoDB._id);
                }

                if (query.etapa_pedido) {
                    await bitacora.crearBitacora(req, `Cambió etapa del pedido a ${pedidoDB.etapa_pedido.nombre}`, pedidoDB._id);
                }

                if (query.prioridad_pedido) {
                    await bitacora.crearBitacora(req, `Cambió la prioridad del pedido a ${pedidoDB.prioridad_pedido.nombre}`, pedidoDB._id);
                }

                if (query.asignado_a) {
                    await bitacora.crearBitacora(req, `Asginó el pedido a ${pedidoDB.asignado_a.nombre}`, pedidoDB._id);
                }

                if (query.estado_pedido) {
                    await bitacora.crearBitacora(req, `Cambió el estado del pedido a ${pedidoDB.estado_pedido}`, pedidoDB._id);
                }

                return resp.json({
                    ok: true,
                    mensaje: 'Pedido actualizado',
                    pedidoDB,
                    // pedidoDB: pedidoDB
                });
            });
    }

    obtenerPedidoID(req: any, resp: Response): void {
        const id = req.get('id');


        pedidoModel.findById(id)
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
            .exec((err: CallbackError, pedidoDB: any) => {

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

    eliminarPedidoID(req: any, resp: Response): void {

        const id = req.get('id');

        pedidoModel.findByIdAndDelete(id)
            .exec(async (err: CallbackError, pedidoDB: any) => {

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
            });
    }

    // async obtenerPedidosCriterio(req: any, resp: Response): Promise<any> {

    //     const id = req.get('criterio');
    //     const nombreCliente = req.get('criterio');
    //     const telefono = req.get('criterio');
    //     const diseniador = req.get('criterio');


    //     pedidoModel.find({ $or: [{ idReferencia: id }, { 'cliente.nombre': nombreCliente }, { 'cliente.telefono': telefono }] })
    //         .populate('cliente')
    //         .exec((err: any, pedidosDB: Array<any>) => {

    //             if (err) {
    //                 return resp.json({
    //                     ok: false,
    //                     mensaje: `Error interno`,
    //                     err
    //                 });
    //             }

    //             return resp.json({
    //                 ok: true,
    //                 pedidosDB: pedidosDB,
    //                 cantidad: pedidosDB.length
    //             });
    //         });

    //     // if (!pedidosDB || pedidosDB.length === 0) {

    //     //     return resp.json({
    //     //         ok: false,
    //     //         mensaje: `No se encontraron pedidos`
    //     //     });

    //     // } else {
    //     //     return resp.json({
    //     //         ok: true,
    //     //         pedidosDB: pedidosDB,
    //     //         cantidad: pedidosDB.length
    //     //     });
    //     // }

    // }

    async obtenerTodos(req: any, resp: Response): Promise<any> {

        // const estadoHeader: string = req.get('estado');
        // const estado: boolean = castEstado(estadoHeader);

        // const fecha_actual: string = moment().format('YYYY-MM-DD');
        const respPedido = await pedidoModel.aggregate([
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
            })

        } else {

            return resp.json({
                ok: true,
                pedidosDB: respPedido,
                cantidad: respPedido.length
            });

        }
    }

    async obtenerDisenio(req: any, resp: Response, idColaborador: any): Promise<any> { // Disenio Grafico

        const estadoHeader: string = req.get('estado');
        const estado: boolean = castEstado(estadoHeader);

        const resPedido = await pedidoModel.aggregate([
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

        } else {
            return resp.json({
                ok: true,
                resPedido: resPedido,
                cantidad: resPedido.length
            });
        }
    }

    async obtenerProduccion(req: any, resp: Response, idColaborador: any): Promise<any> { // Produccion

        const estadoHeader: string = req.get('estado');
        const estado: boolean = castEstado(estadoHeader);

        const role = req.usuario.colaborador_role;
        const sucursalCol = req.usuario.sucursal;
        const match: any = {
            $match: {}
        };

        if (role === environmnet.colRole.produccionNormal) {

            match.$match = { 'EtapaPedido.nombre': 'Producción', 'Sucursal._id': new mongoose.Types.ObjectId(sucursalCol), estado: estado }

        } else if (role === environmnet.colRole.produccionVIP) {

            match.$match = { 'EtapaPedido.nombre': 'Producción', estado: estado }

        }

        const resPedido = await pedidoModel.aggregate([
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

        } else {
            return resp.json({
                ok: true,
                resPedido: resPedido,
                cantidad: resPedido.length
            });
        }
    }

    async obtenerVendedor(req: any, resp: Response): Promise<any> { // Produccion

        const estadoHeader: string = req.get('estado');
        const estado: boolean = castEstado(estadoHeader);

        const role = req.usuario.colaborador_role;
        const sucursalCol = req.usuario.sucursal;
        const match: any = {
            $match: {}
        };

        if (role === environmnet.colRole.VendedorNormalRole) {

            match.$match = { 'Sucursal._id': new mongoose.Types.ObjectId(sucursalCol), estado: estado }

        }

        const resPedido = await pedidoModel.aggregate([
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

        } else {
            return resp.json({
                ok: true,
                resPedido: resPedido,
                cantidad: resPedido.length
            });
        }
    }

    async obtenerEtapa(req: any, resp: Response): Promise<any> { // Produccion, Diseñador

        const estadoHeader: string = req.get('estado');
        const estado: boolean = castEstado(estadoHeader);

        const idColaborador = req.get('idColaborador');
        const nombreEtapaPedido = req.get('nombreEtapaPedido');

        // const fecha_actual: string = moment().format('YYYY-MM-DD');

        const resPedido = await pedidoModel.aggregate([
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

        } else {
            return resp.json({
                ok: true,
                resPedido: resPedido,
                cantidad: resPedido.length
            });
        }

    }

    redireccionBandejas(req: any, resp: Response): void {

        const role: string = req.usuario.colaborador_role;
        const idColaborador: any = req.usuario._id;

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

    async busquedaBandeja(req: any, resp: Response): Promise<any> {

        // const estadoHeader: string = req.get('estado');
        // const estado: boolean = castEstado(estadoHeader);

        const role = req.get('colRole');
        const userID = req.get('userID');
        const sucursal = req.get('sucursal');
        const bandejas = req.get('bandejas');
        const match: any = {
            $match: {}
        };

        if (bandejas === 'null' && userID === 'null' && sucursal === 'null') {
            match.$match;
        }

        if (bandejas === 'null' && userID !== 'null' && sucursal !== 'null') {
            match.$match = { $and: [{ 'Sucursal._id': new mongoose.Types.ObjectId(sucursal) }, { 'AsignadoA._id': new mongoose.Types.ObjectId(userID) }, { 'AsignadoA.colaborador_role': role }] }
        }

        if (bandejas !== 'null' && userID === 'null' && sucursal === 'null') {

            switch (bandejas) {
                case 'prod':
                    match.$match = { 'etapa_pedido': 2 }
                    break;
                case 'vend':
                    match.$match = { $or: [{ 'IDCreador.colaborador_role': 'VendedorVIPRole' }, { 'IDCreador.colaborador_role': 'VendedorNormalRole' }] }
                    break;
                case 'dise':
                    match.$match = { 'AsignadoA.colaborador_role': 'DiseniadorRole' }
                    break;
                case 'admin':
                    match.$match = { 'IDCreador.colaborador_role': 'AdminRole' }
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
                    match.$match = { $and: [{ $or: [{ 'IDCreador.colaborador_role': 'VendedorVIPRole' }, { 'IDCreador.colaborador_role': 'VendedorNormalRole' }] }, { 'IDCreador._id': new mongoose.Types.ObjectId(userID) }] }
                    break;
                case 'dise':
                    match.$match = { 'AsignadoA._id': new mongoose.Types.ObjectId(userID) }
                    break;
                case 'admin':
                    match.$match = { 'IDCreador._id': new mongoose.Types.ObjectId(userID) }
                    break;
            }
        }

        if (bandejas !== 'null' && userID === 'null' && sucursal !== 'null') {

            switch (bandejas) {
                case 'prod':
                    match.$match = { $and: [{ 'etapa_pedido': 2 }, { 'Sucursal._id': new mongoose.Types.ObjectId(sucursal) }] }
                    break;
                case 'vend':
                    match.$match = { $and: [{ $or: [{ 'IDCreador.colaborador_role': 'VendedorVIPRole' }, { 'IDCreador.colaborador_role': 'VendedorNormalRole' }] }, { 'Sucursal._id': new mongoose.Types.ObjectId(sucursal) }] }
                    break;
                case 'dise':
                    match.$match = { $and: [{ 'AsignadoA.colaborador_role': 'DiseniadorRole' }, { 'Sucursal._id': new mongoose.Types.ObjectId(sucursal) }] }
                    break;
                case 'admin':
                    match.$match = { $and: [{ 'IDCreador.colaborador_role': 'AdminRole' }, { 'Sucursal._id': new mongoose.Types.ObjectId(sucursal) }] }
                    break;
            }
        }

        if (sucursal !== 'null' && userID === 'null' && bandejas === 'null') {
            match.$match = { 'Sucursal._id': new mongoose.Types.ObjectId(sucursal) }
        }

        if (bandejas === 'null' && userID !== 'null' && sucursal === 'null') {
            match.$match = { $and: [{ 'AsignadoA._id': new mongoose.Types.ObjectId(userID) }, { 'AsignadoA.colaborador_role': role }] }
        }

        if (sucursal !== 'null' && userID !== 'null' && bandejas !== 'null') {
            switch (bandejas) {
                case 'prod':
                    match.$match = { $and: [{ 'etapa_pedido': 2 }, { 'Sucursal._id': new mongoose.Types.ObjectId(sucursal) }] }
                    break;
                case 'vend':
                    match.$match = { $and: [{ 'IDCreador._id': new mongoose.Types.ObjectId(userID) }, { 'Sucursal._id': new mongoose.Types.ObjectId(sucursal) }] }
                    break;
                case 'dise':
                    match.$match = { $and: [{ 'AsignadoA.colaborador_role': 'DiseniadorRole' }, { 'Sucursal._id': new mongoose.Types.ObjectId(sucursal) }] }
                    break;
                case 'admin':
                    match.$match = { $and: [{ 'IDCreador.colaborador_role': 'AdminRole' }, { 'Sucursal._id': new mongoose.Types.ObjectId(sucursal) }] }
                    break;
            }
            // match.$match = { $and: [{ 'AsignadoA._id': new mongoose.Types.ObjectId(userID) }, { 'AsignadoA.colaborador_role': role }, { 'Sucursal._id': new mongoose.Types.ObjectId(sucursal) }] }
        }

        const pedidosDB = await pedidoModel.aggregate([
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

        } else {
            return resp.json({
                ok: true,
                pedidosDB: pedidosDB,
                cantidad: pedidosDB.length
            });
        }

    }
}

// Interfaz para manejar los datos del archivo usuariosIDs.json
interface Archivo {
    ids: Array<string>
}

interface RespPromise {
    ok: boolean;
    data: string;
}

/*
           1. Asignado a
           2. etapa
           3. Evitar que otro usuario se le asigne el mismo pedido
       */