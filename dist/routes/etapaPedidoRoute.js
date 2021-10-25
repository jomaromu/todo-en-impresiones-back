"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../auth/auth");
const etapaPedidoClass_1 = require("../class/etapaPedidoClass");
// instanciar el Router
const etapaRouter = (0, express_1.Router)();
// ==================================================================== //
// Crear una etapa de pedido
// ==================================================================== //
etapaRouter.post('/nuevaEtapaPedido', [auth_1.verificaToken, auth_1.crearUsuario], (req, resp) => {
    const nuevaEtapaPedido = new etapaPedidoClass_1.etapaPedidoClass();
    nuevaEtapaPedido.nuevaEtapaPedido(req, resp);
});
// ==================================================================== //
// Editar una etapa de pedido
// ==================================================================== //
etapaRouter.put('/editarEtapaPedido', [auth_1.verificaToken, auth_1.crearUsuario, auth_1.editarEtapa], (req, resp) => {
    const editarEtapaPedido = new etapaPedidoClass_1.etapaPedidoClass();
    editarEtapaPedido.editarEtapaPedido(req, resp);
});
// ==================================================================== //
// Obtener una etapa de pedido
// ==================================================================== //
etapaRouter.get('/obtenerEtapaPedido', [auth_1.verificaToken], (req, resp) => {
    const obtenerEtapaPedido = new etapaPedidoClass_1.etapaPedidoClass();
    obtenerEtapaPedido.obtenerEtapaPedido(req, resp);
});
// ==================================================================== //
// Obtener todas las etapas de pedido
// ==================================================================== //
etapaRouter.get('/obtenerTodasEtapaPedido', [auth_1.verificaToken], (req, resp) => {
    const obtenerTodasEtapaPedido = new etapaPedidoClass_1.etapaPedidoClass();
    obtenerTodasEtapaPedido.obtenerTodasEtapaPedido(req, resp);
});
// ==================================================================== //
// Eliminar una etapa de pedido
// ==================================================================== //
etapaRouter.delete('/eliminarEtapaPedido', [auth_1.verificaToken, auth_1.eliminarEtapa], (req, resp) => {
    const eliminarEtapaPedido = new etapaPedidoClass_1.etapaPedidoClass();
    eliminarEtapaPedido.eliminarEtapaPedido(req, resp);
});
exports.default = etapaRouter;
