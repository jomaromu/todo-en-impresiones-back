"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const archivoPedidoClass_1 = require("../class/archivoPedidoClass");
const auth_1 = require("../auth/auth");
const path_1 = __importDefault(require("path"));
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
// Obtener archivos por pedido
// ==================================================================== //
archivoRouter.get('/obtenerArchivosPorPedido', [auth_1.verificaToken], (req, resp) => {
    const obtenerArchivosPorPedido = new archivoPedidoClass_1.ArchivoClass();
    obtenerArchivosPorPedido.obtenerArchivosPorPedido(req, resp);
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
// ==================================================================== //
// Enviar archivo
// ==================================================================== //
archivoRouter.get('/enviarArchivo', (req, resp) => {
    const nombreArchivo = req.query.nombreArchivo;
    // dist/uploads/archivos/null-3216.jpg
    const pathFile = path_1.default.resolve(__dirname, `../uploads/archivos/${nombreArchivo}`);
    return resp.sendFile(pathFile);
});
exports.default = archivoRouter;
