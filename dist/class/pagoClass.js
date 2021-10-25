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
exports.PagoClass = void 0;
const moment_1 = __importDefault(require("moment"));
moment_1.default.locale('es');
// Modelos
const pagosModel_1 = __importDefault(require("../models/pagosModel"));
const pedidoModel_1 = __importDefault(require("../models/pedidoModel"));
// Funciones externas
const archivos_1 = require("../functions/archivos");
class PagoClass {
    constructor() { }
    crearPago(req, resp) {
        const pedido = req.get('pedido');
        pedidoModel_1.default.findOne({ _id: pedido })
            .populate('pagos_pedido')
            .populate({ path: 'productos_pedidos', populate: { path: 'producto' } })
            .populate('cliente')
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
            const productosPedidos = pedidoDB.productos_pedidos;
            const pagosPedidos = pedidoDB.pagos_pedido;
            if (!productosPedidos || productosPedidos.length === 0) {
                return resp.json({
                    ok: false,
                    mensaje: `Debe agregar un producto para poder crear un pago`
                });
            }
            else {
                // Cuando no hay pagos
                if (!pagosPedidos || pagosPedidos.length === 0) {
                    console.log('Ingresar el primer pago');
                    this.ingresarPago(req, resp, pedidoDB, false, pedido);
                }
                else {
                    console.log('Existen pagos - agregar mas');
                    this.ingresarPago(req, resp, pedidoDB, true, pedido);
                }
            }
        }));
    }
    ingresarPago(req, resp, pedidoDB, existenPagos, idPedido) {
        return __awaiter(this, void 0, void 0, function* () {
            const idCreador = req.usuario._id;
            const metodo = req.get('metodo');
            const montoBody = Number(req.body.monto);
            const monto = parseFloat(montoBody.toFixed(2));
            const modalidad = req.body.modalidad;
            const files = req.files;
            const fecha = (0, moment_1.default)().format('YYYY-MM-DD');
            const query = {};
            // console.log(files);
            // return;
            const respArch = yield (0, archivos_1.extraerArchivo)(files);
            if (respArch.ok === false) {
                return resp.json({
                    ok: false,
                    mensaje: respArch.mensaje
                });
            }
            else {
                const file = respArch.data;
                const resArch = yield (0, archivos_1.subirArchivo)(file, req); // Recibo nombre del archivo
                if (resArch.ok === false) {
                    return resp.json({
                        ok: false,
                        mensaje: resArch.mensaje
                    });
                }
                else {
                    let total = 0;
                    const nombre_archivo = resArch.mensaje;
                    const nuevoPago = new pagosModel_1.default({
                        idCreador: idCreador,
                        metodo: metodo,
                        monto: monto,
                        modalidad: modalidad,
                        fecha: fecha,
                        nombre_archivo: resArch.mensaje
                    });
                    if (isNaN(monto) || monto < 0) {
                        (0, archivos_1.eliminarArchivo)(nombre_archivo);
                        return resp.json({
                            ok: false,
                            mensaje: `Debe ingresar un monto`
                        });
                    }
                    total = parseFloat((pedidoDB.total - monto).toFixed(2));
                    // total -= monto;
                    if (total < 0.00) {
                        (0, archivos_1.eliminarArchivo)(nombre_archivo);
                        return resp.json({
                            ok: false,
                            mensaje: `El monto de pago (${monto.toFixed(2)}) supera el total pendiente, Total pendiente: ${(pedidoDB.total).toFixed(2)}`
                        });
                    }
                    else {
                        nuevoPago.save((err, pagoDB) => {
                            if (err) {
                                // Eliminar pago de pedidos
                                return resp.json({
                                    ok: false,
                                    mensaje: `No se pudo realizar el pago`,
                                    err
                                });
                            }
                            Object.assign(query, { $push: { pagos_pedido: pagoDB._id }, total: total, monto_itbms: 0, subtotal: 0 });
                            pedidoModel_1.default.findByIdAndUpdate(idPedido, query, { new: true })
                                .populate('pagos_pedido')
                                .exec((err, pedidoActualizadoDB) => __awaiter(this, void 0, void 0, function* () {
                                if (err) {
                                    return resp.json({
                                        ok: false,
                                        mensaje: `No se pudo agregar el pago al pedido`,
                                        err
                                    });
                                }
                                return resp.json({
                                    ok: true,
                                    pedidoActualizadoDB
                                });
                            }));
                        });
                    }
                }
            }
        });
    }
    obtenerPagoID(req, resp) {
        const id = req.get('id');
        const pedido = req.get('pedido');
        pedidoModel_1.default.findById(pedido, (err, pedidoDB) => {
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
            pagosModel_1.default.findById(id, (err, pagoDB) => {
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
    deshabilitarPago(req, resp) {
        const id = req.get('id');
        const pedido = req.get('pedido');
        let saldo = 0;
        let estado = req.body.estado;
        const motivo = req.body.motivo;
        if (estado === 'false') {
            estado = false;
        }
        else if (estado === 'true') {
            estado = true;
        }
        else {
            return resp.json({
                ok: false,
                mensaje: `Debe ingresar un estado`
            });
        }
        pedidoModel_1.default.findById(pedido, (err, pedidoDB) => {
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
            pagosModel_1.default.findById(id, (err, pagoDB) => {
                let total = 0;
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
                };
                // Cuando el pago va a ser habilitado
                if (pagoDB.estado === false && estado === false) {
                    return resp.json({
                        ok: false,
                        mensaje: `El pago ya está deshabilitado`
                    });
                }
                else if (pagoDB.estado === false && estado === true) {
                    // saldo = pedidoDB.total - pagoDB.monto;
                    total = parseFloat((total + pagoDB.monto).toFixed(2));
                }
                // Cuando el pago va a ser deshabilitado
                if (pagoDB.estado === true && estado === true) {
                    return resp.json({
                        ok: false,
                        mensaje: `El pago ya está habilitado`
                    });
                }
                else if (pagoDB.estado === true && estado === false) {
                    if (!motivo) {
                        return resp.json({
                            ok: false,
                            mensaje: `Es necesario que escriba un motivo`
                        });
                    }
                    // saldo = pedidoDB.saldo + pagoDB.monto;
                    total = parseFloat((pedidoDB.total - pagoDB.monto).toFixed(2));
                }
                pagosModel_1.default.findByIdAndUpdate(id, { estado: estado, motivo: motivo }, { new: true }, (err, pagoActualizadoDB) => {
                    if (err) {
                        return resp.json({
                            ok: false,
                            mensaje: `Error interno`,
                            err
                        });
                    }
                    pedidoModel_1.default.findByIdAndUpdate(pedido, { total: total }, { new: true })
                        .exec((err, pedidoActualizadoDB) => __awaiter(this, void 0, void 0, function* () {
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
                    }));
                });
            });
        });
    }
}
exports.PagoClass = PagoClass;
