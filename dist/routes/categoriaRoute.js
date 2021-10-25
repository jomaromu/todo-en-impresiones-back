"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../auth/auth");
const categoriaClass_1 = require("../class/categoriaClass");
const categoriaRouter = (0, express_1.Router)();
categoriaRouter.post('/crearCategoria', [auth_1.verificaToken], (req, resp) => {
    const crearCategoria = new categoriaClass_1.CategoriaClass();
    crearCategoria.crearCategoria(req, resp);
});
categoriaRouter.put('/editarCategoriaID', [auth_1.verificaToken], (req, resp) => {
    const editarCategoriaID = new categoriaClass_1.CategoriaClass();
    editarCategoriaID.editarCategoriaID(req, resp);
});
categoriaRouter.get('/obtenerTodasCategorias', [auth_1.verificaToken], (req, resp) => {
    const obtenerTodasCategorias = new categoriaClass_1.CategoriaClass();
    obtenerTodasCategorias.obtenerTodasCategorias(req, resp);
});
categoriaRouter.get('/obtenerCategoriaID', [auth_1.verificaToken], (req, resp) => {
    const obtenerCategoriaID = new categoriaClass_1.CategoriaClass();
    obtenerCategoriaID.obtenerCategoriaID(req, resp);
});
categoriaRouter.delete('/eliminarCategoriaID', [auth_1.verificaToken], (req, resp) => {
    const eliminarCategoriaID = new categoriaClass_1.CategoriaClass();
    eliminarCategoriaID.eliminarCategoriaID(req, resp);
});
exports.default = categoriaRouter;
