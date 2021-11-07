"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
// crear esquema
const Schema = mongoose_1.default.Schema;
const ayudaSchema = new Schema({
    idCreador: { type: Schema.Types.ObjectId, ref: 'userWorker', required: [true, 'Es necesario el ID del creador'] },
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    estado: { type: Boolean, default: true },
    descripcion: { type: String, required: [true, 'La descripción es necesaria'] },
});
module.exports = mongoose_1.default.model('ayuda', ayudaSchema);
