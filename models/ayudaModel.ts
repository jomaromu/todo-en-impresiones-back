import mongoose from 'mongoose';

// Interface
import { AyudaModelInterface } from '../interfaces/ayuda';

// crear esquema
const Schema = mongoose.Schema;

const ayudaSchema = new Schema({

    idCreador: { type: Schema.Types.ObjectId, ref: 'userWorker', required: [true, 'Es necesario el ID del creador'] },
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    estado: { type: Boolean, default: true },
    descripcion: { type: String, required: [true, 'La descripción es necesaria'] },
});

export = mongoose.model<AyudaModelInterface>('ayuda', ayudaSchema);