"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const archivoPedidoClass_1 = require("../class/archivoPedidoClass");
const auth_1 = require("../auth/auth");
// instanciar el Router
const archivoRouter = (0, express_1.Router)();
// ==================================================================== //
// Crear un archivo
// ==================================================================== //
archivoRouter.post('/nuevoArchivo', [auth_1.verificaToken], (req, resp) => {
    const nuevoArchivo = new archivoPedidoClass_1.ArchivoClass();
    nuevoArchivo.nuevoArchivo(req, resp);
});
// ==================================================================== //
// Obtener un archivo
// ==================================================================== //
archivoRouter.get('/obtenerArchivo', [auth_1.verificaToken], (req, resp) => {
    const obtenerArchivo = new archivoPedidoClass_1.ArchivoClass();
    obtenerArchivo.obtenerArchivo(req, resp);
});
// ==================================================================== //
// Obtener archivos
// ==================================================================== //
archivoRouter.get('/obtenerTodosArchivos', [auth_1.verificaToken], (req, resp) => {
    const obtenerTodosArchivos = new archivoPedidoClass_1.ArchivoClass();
    obtenerTodosArchivos.obtenerTodosArchivos(req, resp);
});
// ==================================================================== //
// Obtener archivos aprobados
// ==================================================================== //
archivoRouter.get('/obtenerArchivoAProbado', [auth_1.verificaToken], (req, resp) => {
    const obtenerArchivoAProbado = new archivoPedidoClass_1.ArchivoClass();
    obtenerArchivoAProbado.obtenerArchivoAProbado(req, resp);
});
// ==================================================================== //
// Obtener archivos no aprobados
// ==================================================================== //
archivoRouter.get('/obtenerArchivoProceso', [auth_1.verificaToken], (req, resp) => {
    const obtenerArchivoProceso = new archivoPedidoClass_1.ArchivoClass();
    obtenerArchivoProceso.obtenerArchivoProceso(req, resp);
});
// ==================================================================== //
// Obtener archivos original
// ==================================================================== //
archivoRouter.get('/obtenerArchivoAProbadoOriginal', [auth_1.verificaToken], (req, resp) => {
    const obtenerArchivoAProbadoOriginal = new archivoPedidoClass_1.ArchivoClass();
    obtenerArchivoAProbadoOriginal.obtenerArchivoAProbadoOriginal(req, resp);
});
// ==================================================================== //
// Eliminar un archivo por ID
// ==================================================================== //
archivoRouter.delete('/eliminarArhivoID', [auth_1.verificaToken], (req, resp) => {
    const eliminarArhivoID = new archivoPedidoClass_1.ArchivoClass();
    eliminarArhivoID.eliminarArhivoID(req, resp);
});
// ==================================================================== //
// Eliminar un archivos por rango de fecha
// ==================================================================== //
archivoRouter.delete('/eliminarArchivoRangoFechas', [auth_1.verificaToken, auth_1.eliminarArchivo], (req, resp) => {
    const eliminarArchivoRangoFechas = new archivoPedidoClass_1.ArchivoClass();
    eliminarArchivoRangoFechas.eliminarArchivoRangoFechas(req, resp);
});
exports.default = archivoRouter;
