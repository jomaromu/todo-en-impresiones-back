import { Request, Response } from 'express';
import { CallbackError } from 'mongoose';

// Clases
import { BitacoraClass } from './bitacoraClass';

// Modelos
import productoPedidoModel from '../models/productoPedidoModel';
import pedidoModel from '../models/pedidoModel';
import productModel from '../models/productModel';


// Interface
import { ProductoPedidoInterface } from '../interfaces/pedidos';
import { PedidoModelInterface } from '../interfaces/pedidos';


export class ProductoPedido {

    constructor() { }

    crearProductoPedido(req: any, resp: Response): void {

        const cantidad = Number(req.body.cantidad);
        const producto = req.get('producto');
        const precio = Number(req.body.precio);
        const pedido = req.get('pedido');

        pedidoModel.findById(pedido)
            .populate({ path: 'productos_pedidos' })
            .populate({ path: 'pagos_pedido' })
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
                        mensaje: `No se encontró un pedido para agregar un producto`
                    });
                }

                const productosPedidos: Array<any> = pedidoDB.productos_pedidos;

                // Si no hay productos pedidos
                if (productosPedidos.length === 0 || !productosPedidos) {

                    this.ingresarProductoPedido(req, resp, producto, cantidad, false, pedido, pedidoDB, precio);

                } else {

                    this.ingresarProductoPedido(req, resp, producto, cantidad, true, pedido, pedidoDB, precio);

                }

            });
    }

    editarProductoPedido(req: any, resp: Response): void {

        const id = req.get('id');

        productoPedidoModel.findById(id, (err: CallbackError, productoPedidoDB: ProductoPedidoInterface) => {

            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }

            if (!productoPedidoDB) {
                return resp.json({
                    ok: false,
                    mensaje: `No se encontró un producto pedido`
                });
            }

            const query = {
                seguimiento_disenio: req.body.seguimiento_disenio,
                seguimiento_produccion: req.body.seguimiento_produccion,
            }

            if (!query.seguimiento_disenio) {
                query.seguimiento_disenio = productoPedidoDB.seguimiento_disenio;
            }

            if (!query.seguimiento_produccion) {
                query.seguimiento_produccion = productoPedidoDB.seguimiento_produccion;
            }

            productoPedidoModel.findByIdAndUpdate(id, query, { new: true }, async (err: CallbackError, productoPedidoActualizadoDB: any) => {

                if (err) {
                    return resp.json({
                        ok: false,
                        mensaje: `Error interno`,
                        err
                    });
                }

                if (!productoPedidoActualizadoDB) {
                    return resp.json({
                        ok: false,
                        mensaje: `No se encontró un producto pedido con ese ID`
                    });
                }

                return resp.json({
                    ok: true,
                    productoPedidoActualizadoDB
                });
            });
        });
    }

    obtenerProductoPedido(req: any, resp: Response): void {

        const id = req.get('id');

        productoPedidoModel.findById(id)
            .populate('producto')
            .exec((err: CallbackError, productoPedidoDB: any) => {

                if (err) {
                    return resp.json({
                        ok: false,
                        mensaje: `Error interno`,
                        err
                    });
                }

                if (!productoPedidoDB) {
                    return resp.json({
                        ok: false,
                        mensaje: `No se encontró un producto pedido con ese ID`
                    });
                }

                return resp.json({
                    ok: true,
                    productoPedidoDB
                });
            });
    }

    obtenerPorPedido(req: any, resp: Response): void {

        const pedido = req.get('pedido');

        pedidoModel.findById(pedido)
            .populate('productos_pedidos')
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

    eliminarProductoPedido(req: any, resp: Response): void {

        const id = req.get('id');
        const pedido = req.get('pedido');

        productoPedidoModel.findByIdAndDelete(id, {}, (err: CallbackError, productoPedidoBorrado: any) => {

            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }

            if (!productoPedidoBorrado) {
                return resp.json({
                    ok: false,
                    mensaje: `No se encontró un producto pedido **`
                });
            }

            pedidoModel.findById(pedido)
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
                            mensaje: `No se encontró un pedido para poder eliminar un producto`
                        });
                    }

                    const saldo = pedidoDB.saldo - productoPedidoBorrado.total;

                    pedidoModel.findByIdAndUpdate(pedido, { $pull: { productos_pedidos: id }, saldo: saldo }, { new: true })
                        .exec(async (err: CallbackError, pedidoActualizadoDB: any) => {

                            if (err) {
                                return resp.json({
                                    ok: false,
                                    mensaje: `Error interno`,
                                    err
                                });
                            }

                            const bitacora = new BitacoraClass();
                            await bitacora.crearBitacora(req, 'Eliminó un producto', pedidoDB._id);

                            return resp.json({
                                ok: true,
                                pedidoActualizadoDB
                            });
                        });
                });

        });
    }

    inhabilitarProductoPedido(req: any, resp: Response): void {

        const id = req.get('id');
        const pedido = req.get('pedido');

        productoPedidoModel.findByIdAndUpdate(id, { inhabilitado: true }, { new: true }, (err: CallbackError, productoPedidoInhabilitado: any) => {

            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }

            if (!productoPedidoInhabilitado) {
                return resp.json({
                    ok: false,
                    mensaje: `No se encontró un producto pedido **`
                });
            }

            pedidoModel.findById(pedido)
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
                            mensaje: `No se encontró un pedido para poder eliminar un producto`
                        });
                    }

                    const saldo = pedidoDB.saldo - productoPedidoInhabilitado.total;

                    pedidoModel.findByIdAndUpdate(pedido, { $pull: { productos_pedidos: id }, saldo: saldo }, { new: true })
                        .exec(async (err: CallbackError, pedidoActualizadoDB: any) => {

                            if (err) {
                                return resp.json({
                                    ok: false,
                                    mensaje: `Error interno`,
                                    err
                                });
                            }

                            const bitacora = new BitacoraClass();
                            await bitacora.crearBitacora(req, 'Se inhabilitó un producto', pedidoDB._id);

                            return resp.json({
                                ok: true,
                                pedidoActualizadoDB
                            });
                        });
                });

        });
    }

    ingresarProductoPedido(req: any, resp: Response, idProducto: any, cantidad: number, existeProductoPedido: boolean, idPedido: any, pedidoDB: PedidoModelInterface, precio: number): any {

        const totalProductoPedido = cantidad * precio;
        let saldo = 0;

        if (isNaN(precio) || isNaN(cantidad)) {

            return resp.json({
                ok: false,
                mensaje: `Debe ingresar un precio y una cantidad`
            });
        }

        if (!idProducto) {

            return resp.json({
                ok: false,
                mensaje: `Debe ingresar un producto`
            });
        }

        productModel.findById(idProducto, (err: CallbackError, productoDB: any) => {

            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }

            if (!productoDB) {
                return resp.json({
                    ok: false,
                    mensaje: `No se econtró un producto para ingresar al pedido`
                });
            }

            const nuevoProductoPedido = new productoPedidoModel({

                cantidad: cantidad,
                precio: precio,
                total: totalProductoPedido,
                producto: idProducto
            });

            nuevoProductoPedido.save((err: CallbackError, productoPedidoDB: ProductoPedidoInterface) => {

                if (err) {
                    return resp.json({
                        ok: false,
                        mensaje: `Error interno`,
                        err
                    });
                }

                if (existeProductoPedido === false) { // Primer producto pedido

                    saldo = cantidad * precio;

                } else { // Existen más productos pedidos

                    const mapPrecios: Array<number> = pedidoDB.productos_pedidos.map((productoPedido: ProductoPedidoInterface) => {
                        return productoPedido.total;
                    });

                    const totalPrecios: number = mapPrecios.reduce((acc: number, current: number) => {
                        return acc + current;
                    });

                    const mapPagos: Array<number> = pedidoDB.pagos_pedido.map((pagoPedido: any) => {
                        return pagoPedido.monto;
                    });

                    let totalPagos: number = 0;

                    if (pedidoDB.pagos_pedido.length === 0) { // No hay pagos aún

                        totalPagos = 0;

                    } else {

                        totalPagos = mapPagos.reduce((acc: number, current: number) => {
                            return acc + current;
                        });
                    }

                    saldo = ((totalPrecios + totalProductoPedido) - totalPagos);
                }

                // return;
                // Actualizar el pedido
                pedidoModel.findByIdAndUpdate(idPedido, { $push: { productos_pedidos: productoPedidoDB._id }, saldo: saldo }, { new: true })
                    .populate({ path: 'productos_pedidos', populate: 'producto' })
                    .exec(async (err: CallbackError, pedidoActualizadoDB: any) => {

                        if (err) {
                            return resp.json({
                                ok: false,
                                mensaje: `Error interno`,
                                err
                            });
                        }

                        const bitacora = new BitacoraClass();
                        await bitacora.crearBitacora(req, 'Agregó un producto', pedidoDB._id);

                        return resp.json({
                            ok: true,
                            pedidoActualizadoDB
                        });
                    });
            });
        });
    }
}
