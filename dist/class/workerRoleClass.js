"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleColClass = void 0;
const castEstado_1 = require("../functions/castEstado");
// Modelo 
const roleWorkerModel_1 = __importDefault(require("../models/roleWorkerModel"));
class RoleColClass {
    constructor() { }
    // Nuevo role
    nuevoRole(req, resp) {
        const idCreador = req.usuario._id;
        const nombre = req.body.nombre;
        const nuevoRole = new roleWorkerModel_1.default({
            idCreador: idCreador,
            nombre: nombre
        });
        nuevoRole.save((err, roleDB) => {
            if (err) {
                return resp.json({
                    mensaje: `Error interno`,
                    err
                });
            }
            else {
                return resp.json({
                    ok: true,
                    mensaje: `Role ${nombre} creado`,
                    roleDB
                });
            }
        });
    }
    // Editar role
    editarRole(req, resp) {
        const id = req.get('id');
        const estadoHeader = req.get('estado');
        const estado = (0, castEstado_1.castEstado)(estadoHeader);
        const query = {
            nombre: req.body.nombre,
            nivel: Number(req.body.nivel),
            estado: estado
        };
        roleWorkerModel_1.default.findById(id, (err, roleDB) => {
            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }
            if (!roleDB) {
                return resp.json({
                    ok: false,
                    mensaje: `No existe el role con ese ID`,
                });
            }
            if (!query.nombre) {
                query.nombre = roleDB.nombre;
            }
            if (!query.nivel) {
                query.nivel = roleDB.nivel;
            }
            if (!query.estado) {
                query.estado = roleDB.estado;
            }
            roleWorkerModel_1.default.findByIdAndUpdate(id, query, { new: true }, (err, nuevoRoleDB) => {
                if (err) {
                    return resp.json({
                        ok: false,
                        mensaje: `No se pudo editar la Sucursal`,
                        err
                    });
                }
                if (!nuevoRoleDB) {
                    return resp.json({
                        ok: false,
                        mensaje: `No existe el role que quiere Editar`,
                    });
                }
                return resp.json({
                    ok: true,
                    mensaje: `Role actualizado`,
                    nuevoRoleDB
                });
            });
        });
    }
    // Obtener role por ID
    obtenerRoleID(req, resp) {
        const id = req.get('id');
        roleWorkerModel_1.default.findById(id, (err, roleDB) => {
            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error al búscar role o no existe`,
                    err
                });
            }
            if (!roleDB) {
                return resp.json({
                    ok: false,
                    mensaje: `No existe el role en la base de datos`
                });
            }
            return resp.json({
                ok: true,
                roleDB
            });
        });
    }
    // Obtener todos los roles
    obtenerTodos(req, resp) {
        const estadoHeader = req.get('estado');
        const estado = (0, castEstado_1.castEstado)(estadoHeader);
        roleWorkerModel_1.default.find({ estado: estado }, (err, rolesDB) => {
            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error al búscar role o no existe`,
                    err
                });
            }
            if (!rolesDB || rolesDB.length === 0) {
                return resp.json({
                    ok: false,
                    mensaje: `No existen roles en la base de datos`
                });
            }
            return resp.json({
                ok: true,
                rolesDB
            });
        });
    }
    // Eliminar un role por ID
    eliminarRole(req, resp) {
        const id = req.get('id');
        roleWorkerModel_1.default.findByIdAndDelete(id, {}, (err, roleDB) => {
            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }
            if (!roleDB) {
                return resp.json({
                    ok: false,
                    mensaje: `No existe el role en la base de datos`
                });
            }
            return resp.json({
                ok: true,
                roleDB
            });
        });
    }
}
exports.RoleColClass = RoleColClass;
