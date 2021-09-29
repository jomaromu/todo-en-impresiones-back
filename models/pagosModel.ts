import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

// Interface
import { PagoInterface } from '../interfaces/pago';

const modalidad = {
    values: ['abono', 'cancelacion', 'delivery'],
    message: '{VALUE}, no es una modalidad permitida'
}

// crear esquema
const Schema = mongoose.Schema;

const pagosSchemas = new Schema({

    idCreador: { type: String, required: [true, 'Es necesario el ID del creador'] },
    metodo: { type: String },
    modalidad: { type: String, required: [true, 'La modalidad necesaria'], enum: modalidad },
    ruta_comprobante: { type: String },
    fecha: { type: String },
    estado: { type: Boolean, default: true },
    nombre_archivo: { type: String },
    motivo: { type: String },
    monto: { type: Number, default: 0 }
});

// validacion para único elemento
pagosSchemas.plugin(uniqueValidator, { message: '{PATH}, ya existe!!' });

export = mongoose.model<PagoInterface>('pagos', pagosSchemas);