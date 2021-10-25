"use strict";
const express_1 = require("express");
const bitacoraClass_1 = require("../class/bitacoraClass");
// Auth
const auth_1 = require("../auth/auth");
const bitacoraRouter = express_1.Router();
bitacoraRouter.post('/crearBitacora', [auth_1.verificaToken], (req, resp) => {
    const crearBitacora = new bitacoraClass_1.BitacoraClass();
    crearBitacora.crearBitacora(req, resp);
});
module.exports = bitacoraRouter;
