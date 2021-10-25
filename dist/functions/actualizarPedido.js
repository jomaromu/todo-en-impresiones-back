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
Object.defineProperty(exports, "__esModule", { value: true });
exports.actualizarMontosPedido = void 0;
const actualizarMontosPedido = (existeProductoPedido, pedidoDB, productoPedidoDB, nuevoProductoPed) => __awaiter(void 0, void 0, void 0, function* () {
    const objMontos = {
        subtotal: 0,
        monto_itbms: 0,
        total: 0
    };
    return new Promise((resolve, reject) => {
        if (existeProductoPedido === false) { // Primer producto pedido
            objMontos.subtotal = productoPedidoDB.total;
            objMontos.monto_itbms = 0;
            objMontos.total = productoPedidoDB.total;
            resolve(objMontos);
        }
        else { // Existen más productos pedidos
            // totales
            const mapTotalesProdPed = pedidoDB.productos_pedidos.map((productoPedido) => {
                return productoPedido.total;
            });
            const totalesProdPedido = mapTotalesProdPed.reduce((acc, current) => {
                return acc + current;
            });
            if (nuevoProductoPed === true) {
                objMontos.subtotal = totalesProdPedido + productoPedidoDB.total;
                resolve(objMontos);
            }
            // pagos
            // const mapPagos: Array<number> = pedidoDB.pagos_pedido.map((pagoPedido: any) => {
            //     return pagoPedido.monto;
            // });
            // let totalPagos: number = 0;
            // if (pedidoDB.pagos_pedido.length === 0) { // No hay pagos aún
            //     totalPagos = 0;
            // } else {
            //     totalPagos = mapPagos.reduce((acc: number, current: number) => {
            //         return acc + current;
            //     });
            // }
        }
    });
});
exports.actualizarMontosPedido = actualizarMontosPedido;
