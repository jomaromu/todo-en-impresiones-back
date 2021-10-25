"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
// Interface
// crear esquema
const Schema = mongoose_1.default.Schema;
const facturacionSchema = new Schema({
    idCreador: { type: String, required: [true, 'Es necesario el ID del creador'] },
    cantidad_total: { type: Number },
    cantidad_abono: { type: Number },
    saldo: { type: Number },
    estado_pago: { type: Number },
    fecha_pago: { type: String },
    ruta_comprobante: { type: String },
    metodo_pago: { type: String },
    tipo_pago: { type: String },
    estado: { type: Boolean }
});
// validacion para único elemento
facturacionSchema.plugin(mongoose_unique_validator_1.default, { message: '{PATH}, ya existe!!' });
module.exports = mongoose_1.default.model('archivos', facturacionSchema);
