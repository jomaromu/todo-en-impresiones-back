"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const auth_1 = require("../auth/auth");
const archivos_1 = require("../functions/archivos");
const getFileRouter = (0, express_1.Router)();
// Obtener img de archivos
getFileRouter.get('/:file', [auth_1.verificaToken], (req, resp) => {
    const ruta = path_1.default.resolve(__dirname, `../uploads/archivos`);
    const file = req.params.file;
    // console.log(file);
    // return;
    // const file = req.get('file') || '';
    (0, archivos_1.verFile)(ruta, file, resp);
});
exports.default = getFileRouter;
