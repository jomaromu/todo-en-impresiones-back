"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// Instanciar el router
const roleClientRouter = express_1.Router();
// Nuevo role
roleClientRouter.post('/nuevoRole', (req, resp) => {
});
exports.default = roleClientRouter;
