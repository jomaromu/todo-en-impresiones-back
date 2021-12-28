"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const estadoPedido = {
    values: ['aprobado', 'revision', 'normal', 'corregir'],
    message: '{VALUE}, no es un estado pedido permitido'
};
// crear esquema
const Schema = mongoose_1.default.Schema;
const PedidoSchema = new Schema({
    idReferencia: { type: String, required: [true, 'Es necesario el ID Referencia'], unique: true },
    idCreador: { type: Schema.Types.ObjectId, ref: 'userWorker', required: [true, 'Es necesario el ID del creador'] },
    fecha_alta: { type: String },
    fecha_entrega: { type: String },
    cliente: { type: Schema.Types.ObjectId, ref: 'userClient', required: [true, 'El pedido debe ser asignado a un cliente'] },
    archivos: [{ type: Schema.Types.ObjectId, ref: 'archivos' }],
    // etapa_pedido: { type: Schema.Types.ObjectId, ref: 'etapaPedido' },
    // prioridad_pedido: { type: Schema.Types.ObjectId, ref: 'prioridadPedido' },
    prioridad_pedido: { type: Number, default: 1 },
    etapa_pedido: { type: Number, default: 0 },
    sucursal: { type: Schema.Types.ObjectId, ref: 'sucursales' },
    asignado_a: { type: Schema.Types.ObjectId, ref: 'userWorker' },
    origen_pedido: { type: Schema.Types.ObjectId, ref: 'origenPedido' },
    productos_pedidos: [{ type: Schema.Types.ObjectId, ref: 'productoPedido' }],
    pagos_pedido: [{ type: Schema.Types.ObjectId, ref: 'pagos' }],
    estado: { type: Boolean, default: true },
    estado_pedido: { type: Number, default: 0 },
    itbms: { type: Boolean, default: true },
    // monto_itbms: { type: Number, default: 0 },
    subtotal: { type: Number, default: 0 },
    // saldo: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    // bandeja: { type: String, default: 'todos' } // todos, produccion, diseniador, vendedor, admin-super
});
// validacion para único elemento
PedidoSchema.plugin(mongoose_unique_validator_1.default, { message: '{PATH}, ya existe!!' });
module.exports = mongoose_1.default.model('pedidos', PedidoSchema);
