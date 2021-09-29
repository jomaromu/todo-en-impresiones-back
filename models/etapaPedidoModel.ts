import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const etapas = {
    values: ['Pedido pendiente', 'Diseño gráfico', 'Producción', 'Por entregar', 'Entregado'],
    message: '{VALUE}, no es una etapa permitida'
}

// Interface
import { EtapaPedidoInterface } from '../interfaces/pedidos';

// crear esquema
const Schema = mongoose.Schema;

const etapaPedidoSchema = new Schema({

    idCreador: { type: String, required: [true, 'Es necesario el ID del creador'] },
    nombre: { type: String, required: [true, 'EL nombre es necesario'], enum: etapas },
    nivel: { type: Number, default: 1 },
    estado: { type: Boolean, default: true }
});

// validacion para único elemento
etapaPedidoSchema.plugin(uniqueValidator, { message: '{PATH}, ya existe!!' });

export = mongoose.model<EtapaPedidoInterface>('etapaPedido', etapaPedidoSchema);