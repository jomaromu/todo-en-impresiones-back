"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const tipos = {
    values: ['original', 'aprobado', 'proceso'],
    message: '{VALUE}, no es un tipo permitido'
};
// crear esquema
const Schema = mongoose_1.default.Schema;
const archivoSchema = new Schema({
    idReferencia: { type: String, required: [true, 'Es necesario el ID Referencia'], unique: true },
    idCreador: { type: Schema.Types.ObjectId, ref: 'userWorker', required: [true, 'Es necesario el ID del creador'] },
    nombre_archivo: { type: String, default: 'archivo' },
    pedido: { type: Schema.Types.ObjectId, ref: 'pedidos' },
    fecha: { type: String },
    tipo: { type: Number, default: 0 },
    estado: { type: Boolean, default: true }
});
// validacion para único elemento
archivoSchema.plugin(mongoose_unique_validator_1.default, { message: '{PATH}, ya existe!!' });
module.exports = mongoose_1.default.model('archivos', archivoSchema);
