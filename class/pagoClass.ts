import { Response } from 'express';
import { CallbackError } from 'mongoose';
import moment from 'moment';
import { UploadedFile } from 'express-fileupload';
moment.locale('es');

// Intefaces
import { PagoInterface } from '../interfaces/pago';
import { PedidoModelInterface } from '../interfaces/pedidos';

// Modelos
import pagosModel from '../models/pagosModel';
import pedidoModel from '../models/pedidoModel';

// Funciones externas
import { eliminarArchivo, extraerArchivo, subirArchivo } from '../functions/archivos';
import Server from './server';

export class PagoClass {

    constructor() { }

    crearPago(req: any, resp: Response): void {

        const pedido = req.get('pedido');

        pedidoModel.findOne({ _id: pedido })
            .populate('pagos_pedido')
            .populate({ path: 'productos_pedidos', populate: { path: 'producto' } })
            .populate('cliente')
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
                        mensaje: `No se encontró un pedido para agregar pagos`
                    });
                }

                if (pedidoDB.productos_pedidos.length <= 0) {

                    return resp.json({
                        ok: false,
                        mensaje: `Debe agregar un producto para poder realizar un pago`
                    });
                }

                // Cuando no hay productos pedidos
                const productosPedidos: Array<any> = pedidoDB.productos_pedidos;
                const pagosPedidos: Array<any> = pedidoDB.pagos_pedido;

                if (!productosPedidos || productosPedidos.length === 0) {

                    return resp.json({
                        ok: false,
                        mensaje: `Debe agregar un producto para poder crear un pago`
                    });

                } else {

                    // Cuando no hay pagos
                    if (!pagosPedidos || pagosPedidos.length === 0) {

                        console.log('Ingresar el primer pago');
                        this.ingresarPago(req, resp, pedidoDB, false, pedido);

                    } else {

                        console.log('Existen pagos - agregar mas');
                        this.ingresarPago(req, resp, pedidoDB, true, pedido);

                    }
                }

            });
    }

    async ingresarPago(req: any, resp: Response, pedidoDB: PedidoModelInterface, existenPagos: boolean, idPedido: any): Promise<any> {

        const idCreador = req.usuario._id;
        const metodo = req.get('metodo'); // id del metodo de pago
        const monto = Number(req.body.monto);
        // const monto: number = parseFloat(montoBody.toFixed(2));
        const modalidad = req.body.modalidad;
        // const files: UploadedFile = req.files;
        const fecha = moment().format('YYYY-MM-DD');

        const query = {};

        const nuevoPago = new pagosModel({
            idCreador: idCreador,
            metodo: metodo,
            monto: monto,
            modalidad: modalidad,
            fecha: fecha,
        });

        nuevoPago.save((err: CallbackError, pagoDB: PagoInterface) => {

            if (err) {
                // Eliminar pago de pedidos
                return resp.json({
                    ok: false,
                    mensaje: `No se pudo realizar el pago`,
                    err
                });
            }

            pedidoModel.findByIdAndUpdate(idPedido, { $push: { pagos_pedido: pagoDB._id } }, { new: true })
                .populate('pagos_pedido')
                .populate('productos_pedidos')
                .populate('sucursal')
                .exec(async (err: CallbackError, pedidoDB: any) => {

                    if (err) {
                        return resp.json({
                            ok: false,
                            mensaje: `No se pudo agregar el pago al pedido`,
                            err
                        });
                    }

                    const server = Server.instance;
                    server.io.emit('recibir-pagos', { ok: true, pedidoDB: pedidoDB });

                    return resp.json({
                        ok: true,
                        mensaje: 'Pedidos ok',
                        pedidoDB
                    });
                });
        });


        // console.log(files);
        // return;

        // const respArch: RespPromise = await extraerArchivo(files);

        // if (respArch.ok === false) {

        //     return resp.json({
        //         ok: false,
        //         mensaje: respArch.mensaje
        //     });

        // } else {


        //     const file = respArch.data;
        //     const resArch: RespPromise = await subirArchivo(file, req); // Recibo nombre del archivo

        //     if (resArch.ok === false) {

        //         return resp.json({
        //             ok: false,
        //             mensaje: resArch.mensaje
        //         });

        //     } else {

        //         let total: number = 0;
        //         const nombre_archivo = resArch.mensaje;

        //         const nuevoPago = new pagosModel({
        //             idCreador: idCreador,
        //             metodo: metodo,
        //             monto: monto,
        //             modalidad: modalidad,
        //             fecha: fecha,
        //             // nombre_archivo: resArch.mensaje
        //         });

        //         if (isNaN(monto) || monto < 0) {
        //             eliminarArchivo(nombre_archivo);

        //             return resp.json({
        //                 ok: false,
        //                 mensaje: `Debe ingresar un monto`
        //             });
        //         }

        //         total = parseFloat((pedidoDB.total - monto).toFixed(2));
        //         // total -= monto;

        //         if (total < 0.00) {

        //             eliminarArchivo(nombre_archivo);
        //             return resp.json({
        //                 ok: false,
        //                 mensaje: `El monto de pago (${monto.toFixed(2)}) supera el total pendiente, Total pendiente: ${(pedidoDB.total).toFixed(2)}`
        //             });

        //         } else {

        //             nuevoPago.save((err: CallbackError, pagoDB: PagoInterface) => {

        //                 if (err) {
        //                     // Eliminar pago de pedidos
        //                     return resp.json({
        //                         ok: false,
        //                         mensaje: `No se pudo realizar el pago`,
        //                         err
        //                     });
        //                 }

        //                 Object.assign(query, { $push: { pagos_pedido: pagoDB._id }, total: total, monto_itbms: 0, subtotal: 0 });

        //                 pedidoModel.findByIdAndUpdate(idPedido, query, { new: true })
        //                     .populate('pagos_pedido')
        //                     .exec(async (err: CallbackError, pedidoActualizadoDB: any) => {

        //                         if (err) {
        //                             return resp.json({
        //                                 ok: false,
        //                                 mensaje: `No se pudo agregar el pago al pedido`,
        //                                 err
        //                             });
        //                         }

        //                         return resp.json({
        //                             ok: true,
        //                             pedidoActualizadoDB
        //                         });
        //                     });
        //             });
        //         }
        //     }
        // }
    }

    obtenerPagoID(req: any, resp: Response): void {

        const id = req.get('id');
        const pedido = req.get('pedido');

        pedidoModel.findById(pedido, (err: CallbackError, pedidoDB: PedidoModelInterface) => {

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
                    mensaje: `No se encontró ningún pedido`
                });
            }

            pagosModel.findById(id, (err: CallbackError, pagoDB: PagoInterface) => {

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
                        mensaje: `No se encontró ningún pedido`
                    });
                }

                return resp.json({
                    ok: true,
                    pagoDB
                });
            });

        });

    }

    deshabilitarPago(req: any, resp: Response): any {

        const id = req.get('id');
        const pedido = req.get('pedido');
        let saldo: number = 0;
        let estado: any = req.body.estado;
        const motivo: string = req.body.motivo;


        if (estado === 'false') {
            estado = false;
        } else if (estado === 'true') {
            estado = true;
        } else {
            return resp.json({
                ok: false,
                mensaje: `Debe ingresar un estado`
            });
        }

        pedidoModel.findById(pedido, (err: CallbackError, pedidoDB: PedidoModelInterface) => {

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

            pagosModel.findById(id, (err: CallbackError, pagoDB: PagoInterface) => {

                let total: number = 0;

                if (err) {
                    return resp.json({
                        ok: false,
                        mensaje: `Error interno`,
                        err
                    });
                }

                if (!pagoDB) {
                    return resp.json({
                        ok: false,
                        mensaje: `No se encontró un pago`
                    });
                }

                const eventoPago = {
                    estadoPago: ''
                }

                // Cuando el pago va a ser habilitado
                if (pagoDB.estado === false && estado === false) {

                    return resp.json({
                        ok: false,
                        mensaje: `El pago ya está deshabilitado`
                    });

                } else if (pagoDB.estado === false && estado === true) {

                    // saldo = pedidoDB.total - pagoDB.monto;
                    total = parseFloat((total + pagoDB.monto).toFixed(2));
                }

                // Cuando el pago va a ser deshabilitado
                if (pagoDB.estado === true && estado === true) {

                    return resp.json({
                        ok: false,
                        mensaje: `El pago ya está habilitado`
                    });

                } else if (pagoDB.estado === true && estado === false) {

                    if (!motivo) {
                        return resp.json({
                            ok: false,
                            mensaje: `Es necesario que escriba un motivo`
                        });
                    }

                    // saldo = pedidoDB.saldo + pagoDB.monto;
                    total = parseFloat((pedidoDB.total - pagoDB.monto).toFixed(2));

                }

                pagosModel.findByIdAndUpdate(id, { estado: estado, motivo: motivo }, { new: true }, (err: CallbackError, pagoActualizadoDB: any) => {

                    if (err) {
                        return resp.json({
                            ok: false,
                            mensaje: `Error interno`,
                            err
                        });
                    }

                    pedidoModel.findByIdAndUpdate(pedido, { total: total }, { new: true })
                        .exec(async (err: CallbackError, pedidoActualizadoDB: any) => {

                            if (err) {
                                return resp.json({
                                    ok: false,
                                    mensaje: `Error interno`,
                                    err
                                });
                            }

                            return resp.json({
                                ok: true,
                                pedidoActualizadoDB,
                                pagoActualizadoDB
                            });
                        });

                });


            });

        });
    }

    obtenerPagos(req: any, resp: Response): any {

        pagosModel.find({})
            .populate('idCreador')
            .populate('metodo')
            .exec((err: any, pagosDB: Array<any>) => {

                if (err) {
                    return resp.json({
                        ok: false,
                        mensaje: 'Error interno',
                        err
                    });
                }

                return resp.json({
                    ok: true,
                    pagosDB
                });
            });

    }

    obtenerPagosPorPedido(req: any, resp: Response) {

        const pedido = req.get('pedido');

        pedidoModel.findById(pedido)
            .populate({ path: 'productos_pedidos', populate: { path: 'producto' } })
            .populate('pagos_pedido')
            .populate({ path: 'pagos_pedido', populate: { path: 'idCreador' } })
            .populate({ path: 'pagos_pedido', populate: { path: 'metodo' } })
            .exec((err: any, pedidoDB: any) => {

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
                    pedidoDB: pedidoDB
                });

            });
    }
}


interface RespPromise {
    ok: boolean;
    mensaje: string;
    data: File | any;
}