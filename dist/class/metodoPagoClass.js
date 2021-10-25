"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetodoPagoClass = void 0;
// Funciones
const castEstado_1 = require("../functions/castEstado");
// Modelos
const metodoPagoModel_1 = __importDefault(require("../models/metodoPagoModel"));
class MetodoPagoClass {
    constructor() { }
    crearMetodoPago(req, resp) {
        const nuevoMetodoPago = new metodoPagoModel_1.default({
            idCreador: req.usuario._id,
            nombre: req.body.nombre
        });
        nuevoMetodoPago.save((err, metodoPagoDB) => {
            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }
            return resp.json({
                ok: true,
                mensaje: `Método de pago ${req.body.nombre} creado`,
                metodoPagoDB
            });
        });
    }
    editarMetodoPago(req, resp) {
        const id = req.get('id');
        const nombreBody = req.body.nombre;
        const estadBody = req.body.estado;
        const nivelBody = Number(req.body.nivel);
        const estadoHeader = req.get('estado');
        const estado = (0, castEstado_1.castEstado)(estadoHeader);
        const query = {
            nombre: nombreBody,
            estado: estado,
            nivel: nivelBody
        };
        metodoPagoModel_1.default.findById(id, (err, metodoActualizadoDB) => {
            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }
            if (!metodoActualizadoDB) {
                return resp.json({
                    ok: false,
                    mensaje: `No se encontró un método de pago con ese ID`,
                });
            }
            if (query.nombre) {
                query.nombre = metodoActualizadoDB.nombre;
            }
            if (query.estado) {
                query.estado = metodoActualizadoDB.estado;
            }
            if (query.nivel) {
                query.nivel = metodoActualizadoDB.nivel;
            }
            metodoPagoModel_1.default.findByIdAndUpdate(id, query, { new: true }, (err, metodoActualizadoDB) => {
                if (err) {
                    return resp.json({
                        ok: false,
                        mensaje: `Error interno`,
                        err
                    });
                }
                return resp.json({
                    ok: true,
                    metodoActualizadoDB
                });
            });
        });
    }
    obtenerMetodoID(req, resp) {
        const id = req.get('id');
        metodoPagoModel_1.default.findById(id, (err, metodoDB) => {
            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }
            if (!metodoDB) {
                return resp.json({
                    ok: false,
                    mensaje: `No se encontró un método de pago con ese ID`,
                });
            }
            return resp.json({
                ok: true,
                metodoDB
            });
        });
    }
    obtenerTododsMetodos(req, resp) {
        const estadoHeader = req.get('estado');
        const estado = (0, castEstado_1.castEstado)(estadoHeader);
        metodoPagoModel_1.default.find({ estado: estado }, (err, metodosDB) => {
            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }
            return resp.json({
                ok: true,
                metodosDB,
                cantidad: metodosDB.length
            });
        });
    }
    eliminarMetodoID(req, resp) {
        const id = req.get('id');
        metodoPagoModel_1.default.findByIdAndDelete(id, {}, (err, metodoDB) => {
            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }
            if (!metodoDB) {
                return resp.json({
                    ok: false,
                    mensaje: `No se encontró un método de pago con ese ID`,
                });
            }
            return resp.json({
                ok: true,
                metodoDB
            });
        });
    }
}
exports.MetodoPagoClass = MetodoPagoClass;
