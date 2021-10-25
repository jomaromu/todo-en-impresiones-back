"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
// crear esquema
const Schema = mongoose_1.default.Schema;
const prioridadPedidoSchema = new Schema({
    idReferencia: { type: String, required: [true, `Es necesario un ID referencia`], unique: true },
    idCreador: { type: String },
    nombre: { type: String },
    color_prioridad: { type: String },
    nivel: { type: Number },
    estado: { type: Boolean, default: true },
});
// validacion para único elemento
prioridadPedidoSchema.plugin(mongoose_unique_validator_1.default, { message: '{PATH}, ya existe!!' });
module.exports = mongoose_1.default.model('prioridadPedido', prioridadPedidoSchema);
