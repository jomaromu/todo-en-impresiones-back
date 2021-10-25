"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prioridadClass = void 0;
// Funciones
const castEstado_1 = require("../functions/castEstado");
// Modelos
const prioridadPedidoModel_1 = __importDefault(require("../models/prioridadPedidoModel"));
class prioridadClass {
    nuevaProridad(req, resp) {
        const idCreador = req.usuario._id;
        const nombre = req.body.nombre;
        const color = req.body.color;
        const importancia = Number(req.body.importancia);
        const nuevaPrioridadPedido = new prioridadPedidoModel_1.default({
            idCreador: idCreador,
            color_prioridad: color,
            nombre: nombre,
            importancia: importancia
        });
        nuevaPrioridadPedido.save((err, prioridadPedidoDB) => {
            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `No se pudo crear la prioridad`,
                    err
                });
            }
            else {
                return resp.json({
                    ok: true,
                    mensaje: `Nueva etapa creada`,
                    prioridadPedidoDB
                });
            }
        });
    }
    editarPrioridadPedido(req, resp) {
        const id = req.get('id');
        const estadoHeader = req.get('estado');
        const estado = (0, castEstado_1.castEstado)(estadoHeader);
        const query = {
            nombre: req.body.nombre,
            color_prioridad: req.body.color,
            importancia: Number(req.body.importancia),
            nivel: Number(req.body.nivel),
            estado: estado
        };
        prioridadPedidoModel_1.default.findById(id, (err, prioridadPedidoDB) => {
            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Erro interno`,
                    err
                });
            }
            if (!prioridadPedidoDB) {
                return resp.json({
                    ok: false,
                    mensaje: `No se encontró una etapa con ese ID`
                });
            }
            if (!req.body.nombre) {
                query.nombre = prioridadPedidoDB.nombre;
            }
            if (!req.body.color) {
                query.color_prioridad = prioridadPedidoDB.color_prioridad;
            }
            if (!req.body.importancia) {
                query.importancia = prioridadPedidoDB.importancia;
            }
            if (!req.body.nivel) {
                query.nivel = prioridadPedidoDB.nivel;
            }
            if (!query.estado) {
                query.estado = prioridadPedidoDB.estado;
            }
            prioridadPedidoModel_1.default.findByIdAndUpdate(id, query, { new: true }, (err, prioridadActualizadaDB) => {
                if (err) {
                    return resp.json({
                        ok: false,
                        mensaje: `No se pudo editar la prioridad`,
                        err
                    });
                }
                if (!prioridadActualizadaDB) {
                    return resp.json({
                        ok: false,
                        mensaje: `No existe la prioridad que quiere Editar`
                    });
                }
                return resp.json({
                    ok: true,
                    mensaje: `Prioridad actualizada`,
                    prioridadActualizadaDB
                });
            });
        });
    }
    obtenerPrioridadID(req, resp) {
        const id = req.get('id');
        prioridadPedidoModel_1.default.findById(id, (err, prioridadPedidoDB) => {
            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }
            if (!prioridadPedidoDB) {
                return resp.json({
                    ok: false,
                    mensaje: `No existe la prioridad en la base de datos`
                });
            }
            return resp.json({
                ok: true,
                prioridadPedidoDB
            });
        });
    }
    obtenerTodasPrioridades(req, resp) {
        const estadoHeader = req.get('estado');
        const estado = (0, castEstado_1.castEstado)(estadoHeader);
        prioridadPedidoModel_1.default.find({ estado: estado }, (err, prioridadPedidoDB) => {
            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }
            return resp.json({
                ok: true,
                prioridadPedidoDB
            });
        });
    }
    eliminarPrioridad(req, resp) {
        const id = req.get('id');
        prioridadPedidoModel_1.default.findByIdAndDelete(id, {}, (err, prioridadPedidoDB) => {
            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }
            if (!prioridadPedidoDB) {
                return resp.json({
                    ok: false,
                    mensaje: `No existe la prioridad que desea eliminar`
                });
            }
            return resp.json({
                ok: true,
                mensaje: `Prioridad eliminada`,
                prioridadPedidoDB
            });
        });
    }
}
exports.prioridadClass = prioridadClass;
