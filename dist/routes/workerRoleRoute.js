"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const workerRoleClass_1 = require("../class/workerRoleClass");
const auth_1 = require("../auth/auth");
// Instanciar el router
const roleColRouter = (0, express_1.Router)();
// Nuevo role
roleColRouter.post('/nuevoRole', [auth_1.verificaToken, auth_1.crearUsuario], (req, resp) => {
    const nuevoRole = new workerRoleClass_1.RoleColClass();
    nuevoRole.nuevoRole(req, resp);
});
// Editar role
roleColRouter.put('/editarRole', [auth_1.verificaToken, auth_1.editarRole], (req, resp) => {
    const editarRole = new workerRoleClass_1.RoleColClass();
    editarRole.editarRole(req, resp);
});
// Obtener role por ID
roleColRouter.get('/obtenerRoleID', [auth_1.verificaToken], (req, resp) => {
    const obtenerRoleID = new workerRoleClass_1.RoleColClass();
    obtenerRoleID.obtenerRoleID(req, resp);
});
// Obtener todos los roles
roleColRouter.get('/obtenerTodos', [auth_1.verificaToken], (req, resp) => {
    const obtenerTodos = new workerRoleClass_1.RoleColClass();
    obtenerTodos.obtenerTodos(req, resp);
});
// Eliminar role
roleColRouter.delete('/eliminarRole', [auth_1.verificaToken, auth_1.eliminarRole], (req, resp) => {
    const eliminarRole = new workerRoleClass_1.RoleColClass();
    eliminarRole.eliminarRole(req, resp);
});
exports.default = roleColRouter;
