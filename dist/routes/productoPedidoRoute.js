"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../auth/auth");
const productoPedidoClass_1 = require("../class/productoPedidoClass");
const productoPedidoRouter = (0, express_1.Router)();
productoPedidoRouter.post('/crearProductoPedido', [auth_1.verificaToken], (req, resp) => {
    const productoPedido = new productoPedidoClass_1.ProductoPedido();
    productoPedido.crearProductoPedido(req, resp);
});
productoPedidoRouter.put('/editarProductoPedido', [auth_1.verificaToken], (req, resp) => {
    const editarProductoPedido = new productoPedidoClass_1.ProductoPedido();
    editarProductoPedido.editarProductoPedido(req, resp);
});
// productoPedidoRouter.put('/inhabilitarProductoPedido', [verificaToken], (req: Request, resp: Response) => {
//     const inhabilitarProductoPedido = new ProductoPedido();
//     inhabilitarProductoPedido.inhabilitarProductoPedido(req, resp);
// });
productoPedidoRouter.get('/obtenerProductoPedido', [auth_1.verificaToken], (req, resp) => {
    const obtenerProductoPedido = new productoPedidoClass_1.ProductoPedido();
    obtenerProductoPedido.obtenerProductoPedido(req, resp);
});
productoPedidoRouter.get('/obtenerPorPedido', [auth_1.verificaToken], (req, resp) => {
    const obtenerPorPedido = new productoPedidoClass_1.ProductoPedido();
    obtenerPorPedido.obtenerPorPedido(req, resp);
});
productoPedidoRouter.delete('/eliminarProductoPedido', [auth_1.verificaToken], (req, resp) => {
    const eliminarProductoPedido = new productoPedidoClass_1.ProductoPedido();
    eliminarProductoPedido.eliminarProductoPedido(req, resp);
});
exports.default = productoPedidoRouter;
