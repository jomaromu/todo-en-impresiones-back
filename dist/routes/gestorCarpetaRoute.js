"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../auth/auth");
const gestorCarpetaClass_1 = require("../class/gestorCarpetaClass");
const gestorRoute = (0, express_1.Router)();
gestorRoute.get('/checkSize', [auth_1.verificaToken], (req, resp) => {
    const checkSize = new gestorCarpetaClass_1.GestorCarpetaClass();
    checkSize.checkSize();
});
exports.default = gestorRoute;
