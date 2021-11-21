"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
// Crear esquema
const Schema = mongoose_1.default.Schema;
const productoPedidoSchema = new Schema({
    cantidad: { type: Number, default: 1 },
    precio: { type: Number, default: 0 },
    comentario: { type: String, default: 'Ninguno' },
    total: { type: Number, default: 0 },
    seguimiento_disenio: { type: String },
    seguimiento_produccion: { type: String },
    producto: { type: Schema.Types.ObjectId, ref: 'products' },
    // estado: { type: Boolean, default: false },
    pedido: { type: mongoose_1.default.Types.ObjectId, ref: 'pedidos' },
    // inhabilitado: { type: Boolean, default: false },
});
module.exports = mongoose_1.default.model('productoPedido', productoPedidoSchema);
