import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

// Interface
import { MetodoPagoInterface } from '../interfaces/metodoPago';

// crear esquema
const Schema = mongoose.Schema;

const metodoPagoSchema = new Schema({

    idCreador: { type: String, required: [true, 'Es necesario el ID del creador'] },
    nombre: { type: String, required: [true, 'EL nombre es necesario'], unique: true },
    nivel: { type: Number, default: 1 },
    estado: { type: Boolean, default: true }
});

// validacion para único elemento
metodoPagoSchema.plugin(uniqueValidator, { message: '{PATH}, ya existe!!' });

export = mongoose.model<MetodoPagoInterface>('metodoPago', metodoPagoSchema);