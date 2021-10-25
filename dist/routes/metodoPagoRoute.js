"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../auth/auth");
const metodoPagoClass_1 = require("../class/metodoPagoClass");
const metodoPagoRoute = (0, express_1.Router)();
metodoPagoRoute.post('/crearMetodo', [auth_1.verificaToken, auth_1.crearUsuario], (req, resp) => {
    const crearMetodo = new metodoPagoClass_1.MetodoPagoClass();
    crearMetodo.crearMetodoPago(req, resp);
});
metodoPagoRoute.put('/editarMetodo', [auth_1.verificaToken, auth_1.editarUsuario, auth_1.editarMetodoPago], (req, resp) => {
    const editarMetodo = new metodoPagoClass_1.MetodoPagoClass();
    editarMetodo.editarMetodoPago(req, resp);
});
metodoPagoRoute.get('/obtenerMetodoID', [auth_1.verificaToken], (req, resp) => {
    const obtenerMetodoID = new metodoPagoClass_1.MetodoPagoClass();
    obtenerMetodoID.obtenerMetodoID(req, resp);
});
metodoPagoRoute.get('/obtenerTododsMetodos', [auth_1.verificaToken], (req, resp) => {
    const obtenerTododsMetodos = new metodoPagoClass_1.MetodoPagoClass();
    obtenerTododsMetodos.obtenerTododsMetodos(req, resp);
});
metodoPagoRoute.delete('/eliminarMetodoID', [auth_1.verificaToken, auth_1.eliminarUsuario], (req, resp) => {
    const eliminarMetodoID = new metodoPagoClass_1.MetodoPagoClass();
    eliminarMetodoID.eliminarMetodoID(req, resp);
});
exports.default = metodoPagoRoute;
