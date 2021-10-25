"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
// crear esquema
const Schema = mongoose_1.default.Schema;
const BitacoraSchema = new Schema({
    idCreador: { type: mongoose_1.default.Types.ObjectId, ref: 'userWorker' },
    fecha_creacion: { type: String },
    pedido: { type: mongoose_1.default.Types.ObjectId, ref: 'pedidos' },
    accion: { type: String },
});
// validacion para único elemento
BitacoraSchema.plugin(mongoose_unique_validator_1.default, { message: '{PATH}, ya existe!!' });
module.exports = mongoose_1.default.model('bitacora', BitacoraSchema);
