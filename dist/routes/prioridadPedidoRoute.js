"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../auth/auth");
const prioridadPedidoClass_1 = require("../class/prioridadPedidoClass");
// instanciar el Router
const prioridadRouter = (0, express_1.Router)();
// ==================================================================== //
// Crear una prioridad
// ==================================================================== //
prioridadRouter.post('/nuevaProridad', [auth_1.verificaToken, auth_1.crearUsuario], (req, resp) => {
    const nuevaProridad = new prioridadPedidoClass_1.prioridadClass();
    nuevaProridad.nuevaProridad(req, resp);
});
// ==================================================================== //
// Editar una prioridad
// ==================================================================== //
prioridadRouter.put('/editarPrioridadPedido', [auth_1.verificaToken, auth_1.editarUsuario], (req, resp) => {
    const editarPrioridadPedido = new prioridadPedidoClass_1.prioridadClass();
    editarPrioridadPedido.editarPrioridadPedido(req, resp);
});
// ==================================================================== //
// Obtener una prioridad por ID
// ==================================================================== //
prioridadRouter.get('/obtenerPrioridadID', [auth_1.verificaToken], (req, resp) => {
    const obtenerPrioridadID = new prioridadPedidoClass_1.prioridadClass();
    obtenerPrioridadID.obtenerPrioridadID(req, resp);
});
// ==================================================================== //
// Obtener todas las prioridades
// ==================================================================== //
prioridadRouter.get('/obtenerTodasPrioridades', [auth_1.verificaToken], (req, resp) => {
    const obtenerTodasPrioridades = new prioridadPedidoClass_1.prioridadClass();
    obtenerTodasPrioridades.obtenerTodasPrioridades(req, resp);
});
// ==================================================================== //
// Eliminar una prioridad
// ==================================================================== //
prioridadRouter.delete('/eliminarPrioridad', [auth_1.verificaToken, auth_1.eliminarUsuario], (req, resp) => {
    const eliminarPrioridad = new prioridadPedidoClass_1.prioridadClass();
    eliminarPrioridad.eliminarPrioridad(req, resp);
});
exports.default = prioridadRouter;
