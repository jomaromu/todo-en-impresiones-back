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

        const cantidad = Math.floor(Number(req.body.cantidad));
        const producto = req.get('producto');
        const precio = Number(parseFloat(req.body.precio).toFixed(2));
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

                // Existen pagos
                // if (pedidoDB.pagos_pedido.length > 0) {
                //     return resp.json({
                //         ok: false,
                //         mensaje: `No puede agregar productos ya que existen pagos registrados`
                //     });
                // }

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
            .populate({ path: 'productos_pedidos', populate: { path: 'producto' } })
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

        let subtotalPedido: number = 0;
        let itbmsPedido: number = 0;
        let totalPedido: number = 0;

        let totalProductoPedido: number = 0;
        let itbmsProductoPedido: number = 0;
        const query = {};

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
                    mensaje: `No se encontró un producto pedido **`
                });
            }

            productoPedidoModel.findByIdAndDelete(id, {}, (err: CallbackError, productoPedidoBorrado: any) => {

                if (err) {
                    return resp.json({
                        ok: false,
                        mensaje: `Error interno`,
                        err
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

                        // Existen pagos
                        if (pedidoDB.pagos_pedido.length > 0) {
                            return resp.json({
                                ok: false,
                                mensaje: `No pueden eliminar productos ya que existen pagos registrados`
                            });
                        }

                        if (productoPedidoBorrado.inhabilitado === true) {

                            Object.assign(query, { $pull: { productos_pedidos: id } });

                        } else if (productoPedidoBorrado.inhabilitado === false) {

                            // ITBMS
                            if (pedidoDB.itbms === true) {

                                totalProductoPedido = parseFloat(productoPedidoBorrado.total.toFixed(2));
                                itbmsProductoPedido = parseFloat((totalProductoPedido * 0.07).toFixed(2));

                                itbmsPedido = parseFloat((pedidoDB.monto_itbms - itbmsProductoPedido).toFixed(2));
                                subtotalPedido = parseFloat((pedidoDB.subtotal - productoPedidoBorrado.total).toFixed(2));
                                totalPedido = parseFloat((subtotalPedido + itbmsPedido).toFixed(2));

                            } else if (pedidoDB.itbms === false) {

                                subtotalPedido = parseFloat((pedidoDB.subtotal - productoPedidoBorrado.total).toFixed(2));
                                totalPedido = parseFloat((subtotalPedido + itbmsPedido).toFixed(2));
                            }

                            Object.assign(query, { $pull: { productos_pedidos: id }, subtotal: subtotalPedido, monto_itbms: itbmsPedido, total: totalPedido });
                        }

                        pedidoModel.findByIdAndUpdate(pedido, query, { new: true })
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
        });
    }

    // inhabilitarProductoPedido(req: any, resp: Response): void {

    //     const id = req.get('id');
    //     const pedido = req.get('pedido');

    //     let subtotalPedido: number = 0;
    //     let itbmsPedido: number = 0;
    //     let totalPedido: number = 0;

    //     let totalProductoPedido: number = 0;
    //     let itbmsProductoPedido: number = 0;
    //     let query = {};

    //     productoPedidoModel.findById(id, (err: CallbackError, productoPedidoDB: ProductoPedidoInterface) => {

    //         if (err) {
    //             return resp.json({
    //                 ok: false,
    //                 mensaje: `Error interno`,
    //                 err
    //             });
    //         }

    //         if (!productoPedidoDB) {
    //             return resp.json({
    //                 ok: false,
    //                 mensaje: `No se encontró un producto pedido **`
    //             });
    //         }

    //         if (productoPedidoDB.inhabilitado === true) {

    //             return resp.json({
    //                 ok: false,
    //                 mensaje: `Este producto ya está inhabilitado`
    //             });
    //         }

    //         productoPedidoModel.findByIdAndUpdate(id, { inhabilitado: true }, { new: true }, (err: CallbackError, productoPedidoInhabilitado: any) => {

    //             if (err) {
    //                 return resp.json({
    //                     ok: false,
    //                     mensaje: `Error interno`,
    //                     err
    //                 });
    //             }

    //             pedidoModel.findById(pedido)
    //                 .exec((err: CallbackError, pedidoDB: any) => {

    //                     if (err) {
    //                         return resp.json({
    //                             ok: false,
    //                             mensaje: `Error interno`,
    //                             err
    //                         });
    //                     }

    //                     if (!pedidoDB) {
    //                         return resp.json({
    //                             ok: false,
    //                             mensaje: `No se encontró un pedido para poder eliminar un producto`
    //                         });
    //                     }

    //                     // Existen pagos
    //                     if (pedidoDB.pagos_pedido.length > 0) {
    //                         return resp.json({
    //                             ok: false,
    //                             mensaje: `No puede inhabilitar productos ya que existen pagos registrados`
    //                         });
    //                     }

    //                     // ITBMS
    //                     if (pedidoDB.itbms === true) {

    //                         totalProductoPedido = parseFloat(productoPedidoInhabilitado.total.toFixed(2));
    //                         itbmsProductoPedido = parseFloat((totalProductoPedido * 0.07).toFixed(2));

    //                         itbmsPedido = parseFloat((pedidoDB.monto_itbms - itbmsProductoPedido).toFixed(2));
    //                         subtotalPedido = parseFloat((pedidoDB.subtotal - productoPedidoInhabilitado.total).toFixed(2));
    //                         totalPedido = parseFloat((subtotalPedido + itbmsPedido).toFixed(2));

    //                     } else if (pedidoDB.itbms === false) {

    //                         subtotalPedido = parseFloat((pedidoDB.subtotal - productoPedidoInhabilitado.total).toFixed(2));
    //                         totalPedido = parseFloat((subtotalPedido + itbmsPedido).toFixed(2));
    //                     }

    //                     // Object.assign(query, { $pull: { productos_pedidos: id }, subtotal: subtotalPedido, monto_itbms: itbmsPedido, total: totalPedido });
    //                     Object.assign(query, { subtotal: subtotalPedido, monto_itbms: itbmsPedido, total: totalPedido });

    //                     pedidoModel.findByIdAndUpdate(pedido, query, { new: true })
    //                         .exec(async (err: CallbackError, pedidoActualizadoDB: any) => {

    //                             if (err) {
    //                                 return resp.json({
    //                                     ok: false,
    //                                     mensaje: `Error interno`,
    //                                     err
    //                                 });
    //                             }

    //                             const bitacora = new BitacoraClass();
    //                             await bitacora.crearBitacora(req, 'Se inhabilitó un producto', pedidoDB._id);

    //                             return resp.json({
    //                                 ok: true,
    //                                 pedidoActualizadoDB
    //                             });
    //                         });
    //                 });

    //         });
    //     });
    // }

    ingresarProductoPedido(req: any, resp: Response, idProducto: any, cantidad: number, existeProductoPedido: boolean, idPedido: any, pedidoDB: PedidoModelInterface, precio: number): any {

        const totalProductoPedido = cantidad * precio;
        let subtotalPedido: number = 0;
        let itbmsPedido: number = 0;
        let totalPedido: number = 0;

        let itbmsProductoPedido: number = 0;
        let query = {};

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
                producto: idProducto,
                pedido: idPedido,
                total: totalProductoPedido,
                // falta descripcion
            });

            nuevoProductoPedido.save(async (err: CallbackError, productoPedidoDB: ProductoPedidoInterface) => {

                if (err) {
                    return resp.json({
                        ok: false,
                        mensaje: `Error interno`,
                        err
                    });
                }

                // // Si existe itbms
                // if (pedidoDB.itbms === true) {

                //     itbmsProductoPedido = parseFloat((totalProductoPedido * 0.07).toFixed(2));
                //     itbmsPedido = parseFloat(itbmsProductoPedido.toFixed(2));
                // }

                // if (existeProductoPedido === false) { // Primer producto pedido 


                //     subtotalPedido = parseFloat(totalProductoPedido.toFixed(2));
                //     itbmsPedido = parseFloat(pedidoDB.monto_itbms.toFixed(2)) + parseFloat(itbmsPedido.toFixed(2));
                //     totalPedido = subtotalPedido + itbmsPedido;

                // } else { // Existen más productos pedidos

                //     // totales
                //     const mapPrecios: Array<any> = pedidoDB.productos_pedidos.map((productoPedido: ProductoPedidoInterface) => {
                //         // return productoPedido.total;
                //         if (productoPedido.inhabilitado === true) {
                //             return 0;
                //         } else if (productoPedido.inhabilitado === false) {
                //             return productoPedido.total;
                //         }
                //     });

                //     const totalPrecios: number = mapPrecios.reduce((acc: number, current: number) => {
                //         return acc + current;
                //     });

                //     // pagos
                //     const mapPagos: Array<number> = pedidoDB.pagos_pedido.map((pagoPedido: any) => {
                //         return pagoPedido.monto;
                //     });

                //     let totalPagos: number = 0;

                //     if (pedidoDB.pagos_pedido.length === 0) { // No hay pagos aún

                //         totalPagos = 0;

                //     } else {

                //         totalPagos = mapPagos.reduce((acc: number, current: number) => {
                //             return acc + current;
                //         });
                //     }

                //     subtotalPedido = parseFloat(totalPrecios.toFixed(2)) + parseFloat(totalProductoPedido.toFixed(2));
                //     itbmsPedido = parseFloat(pedidoDB.monto_itbms.toFixed(2)) + parseFloat(itbmsProductoPedido.toFixed(2));
                //     totalPedido = (subtotalPedido + itbmsPedido) - parseFloat(totalPagos.toFixed(2));
                // }

                // // return;
                // Object.assign(query, { $push: { productos_pedidos: productoPedidoDB._id }, subtotal: subtotalPedido, monto_itbms: itbmsPedido, total: totalPedido });
                Object.assign(query, { $push: { productos_pedidos: productoPedidoDB._id } });

                // return;
                // Actualizar el pedido
                pedidoModel.findByIdAndUpdate(idPedido, query, { new: true })
                    .populate([{ path: 'productos_pedidos', model: 'pedidos', populate: { path: 'producto', model: 'products' } }])
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
