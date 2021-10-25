"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../auth/auth");
const sucursalClass_1 = require("../class/sucursalClass");
// instanciar el Router
const sucursalRouter = (0, express_1.Router)();
// ==================================================================== //
// Crear una sucursal
// ==================================================================== //
sucursalRouter.post('/nuevaSucursal', [auth_1.verificaToken, auth_1.crearUsuario], (req, resp) => {
    const nuevaSucursal = new sucursalClass_1.Sucursal();
    nuevaSucursal.nuevaSucursal(req, resp);
});
// ==================================================================== //
// Editar una sucursal
// ==================================================================== //
sucursalRouter.put('/editarSucursal', [auth_1.verificaToken, auth_1.editarUsuario], (req, resp) => {
    const editarSucursal = new sucursalClass_1.Sucursal();
    editarSucursal.editarSucursal(req, resp);
});
// ==================================================================== //
// Obtener una sucursal por ID
// ==================================================================== //
sucursalRouter.get('/obtenerSucursalID', [auth_1.verificaToken], (req, resp) => {
    const obtenerSucursal = new sucursalClass_1.Sucursal();
    obtenerSucursal.obtenerSucursal(req, resp);
});
// ==================================================================== //
// Obtener una sucursal por ID Referencia
// ==================================================================== //
sucursalRouter.get('/obtenerSucursalIDRef', [auth_1.verificaToken], (req, resp) => {
    const obtenerSucursal = new sucursalClass_1.Sucursal();
    obtenerSucursal.obtenerSucursalIdRef(req, resp);
});
// ==================================================================== //
// Obtener todas las sucursales
// ==================================================================== //
sucursalRouter.get('/obtenerTodasSucursales', [auth_1.verificaToken], (req, resp) => {
    const obtenerTodas = new sucursalClass_1.Sucursal();
    obtenerTodas.obtenerTodas(req, resp);
});
// ==================================================================== //
// Eliminar una sucursal
// ==================================================================== //
sucursalRouter.delete('/eliminarSucursal', [auth_1.verificaToken, auth_1.eliminarUsuario], (req, resp) => {
    const eliminarSucursal = new sucursalClass_1.Sucursal();
    eliminarSucursal.eliminarSucursal(req, resp);
});
exports.default = sucursalRouter;
