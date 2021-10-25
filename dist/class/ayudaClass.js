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
exports.AyudaClass = void 0;
// Modelo
const ayudaModel_1 = __importDefault(require("../models/ayudaModel"));
class AyudaClass {
    constructor() { }
    crearAyuda(req, resp) {
        const nombre = req.body.nombre;
        const descripcion = req.body.descripcion;
        const idCreador = req.usuario._id;
        const nuevaAyuda = new ayudaModel_1.default({
            idCreador: idCreador,
            nombre: nombre,
            descripcion: descripcion
        });
        nuevaAyuda.save((err, ayudaDB) => {
            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }
            else {
                return resp.json({
                    ok: true,
                    ayudaDB
                });
            }
        });
    }
    editarAyuda(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.get('id');
            ayudaModel_1.default.findById(id, (err, ayudaDB) => {
                if (err) {
                    return resp.json({
                        ok: false,
                        mensaje: `Error interno`,
                        err
                    });
                }
                if (!ayudaDB) {
                    return resp.json({
                        ok: false,
                        mensaje: `No se encontró una ayuda`
                    });
                }
                const query = {
                    nombre: req.body.nombre,
                    descripcion: req.body.descripcion
                };
                if (!query.nombre) {
                    query.nombre = ayudaDB.nombre;
                }
                if (!query.descripcion) {
                    query.descripcion = ayudaDB.descripcion;
                }
                ayudaModel_1.default.findByIdAndUpdate(id, query, { new: true }, (err, ayudaActualizadaDB) => {
                    if (err) {
                        return resp.json({
                            ok: false,
                            mensaje: `Error interno`,
                            err
                        });
                    }
                    return resp.json({
                        ok: true,
                        ayudaActualizadaDB
                    });
                });
            });
        });
    }
    obtenerAyudaID(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.get('id');
            const respAyuda = yield ayudaModel_1.default.findById(id);
            if (!respAyuda) {
                return resp.json({
                    ok: false,
                    mensaje: `No se encontró una ayuda o un error ha ocurrido`
                });
            }
            else {
                return resp.json({
                    ok: true,
                    respAyuda
                });
            }
        });
    }
    obtenerTodas(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const respAyuda = yield ayudaModel_1.default.find({});
            if (!respAyuda) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno o no se encontraron ayuda(s)`
                });
            }
            else {
                resp.json({
                    ok: true,
                    respAyuda
                });
            }
        });
    }
    eliminarAyuda(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.get('id');
            const respAyuda = yield ayudaModel_1.default.findByIdAndDelete(id);
            if (!respAyuda) {
                return resp.json({
                    ok: false,
                    mensaje: `No se encontró una ayuda o un error ha ocurrido`
                });
            }
            else {
                return resp.json({
                    ok: true,
                    respAyuda
                });
            }
        });
    }
}
exports.AyudaClass = AyudaClass;
