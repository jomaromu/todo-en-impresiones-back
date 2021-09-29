import mongoose from 'mongoose';

// Interfaces
import { ProductoPedidoInterface } from '../interfaces/pedidos';

// Crear esquema
const Schema = mongoose.Schema;

const productoPedidoSchema = new Schema({
    cantidad: { type: Number, default: 0 },
    precio: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    seguimiento_disenio: { type: String },
    seguimiento_produccion: { type: String },
    producto: { type: Schema.Types.ObjectId, ref: 'products' },
    inhabilitado: { type: Boolean, default: false },
});

export = mongoose.model<ProductoPedidoInterface>('productoPedido', productoPedidoSchema);