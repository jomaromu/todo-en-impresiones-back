"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitacoraClass = void 0;
const moment_1 = __importDefault(require("moment"));
moment_1.default.locale('es');
// Modelos
const bitacoraModel_1 = __importDefault(require("../models/bitacoraModel"));
class BitacoraClass {
    constructor() { }
    crearBitacora(req, accion, pedidoDB) {
        return __awaiter(this, void 0, void 0, function* () {
            const idCreador = req.usuario._id;
            const fecha = (0, moment_1.default)().format('lll');
            const pedido = req.get('pedido');
            const nuevaBitacora = new bitacoraModel_1.default({
                idCreador: idCreador,
                pedido: pedidoDB._id,
                fecha_creacion: fecha,
                accion: accion
            });
            const respBitacora = yield nuevaBitacora.save();
            if (!respBitacora) {
                return false;
            }
            else {
                return true;
            }
        });
    }
}
exports.BitacoraClass = BitacoraClass;
