import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

// Interface
import { PrioridadPedidoInterface } from '../interfaces/pedidos';

// crear esquema
const Schema = mongoose.Schema;

const prioridadPedidoSchema = new Schema({

    idCreador: { type: String },
    nombre: { type: String, required: [true, 'Es necesario el nombre'] },
    color_prioridad: { type: String, default: '#3D4ADC' },
    nivel: { type: Number, default: 1 },
    importancia: { type: Number, default: 0, unique: true }, // Máxima importancia
    estado: { type: Boolean, default: true },
});

// validacion para único elemento
prioridadPedidoSchema.plugin(uniqueValidator, { message: '{PATH}, ya existe!!' });

export = mongoose.model<PrioridadPedidoInterface>('prioridadPedido', prioridadPedidoSchema);