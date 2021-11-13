"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const workerClass_1 = require("../class/workerClass");
// instanciar el Router
const workerRouter = (0, express_1.Router)();
// Auth
const auth_1 = require("../auth/auth");
// ==================================================================== //
// Crear un usuario super
// ==================================================================== //
workerRouter.post('/nuevoUsuarioSuper', (req, resp) => {
    const nuevoUsuarioSuper = new workerClass_1.WorkkerClass();
    nuevoUsuarioSuper.nuevoUsuarioSuper(req, resp);
});
// ==================================================================== //
// Crear un usuario
// ==================================================================== //
workerRouter.post('/nuevoUsuario', [auth_1.verificaToken, auth_1.crearUsuario], (req, resp) => {
    const nuevoUsuario = new workerClass_1.WorkkerClass();
    nuevoUsuario.nuevoUsuario(req, resp);
});
// ==================================================================== //
// Editar un usuario
// ==================================================================== //
workerRouter.put('/editarUsuario', [auth_1.verificaToken, auth_1.editarUsuario], (req, resp) => {
    const editarUsuario = new workerClass_1.WorkkerClass();
    editarUsuario.editarUsuario(req, resp);
});
// ==================================================================== //
// Editar perfil
// ==================================================================== //
workerRouter.put('/EditarPefil', [auth_1.verificaToken], (req, resp) => {
    const EditarPefil = new workerClass_1.WorkkerClass();
    EditarPefil.EditarPefil(req, resp);
});
// ==================================================================== //
// Obtener un usuario por ID
// ==================================================================== //
workerRouter.get('/obtenerUsuarioID', [auth_1.verificaToken], (req, resp) => {
    const obtenerUsuarioID = new workerClass_1.WorkkerClass();
    obtenerUsuarioID.obtenerUsuarioID(req, resp);
});
// ==================================================================== //
// Obtener un usuario por ID Referencia
// ==================================================================== //
workerRouter.get('/obtenerUsuarioIDRef', [auth_1.verificaToken], (req, resp) => {
    const obtenerUsuarioIDRef = new workerClass_1.WorkkerClass();
    obtenerUsuarioIDRef.obtenerUsuarioIDRef(req, resp);
});
// ==================================================================== //
// Obtener un usuario por Teléfono
// ==================================================================== //
workerRouter.get('/obtenerUsuarioTel', [auth_1.verificaToken], (req, resp) => {
    const obtenerUsuarioTel = new workerClass_1.WorkkerClass();
    obtenerUsuarioTel.obtenerUsuarioTel(req, resp);
});
// ==================================================================== //
// Obtener un usuario por Role
// ==================================================================== //
workerRouter.get('/obtenerUsuariosRole', [auth_1.verificaToken], (req, resp) => {
    const obtenerUsuariosRole = new workerClass_1.WorkkerClass();
    obtenerUsuariosRole.obtenerUsuariosRole(req, resp);
});
// ==================================================================== //
// Obtener un usuario por Sucursal y Role
// ==================================================================== //
workerRouter.get('/cargarUsuariosSucursalRole', [auth_1.verificaToken], (req, resp) => {
    const cargarUsuariosSucursalRole = new workerClass_1.WorkkerClass();
    cargarUsuariosSucursalRole.cargarUsuariosSucursalRole(req, resp);
});
// ==================================================================== //
// Obtener un usuario por criterio nombre
// ==================================================================== //
workerRouter.get('/obtenerUsuarioCriterioNombre', [auth_1.verificaToken], (req, resp) => {
    const obtenerUsuarioCriterioNombre = new workerClass_1.WorkkerClass();
    obtenerUsuarioCriterioNombre.obtenerUsuarioCriterioNombre(req, resp);
});
// ==================================================================== //
// Obtener usuarios por sucursal
// ==================================================================== //
workerRouter.get('/obtenerUsuariosSucursal', [auth_1.verificaToken], (req, resp) => {
    const obtenerUsuariosSucursal = new workerClass_1.WorkkerClass();
    obtenerUsuariosSucursal.obtenerUsuariosSucursal(req, resp);
});
// ==================================================================== //
// Obtener usuario por sucursal
// ==================================================================== //
workerRouter.get('/obtenerUsuarioSucursal', [auth_1.verificaToken], (req, resp) => {
    const obtenerUsuarioSucursal = new workerClass_1.WorkkerClass();
    obtenerUsuarioSucursal.obtenerUsuarioSucursal(req, resp);
});
// ==================================================================== //
// Obtener todos los usuarios
// ==================================================================== //
workerRouter.get('/obtenerTodosUsuarios', [auth_1.verificaToken], (req, resp) => {
    const obtenerTodosUsuarios = new workerClass_1.WorkkerClass();
    obtenerTodosUsuarios.obtenerTodosUsuarios(req, resp);
});
// ==================================================================== //
// Eliminar un usuario
// ==================================================================== //
workerRouter.delete('/eliminarUsuario', [auth_1.verificaToken, auth_1.eliminarUsuario], (req, resp) => {
    const eliminarUsuario = new workerClass_1.WorkkerClass();
    eliminarUsuario.eliminarUsuario(req, resp);
});
// ==================================================================== //
// Loguear usuario
// ==================================================================== //
workerRouter.post('/loguearUsuario', (req, resp) => {
    const loguearUsuario = new workerClass_1.WorkkerClass();
    loguearUsuario.loguearUsuario(req, resp);
});
// ==================================================================== //
// Decodificar token
// ==================================================================== //
workerRouter.get('/decodificarToken', (req, resp) => {
    const decodificarToken = new workerClass_1.WorkkerClass();
    decodificarToken.decodificarToken(req, resp);
});
// ==================================================================== //
// Refrescar token
// ==================================================================== //
workerRouter.post('/refrescarToken', (req, resp) => {
    const refrescarToken = new workerClass_1.WorkkerClass();
    refrescarToken.refrescarToken(req, resp);
});
exports.default = workerRouter;
