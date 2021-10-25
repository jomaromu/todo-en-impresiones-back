"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const etapas = {
    values: ['Pedido pendiente', 'Diseño gráfico', 'Producción', 'Por entregar', 'Entregado'],
    message: '{VALUE}, no es una etapa permitida'
};
// crear esquema
const Schema = mongoose_1.default.Schema;
const etapaPedidoSchema = new Schema({
    idCreador: { type: String, required: [true, 'Es necesario el ID del creador'] },
    nombre: { type: String, required: [true, 'EL nombre es necesario'], enum: etapas },
    nivel: { type: Number, default: 1 },
    estado: { type: Boolean, default: true }
});
// validacion para único elemento
etapaPedidoSchema.plugin(mongoose_unique_validator_1.default, { message: '{PATH}, ya existe!!' });
module.exports = mongoose_1.default.model('etapaPedido', etapaPedidoSchema);
