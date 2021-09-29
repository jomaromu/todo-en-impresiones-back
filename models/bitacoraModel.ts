import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

// Interface
import { BitacoraModelInterface } from '../interfaces/bitacora';


// crear esquema
const Schema = mongoose.Schema;

const BitacoraSchema = new Schema({

    idCreador: { type: mongoose.Types.ObjectId, ref: 'userWorker' },
    fecha_creacion: { type: String },
    pedido: { type: mongoose.Types.ObjectId, ref: 'pedidos' },
    accion: { type: String },
});

// validacion para único elemento
BitacoraSchema.plugin(uniqueValidator, { message: '{PATH}, ya existe!!' });

export = mongoose.model<BitacoraModelInterface>('bitacora', BitacoraSchema);