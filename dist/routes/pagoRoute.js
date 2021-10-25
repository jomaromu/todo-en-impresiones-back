"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../auth/auth");
const pagoClass_1 = require("../class/pagoClass");
const pagoRoute = (0, express_1.Router)();
pagoRoute.post('/crearPago', [auth_1.verificaToken], (req, resp) => {
    const crearPago = new pagoClass_1.PagoClass();
    crearPago.crearPago(req, resp);
});
pagoRoute.get('/obtenerPagoID', [auth_1.verificaToken], (req, resp) => {
    const obtenerPagoID = new pagoClass_1.PagoClass();
    obtenerPagoID.obtenerPagoID(req, resp);
});
pagoRoute.put('/deshabilitarPago', [auth_1.verificaToken], (req, resp) => {
    const deshabilitarPago = new pagoClass_1.PagoClass();
    deshabilitarPago.deshabilitarPago(req, resp);
});
exports.default = pagoRoute;
