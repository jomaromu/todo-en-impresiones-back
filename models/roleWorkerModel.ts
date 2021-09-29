import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

// Interfaces
import { RoleColModel } from '../interfaces/role';

// Crear esquema
const Schema = mongoose.Schema;

const roleColaboradorSchema = new Schema({
    idCreador: { type: String },
    nombre: { type: String, unique: true },
    nivel: { type: Number, default: 1 },
    estado: { type: Boolean, default: true }
});

// validacion para único elemento
roleColaboradorSchema.plugin(uniqueValidator, { message: 'El {PATH}, ya existe!!' });

export = mongoose.model<RoleColModel>('roleColaborador', roleColaboradorSchema);