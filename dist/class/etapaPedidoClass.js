"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.etapaPedidoClass = void 0;
// Funciones
const castEstado_1 = require("../functions/castEstado");
// Modelos
const etapaPedidoModel_1 = __importDefault(require("../models/etapaPedidoModel"));
class etapaPedidoClass {
    nuevaEtapaPedido(req, resp) {
        const idCreador = req.usuario._id;
        const nombre = req.body.nombre;
        const nuevaEtapaPedido = new etapaPedidoModel_1.default({
            idCreador: idCreador,
            nombre: nombre
        });
        nuevaEtapaPedido.save((err, etapaPedidoDB) => {
            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `No se pudo crear la nueva etapa`,
                    err
                });
            }
            else {
                return resp.json({
                    ok: true,
                    mensaje: `Nueva etapa creada`,
                    etapaPedidoDB
                });
            }
        });
    }
    editarEtapaPedido(req, resp) {
        const id = req.get('id');
        const estadoHeader = req.get('estado');
        const estado = (0, castEstado_1.castEstado)(estadoHeader);
        const query = {
            nombre: req.body.nombre,
            nivel: Number(req.body.nivel),
            estado: estado
        };
        etapaPedidoModel_1.default.findById(id, (err, etapaPedidoDB) => {
            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Erro interno`,
                    err
                });
            }
            if (!etapaPedidoDB) {
                return resp.json({
                    ok: false,
                    mensaje: `No se encontró una etapa con ese ID`
                });
            }
            if (!req.query.nombre) {
                query.nombre = etapaPedidoDB.nombre;
            }
            if (!req.query.nivel) {
                query.nivel = etapaPedidoDB.nivel;
            }
            if (!req.query.estado) {
                query.estado = etapaPedidoDB.estado;
            }
            etapaPedidoModel_1.default.findByIdAndUpdate(id, query, { new: true }, (err, etapaActualizadaDB) => {
                if (err) {
                    return resp.json({
                        ok: false,
                        mensaje: `No se pudo editar la etapa`,
                        err
                    });
                }
                if (!etapaActualizadaDB) {
                    return resp.json({
                        ok: false,
                        mensaje: `No existe la etapa que quiere Editar`
                    });
                }
                return resp.json({
                    ok: true,
                    mensaje: `Etapa actualizada`,
                    etapaActualizadaDB
                });
            });
        });
    }
    obtenerEtapaPedido(req, resp) {
        const id = req.get('id');
        etapaPedidoModel_1.default.findById(id, (err, etapaPedidoDB) => {
            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Erro interno`,
                    err
                });
            }
            if (!etapaPedidoDB) {
                return resp.json({
                    ok: false,
                    mensaje: `No se encontró una etapa con ese ID`
                });
            }
            return resp.json({
                ok: true,
                etapaPedidoDB
            });
        });
    }
    obtenerTodasEtapaPedido(req, resp) {
        const estadoHeader = req.get('estado');
        const estado = (0, castEstado_1.castEstado)(estadoHeader);
        etapaPedidoModel_1.default.find({ estado: estado }, (err, etapaPedidoDB) => {
            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Erro interno`,
                    err
                });
            }
            if (!etapaPedidoDB) {
                return resp.json({
                    ok: false,
                    mensaje: `No se encontró una etapa con ese ID`
                });
            }
            return resp.json({
                ok: true,
                etapaPedidoDB,
                cantidad: etapaPedidoDB.length
            });
        });
    }
    eliminarEtapaPedido(req, resp) {
        const id = req.get('id');
        etapaPedidoModel_1.default.findByIdAndDelete(id, {}, (err, etapaPedidoDB) => {
            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Erro interno`,
                    err
                });
            }
            if (!etapaPedidoDB) {
                return resp.json({
                    ok: false,
                    mensaje: `No se encontró una etapa con ese ID`
                });
            }
            return resp.json({
                ok: true,
                etapaPedidoDB
            });
        });
    }
}
exports.etapaPedidoClass = etapaPedidoClass;
