"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../auth/auth");
const pedidosClass_1 = require("../class/pedidosClass");
const pedidoRouter = (0, express_1.Router)();
pedidoRouter.post('/crearPedido', [auth_1.verificaToken], (req, resp) => {
    const crearPedido = new pedidosClass_1.PedidosClass();
    crearPedido.crearPedido(req, resp);
});
pedidoRouter.put('/editarPedido', [auth_1.verificaToken], (req, resp) => {
    const editarPedido = new pedidosClass_1.PedidosClass();
    editarPedido.editarPedido(req, resp);
});
pedidoRouter.get('/obtenerPedidoID', [auth_1.verificaToken], (req, resp) => {
    const obtenerPedidoID = new pedidosClass_1.PedidosClass();
    obtenerPedidoID.obtenerPedidoID(req, resp);
});
pedidoRouter.delete('/eliminarPedidoID', [auth_1.verificaToken], (req, resp) => {
    const eliminarPedidoID = new pedidosClass_1.PedidosClass();
    eliminarPedidoID.eliminarPedidoID(req, resp);
});
pedidoRouter.get('/obtenerPedidosPorRole', [auth_1.verificaToken], (req, resp) => {
    const obtenerPedidosPorRole = new pedidosClass_1.PedidosClass();
    obtenerPedidosPorRole.obtenerPedidosPorRole(req, resp);
});
// pedidoRouter.get('/obtenerPedidosCriterio', [verificaToken], (req: Request, resp: Response) => {
//     const obtenerPedidosCriterio = new PedidosClass();
//     obtenerPedidosCriterio.obtenerPedidosCriterio(req, resp);
// });
pedidoRouter.get('/obtenerTodos', [auth_1.verificaToken], (req, resp) => {
    const obtenerTodos = new pedidosClass_1.PedidosClass();
    obtenerTodos.obtenerTodos(req, resp);
});
pedidoRouter.get('/redireccionBandejas', [auth_1.verificaToken], (req, resp) => {
    const redireccionBandejas = new pedidosClass_1.PedidosClass();
    redireccionBandejas.redireccionBandejas(req, resp);
});
pedidoRouter.get('/busquedaBandeja', [auth_1.verificaToken], (req, resp) => {
    const busquedaBandeja = new pedidosClass_1.PedidosClass();
    busquedaBandeja.busquedaBandeja(req, resp);
});
exports.default = pedidoRouter;
