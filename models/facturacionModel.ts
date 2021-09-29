import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

// Interface

// crear esquema
const Schema = mongoose.Schema;

const facturacionSchema = new Schema({

    idCreador: { type: String, required: [true, 'Es necesario el ID del creador'] }, // Sólo vendedor
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
facturacionSchema.plugin(uniqueValidator, { message: '{PATH}, ya existe!!' });

export = mongoose.model('archivos', facturacionSchema);