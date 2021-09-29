import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const estadoPedido = {
    values: ['aprobado', 'revision', 'normal', 'corregir'],
    message: '{VALUE}, no es un estado pedido permitido'
}

// Interfaces
import { PedidoModelInterface } from '../interfaces/pedidos';

// crear esquema
const Schema = mongoose.Schema;

const PedidoSchema = new Schema({

    idReferencia: { type: String, required: [true, 'Es necesario el ID Referencia'], unique: true },
    idCreador: { type: Schema.Types.ObjectId, ref: 'userWorker', required: [true, 'Es necesario el ID del creador'] }, // Sólo vendedor
    fecha_alta: { type: String },
    fecha_entrega: { type: String }, // Default 3 días después
    cliente: { type: Schema.Types.ObjectId, ref: 'userClient', required: [true, 'El pedido debe ser asignado a un cliente'] },
    archivos: [{ type: Schema.Types.ObjectId, ref: 'archivos' }],
    etapa_pedido: { type: Schema.Types.ObjectId, ref: 'etapaPedido' },
    prioridad_pedido: { type: Schema.Types.ObjectId, ref: 'prioridadPedido' },
    sucursal: { type: Schema.Types.ObjectId, ref: 'sucursales' },
    asignado_a: { type: Schema.Types.ObjectId, ref: 'userWorker' }, // Debe ser diseñador role
    origen_pedido: { type: Schema.Types.ObjectId, ref: 'origenPedido' },
    productos_pedidos: [{ type: Schema.Types.ObjectId, ref: 'productoPedido' }],
    pagos_pedido: [{ type: Schema.Types.ObjectId, ref: 'pagos' }],
    estado: { type: Boolean, default: true },
    estado_pedido: { type: String, default: 'normal', enum: estadoPedido },
    itbms: { type: Boolean, default: false },
    saldo: { type: Number, default: 0 }
});

// validacion para único elemento
PedidoSchema.plugin(uniqueValidator, { message: '{PATH}, ya existe!!' });

export = mongoose.model<PedidoModelInterface>('pedidos', PedidoSchema);