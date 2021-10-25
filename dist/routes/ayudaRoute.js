"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// Auth
const auth_1 = require("../auth/auth");
const ayudaClass_1 = require("../class/ayudaClass");
const ayudaRoute = (0, express_1.Router)();
ayudaRoute.post('/crearAyuda', [auth_1.verificaToken], (req, resp) => {
    const crearAyuda = new ayudaClass_1.AyudaClass();
    crearAyuda.crearAyuda(req, resp);
});
ayudaRoute.put('/editarAyuda', [auth_1.verificaToken], (req, resp) => {
    const editarAyuda = new ayudaClass_1.AyudaClass();
    editarAyuda.editarAyuda(req, resp);
});
ayudaRoute.get('/obtenerAyudaID', [auth_1.verificaToken], (req, resp) => {
    const obtenerAyudaID = new ayudaClass_1.AyudaClass();
    obtenerAyudaID.obtenerAyudaID(req, resp);
});
ayudaRoute.get('/obtenerTodas', [auth_1.verificaToken], (req, resp) => {
    const obtenerTodas = new ayudaClass_1.AyudaClass();
    obtenerTodas.obtenerTodas(req, resp);
});
ayudaRoute.delete('/eliminarAyuda', [auth_1.verificaToken], (req, resp) => {
    const eliminarAyuda = new ayudaClass_1.AyudaClass();
    eliminarAyuda.eliminarAyuda(req, resp);
});
exports.default = ayudaRoute;
