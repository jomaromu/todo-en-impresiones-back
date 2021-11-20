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
exports.ProductoPedido = void 0;
// Clases
const bitacoraClass_1 = require("./bitacoraClass");
// Modelos
const productoPedidoModel_1 = __importDefault(require("../models/productoPedidoModel"));
const pedidoModel_1 = __importDefault(require("../models/pedidoModel"));
const productModel_1 = __importDefault(require("../models/productModel"));
class ProductoPedido {
    constructor() { }
    crearProductoPedido(req, resp) {
        const cantidad = Math.floor(Number(req.body.cantidad));
        const producto = req.get('producto');
        const precio = Number(parseFloat(req.body.precio).toFixed(2));
        const pedido = req.get('pedido');
        pedidoModel_1.default.findById(pedido)
            .populate({ path: 'productos_pedidos' })
            .populate({ path: 'pagos_pedido' })
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
                    mensaje: `No se encontró un pedido para agregar un producto`
                });
            }
            // Existen pagos
            if (pedidoDB.pagos_pedido.length > 0) {
                return resp.json({
                    ok: false,
                    mensaje: `No puede agregar productos ya que existen pagos registrados`
                });
            }
            const productosPedidos = pedidoDB.productos_pedidos;
            // Si no hay productos pedidos
            if (productosPedidos.length === 0 || !productosPedidos) {
                this.ingresarProductoPedido(req, resp, producto, cantidad, false, pedido, pedidoDB, precio);
            }
            else {
                this.ingresarProductoPedido(req, resp, producto, cantidad, true, pedido, pedidoDB, precio);
            }
        });
    }
    editarProductoPedido(req, resp) {
        const id = req.get('id');
        productoPedidoModel_1.default.findById(id, (err, productoPedidoDB) => {
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
            };
            if (!query.seguimiento_disenio) {
                query.seguimiento_disenio = productoPedidoDB.seguimiento_disenio;
            }
            if (!query.seguimiento_produccion) {
                query.seguimiento_produccion = productoPedidoDB.seguimiento_produccion;
            }
            productoPedidoModel_1.default.findByIdAndUpdate(id, query, { new: true }, (err, productoPedidoActualizadoDB) => __awaiter(this, void 0, void 0, function* () {
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
            }));
        });
    }
    obtenerProductoPedido(req, resp) {
        const id = req.get('id');
        productoPedidoModel_1.default.findById(id)
            .populate('producto')
            .exec((err, productoPedidoDB) => {
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
    obtenerPorPedido(req, resp) {
        const pedido = req.get('pedido');
        pedidoModel_1.default.findById(pedido)
            .populate('productos_pedidos')
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
                    mensaje: `No se encontró un pedido`
                });
            }
            return resp.json({
                ok: true,
                pedidoDB: pedidoDB
            });
        });
    }
    eliminarProductoPedido(req, resp) {
        const id = req.get('id');
        const pedido = req.get('pedido');
        let subtotalPedido = 0;
        let itbmsPedido = 0;
        let totalPedido = 0;
        let totalProductoPedido = 0;
        let itbmsProductoPedido = 0;
        const query = {};
        productoPedidoModel_1.default.findById(id, (err, productoPedidoDB) => {
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
            productoPedidoModel_1.default.findByIdAndDelete(id, {}, (err, productoPedidoBorrado) => {
                if (err) {
                    return resp.json({
                        ok: false,
                        mensaje: `Error interno`,
                        err
                    });
                }
                pedidoModel_1.default.findById(pedido)
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
                    }
                    else if (productoPedidoBorrado.inhabilitado === false) {
                        // ITBMS
                        if (pedidoDB.itbms === true) {
                            totalProductoPedido = parseFloat(productoPedidoBorrado.total.toFixed(2));
                            itbmsProductoPedido = parseFloat((totalProductoPedido * 0.07).toFixed(2));
                            itbmsPedido = parseFloat((pedidoDB.monto_itbms - itbmsProductoPedido).toFixed(2));
                            subtotalPedido = parseFloat((pedidoDB.subtotal - productoPedidoBorrado.total).toFixed(2));
                            totalPedido = parseFloat((subtotalPedido + itbmsPedido).toFixed(2));
                        }
                        else if (pedidoDB.itbms === false) {
                            subtotalPedido = parseFloat((pedidoDB.subtotal - productoPedidoBorrado.total).toFixed(2));
                            totalPedido = parseFloat((subtotalPedido + itbmsPedido).toFixed(2));
                        }
                        Object.assign(query, { $pull: { productos_pedidos: id }, subtotal: subtotalPedido, monto_itbms: itbmsPedido, total: totalPedido });
                    }
                    pedidoModel_1.default.findByIdAndUpdate(pedido, query, { new: true })
                        .exec((err, pedidoActualizadoDB) => __awaiter(this, void 0, void 0, function* () {
                        if (err) {
                            return resp.json({
                                ok: false,
                                mensaje: `Error interno`,
                                err
                            });
                        }
                        const bitacora = new bitacoraClass_1.BitacoraClass();
                        yield bitacora.crearBitacora(req, 'Eliminó un producto', pedidoDB._id);
                        return resp.json({
                            ok: true,
                            pedidoActualizadoDB
                        });
                    }));
                });
            });
        });
    }
    inhabilitarProductoPedido(req, resp) {
        const id = req.get('id');
        const pedido = req.get('pedido');
        let subtotalPedido = 0;
        let itbmsPedido = 0;
        let totalPedido = 0;
        let totalProductoPedido = 0;
        let itbmsProductoPedido = 0;
        let query = {};
        productoPedidoModel_1.default.findById(id, (err, productoPedidoDB) => {
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
            if (productoPedidoDB.inhabilitado === true) {
                return resp.json({
                    ok: false,
                    mensaje: `Este producto ya está inhabilitado`
                });
            }
            productoPedidoModel_1.default.findByIdAndUpdate(id, { inhabilitado: true }, { new: true }, (err, productoPedidoInhabilitado) => {
                if (err) {
                    return resp.json({
                        ok: false,
                        mensaje: `Error interno`,
                        err
                    });
                }
                pedidoModel_1.default.findById(pedido)
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
                            mensaje: `No se encontró un pedido para poder eliminar un producto`
                        });
                    }
                    // Existen pagos
                    if (pedidoDB.pagos_pedido.length > 0) {
                        return resp.json({
                            ok: false,
                            mensaje: `No puede inhabilitar productos ya que existen pagos registrados`
                        });
                    }
                    // ITBMS
                    if (pedidoDB.itbms === true) {
                        totalProductoPedido = parseFloat(productoPedidoInhabilitado.total.toFixed(2));
                        itbmsProductoPedido = parseFloat((totalProductoPedido * 0.07).toFixed(2));
                        itbmsPedido = parseFloat((pedidoDB.monto_itbms - itbmsProductoPedido).toFixed(2));
                        subtotalPedido = parseFloat((pedidoDB.subtotal - productoPedidoInhabilitado.total).toFixed(2));
                        totalPedido = parseFloat((subtotalPedido + itbmsPedido).toFixed(2));
                    }
                    else if (pedidoDB.itbms === false) {
                        subtotalPedido = parseFloat((pedidoDB.subtotal - productoPedidoInhabilitado.total).toFixed(2));
                        totalPedido = parseFloat((subtotalPedido + itbmsPedido).toFixed(2));
                    }
                    // Object.assign(query, { $pull: { productos_pedidos: id }, subtotal: subtotalPedido, monto_itbms: itbmsPedido, total: totalPedido });
                    Object.assign(query, { subtotal: subtotalPedido, monto_itbms: itbmsPedido, total: totalPedido });
                    pedidoModel_1.default.findByIdAndUpdate(pedido, query, { new: true })
                        .exec((err, pedidoActualizadoDB) => __awaiter(this, void 0, void 0, function* () {
                        if (err) {
                            return resp.json({
                                ok: false,
                                mensaje: `Error interno`,
                                err
                            });
                        }
                        const bitacora = new bitacoraClass_1.BitacoraClass();
                        yield bitacora.crearBitacora(req, 'Se inhabilitó un producto', pedidoDB._id);
                        return resp.json({
                            ok: true,
                            pedidoActualizadoDB
                        });
                    }));
                });
            });
        });
    }
    ingresarProductoPedido(req, resp, idProducto, cantidad, existeProductoPedido, idPedido, pedidoDB, precio) {
        const totalProductoPedido = cantidad * precio;
        let subtotalPedido = 0;
        let itbmsPedido = 0;
        let totalPedido = 0;
        let itbmsProductoPedido = 0;
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
        productModel_1.default.findById(idProducto, (err, productoDB) => {
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
            const nuevoProductoPedido = new productoPedidoModel_1.default({
                cantidad: cantidad,
                precio: precio,
                producto: idProducto,
                pedido: idPedido,
                total: totalProductoPedido
            });
            nuevoProductoPedido.save((err, productoPedidoDB) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    return resp.json({
                        ok: false,
                        mensaje: `Error interno`,
                        err
                    });
                }
                // Si existe itbms
                if (pedidoDB.itbms === true) {
                    itbmsProductoPedido = parseFloat((totalProductoPedido * 0.07).toFixed(2));
                    itbmsPedido = parseFloat(itbmsProductoPedido.toFixed(2));
                }
                if (existeProductoPedido === false) { // Primer producto pedido 
                    subtotalPedido = parseFloat(totalProductoPedido.toFixed(2));
                    itbmsPedido = parseFloat(pedidoDB.monto_itbms.toFixed(2)) + parseFloat(itbmsPedido.toFixed(2));
                    totalPedido = subtotalPedido + itbmsPedido;
                }
                else { // Existen más productos pedidos
                    // totales
                    const mapPrecios = pedidoDB.productos_pedidos.map((productoPedido) => {
                        // return productoPedido.total;
                        if (productoPedido.inhabilitado === true) {
                            return 0;
                        }
                        else if (productoPedido.inhabilitado === false) {
                            return productoPedido.total;
                        }
                    });
                    const totalPrecios = mapPrecios.reduce((acc, current) => {
                        return acc + current;
                    });
                    // pagos
                    const mapPagos = pedidoDB.pagos_pedido.map((pagoPedido) => {
                        return pagoPedido.monto;
                    });
                    let totalPagos = 0;
                    if (pedidoDB.pagos_pedido.length === 0) { // No hay pagos aún
                        totalPagos = 0;
                    }
                    else {
                        totalPagos = mapPagos.reduce((acc, current) => {
                            return acc + current;
                        });
                    }
                    subtotalPedido = parseFloat(totalPrecios.toFixed(2)) + parseFloat(totalProductoPedido.toFixed(2));
                    itbmsPedido = parseFloat(pedidoDB.monto_itbms.toFixed(2)) + parseFloat(itbmsProductoPedido.toFixed(2));
                    totalPedido = (subtotalPedido + itbmsPedido) - parseFloat(totalPagos.toFixed(2));
                }
                // return;
                Object.assign(query, { $push: { productos_pedidos: productoPedidoDB._id }, subtotal: subtotalPedido, monto_itbms: itbmsPedido, total: totalPedido });
                // return;
                // Actualizar el pedido
                pedidoModel_1.default.findByIdAndUpdate(idPedido, query, { new: true })
                    .populate({ path: 'productos_pedidos', populate: 'producto' })
                    .exec((err, pedidoActualizadoDB) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        return resp.json({
                            ok: false,
                            mensaje: `Error interno`,
                            err
                        });
                    }
                    const bitacora = new bitacoraClass_1.BitacoraClass();
                    yield bitacora.crearBitacora(req, 'Agregó un producto', pedidoDB._id);
                    return resp.json({
                        ok: true,
                        pedidoActualizadoDB
                    });
                }));
            }));
        });
    }
}
exports.ProductoPedido = ProductoPedido;
