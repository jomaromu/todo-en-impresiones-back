"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const modalidad = {
    values: ['abono', 'cancelacion', 'delivery'],
    message: '{VALUE}, no es una modalidad permitida'
};
// crear esquema
const Schema = mongoose_1.default.Schema;
const pagosSchemas = new Schema({
    idCreador: { type: mongoose_1.default.Types.ObjectId, ref: 'userWorker', required: [true, 'Es necesario el ID del creador'] },
    metodo: { type: mongoose_1.default.Types.ObjectId, ref: 'metodoPago', required: [true, 'El método de pago es necesario'] },
    modalidad: { type: Number, required: [true, 'La modalidad necesaria'] },
    // ruta_comprobante: { type: String },
    fecha: { type: String },
    estado: { type: Boolean, default: true },
    // nombre_archivo: { type: String },
    motivo: { type: String },
    monto: { type: Number, default: 0 }
});
// validacion para único elemento
pagosSchemas.plugin(mongoose_unique_validator_1.default, { message: '{PATH}, ya existe!!' });
module.exports = mongoose_1.default.model('pagos', pagosSchemas);
