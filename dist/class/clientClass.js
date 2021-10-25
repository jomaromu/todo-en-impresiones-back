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
exports.ClientClass = void 0;
const nanoid_1 = require("nanoid");
const moment_1 = __importDefault(require("moment"));
// Modelos
const clientModel_1 = __importDefault(require("../models/clientModel"));
const castEstado_1 = require("../functions/castEstado");
class ClientClass {
    constructor() {
        this.idRef = (0, nanoid_1.nanoid)(10);
        this.token = '';
    }
    //  Crear un usuario
    nuevoUsuario(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const nombre = req.body.nombre;
            const apellido = req.body.apellido;
            const identificacion = req.body.identificacion;
            const ruc = req.body.ruc;
            const telefono = req.body.telefono;
            const correo = req.body.correo;
            const fecha_alta = (0, moment_1.default)().format("YYYY-MM-DD");
            const observacion = req.body.observacion;
            const sucursal = req.body.sucursal;
            const client_role = req.body.client_role;
            const nuevoUsuario = new clientModel_1.default({
                idReferencia: this.idRef,
                idCreador: req.usuario._id,
                nombre: nombre,
                apellido: apellido,
                identificacion: identificacion,
                ruc: ruc,
                telefono: telefono,
                correo: correo,
                fecha_alta: fecha_alta,
                observacion: observacion,
                sucursal: sucursal,
                client_role: client_role,
            });
            // Insertar usuario en la DB
            nuevoUsuario.save((err, usuarioDB) => {
                if (err) {
                    return resp.json({
                        ok: false,
                        mensaje: `No se pudo guardar el usuario la DB`,
                        err
                    });
                }
                else {
                    return resp.json({
                        ok: true,
                        mensaje: `Usuario Creado`,
                        usuarioDB
                    });
                }
            });
        });
    }
    // Editar un usuario
    editarUsuario(req, res) {
        const id = req.get('id') || '';
        const estadoBody = req.body.estado;
        const estado = (0, castEstado_1.castEstado)(estadoBody);
        const datosNuevos = {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            identificacion: req.body.identificacion,
            ruc: req.body.ruc,
            telefono: req.body.telefono,
            observacion: req.body.observacion,
            sucursal: req.body.sucursal,
            estado: estado,
        };
        clientModel_1.default.findById(id, (err, usuarioDB) => {
            if (err) {
                return res.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }
            if (!usuarioDB) {
                return res.json({
                    ok: false,
                    mensaje: `No se encontró un usuario con ese ID en la base de datos`
                });
            }
            if (!req.body.nombre) {
                datosNuevos.nombre = usuarioDB.nombre;
            }
            if (!req.body.apellido) {
                datosNuevos.apellido = usuarioDB.apellido;
            }
            if (!req.body.identificacion) {
                datosNuevos.identificacion = usuarioDB.identificacion;
            }
            if (!req.body.ruc) {
                datosNuevos.ruc = usuarioDB.ruc;
            }
            if (!req.body.telefono) {
                datosNuevos.telefono = usuarioDB.telefono;
            }
            if (!req.body.observacion) {
                datosNuevos.observacion = usuarioDB.observacion;
            }
            if (!req.body.sucursal) {
                datosNuevos.sucursal = usuarioDB.sucursal;
            }
            if (!req.body.estado) {
                datosNuevos.estado = usuarioDB.estado;
            }
            clientModel_1.default.findByIdAndUpdate(id, datosNuevos, { new: true }, (err, usuarioDBActualizado) => {
                if (err) {
                    return res.json({
                        ok: false,
                        mensaje: `Error interno`,
                        err
                    });
                }
                if (!usuarioDBActualizado) {
                    return res.json({
                        ok: false,
                        mensaje: `No se encontró un usuario con ese ID en la base de datos`
                    });
                }
                usuarioDBActualizado.password = ';)';
                return res.json({
                    ok: true,
                    mensaje: `Usuario actualizado`,
                    usuarioDBActualizado
                });
            });
        });
    }
    // Obtener usuario por ID
    obtenerUsuarioID(req, res) {
        const id = req.get('id') || '';
        clientModel_1.default.findById(id)
            .populate('sucursal')
            .exec((err, usuarioDB) => {
            if (err) {
                return res.json({
                    ok: false,
                    mensaje: `Error al búscar Usuario o no existe`,
                    err
                });
            }
            if (!usuarioDB) {
                return res.json({
                    ok: false,
                    mensaje: `No existe el Usuario en la base de datos`
                });
            }
            return res.json({
                ok: true,
                usuarioDB
            });
        });
    }
    // Obtener usuario por ID Referencia
    obtenerUsuarioIDRef(req, res) {
        const idReferencia = req.get('idReferencia');
        clientModel_1.default.findOne({ idReferencia: idReferencia })
            .populate('sucursal')
            .exec((err, usuarioDB) => {
            if (err) {
                return res.json({
                    ok: false,
                    mensaje: `Error al búscar Usuario o no existe`,
                    err
                });
            }
            if (!usuarioDB) {
                return res.json({
                    ok: false,
                    mensaje: `No existe el Usuario en la base de datos`
                });
            }
            return res.json({
                ok: true,
                usuarioDB
            });
        });
    }
    // Obtener usuario por Teléfono
    obtenerUsuarioTel(req, res) {
        const telefono = req.get('telefono');
        const estadoHeader = req.get('estado');
        const estado = (0, castEstado_1.castEstado)(estadoHeader);
        clientModel_1.default.find({ $and: [{ telefono: { $regex: telefono, $options: 'i' } }, { estado: estado }] })
            .populate('sucursal')
            .exec((err, usuarioDB) => {
            if (err) {
                return res.json({
                    ok: false,
                    mensaje: `Error al búscar Usuario o no existe`,
                    err
                });
            }
            if (!usuarioDB) {
                return res.json({
                    ok: false,
                    mensaje: `No existe el Usuario en la base de datos`
                });
            }
            return res.json({
                ok: true,
                usuarioDB
            });
        });
    }
    // Obtener usuarios por role
    obtenerUsuariosRole(req, res) {
        const role = req.get('client_role');
        const estadoHeader = req.get('estado');
        const estado = (0, castEstado_1.castEstado)(estadoHeader);
        clientModel_1.default.find({ $and: [{ client_role: role }, { estado: estado }] })
            .populate('sucursal')
            .exec((err, usuariosDB) => {
            if (err) {
                return res.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }
            if (!usuariosDB || usuariosDB.length === 0) {
                return res.json({
                    ok: false,
                    mensaje: `No existen usuarios con ese criterio de búsqueda`,
                    usuariosDB
                });
            }
            return res.json({
                ok: true,
                usuariosDB
            });
        });
    }
    // Obtener usuarios por criterio nombre
    obtenerUsuarioCriterioNombre(req, res) {
        const criterioNombre = req.body.criterioNombre;
        const estadoHeader = req.get('estado');
        const estado = (0, castEstado_1.castEstado)(estadoHeader);
        // /^[a-zA-ZáéíóúÁÉÍÓU]+$/
        clientModel_1.default.find({ $and: [{ nombre: { $regex: criterioNombre, $options: 'i' } }, { estado: estado }] })
            .populate('sucursal')
            .exec((err, usuariosDB) => {
            if (err) {
                return res.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }
            if (!usuariosDB || usuariosDB.length === 0) {
                return res.json({
                    ok: false,
                    mensaje: `No existen usuarios con ese criterio de búsqueda`,
                    usuariosDB
                });
            }
            return res.json({
                ok: true,
                usuariosDB
            });
        });
    }
    // Obtener usuarios por sucursal
    obtenerUsuariosSucursal(req, res) {
        const sucursal = req.get('sucursal');
        const estadoHeader = req.get('estado');
        const estado = (0, castEstado_1.castEstado)(estadoHeader);
        clientModel_1.default.find({ $and: [{ sucursal: sucursal }, { estado: estado }] })
            .populate('sucursal')
            .exec((err, usuariosDB) => {
            if (err) {
                return res.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }
            if (!usuariosDB || usuariosDB.length === 0) {
                return res.json({
                    ok: false,
                    mensaje: `No existen usuarios con ese criterio de búsqueda`,
                    usuariosDB
                });
            }
            return res.json({
                ok: true,
                usuariosDB
            });
        });
    }
    // Obtener usuario por sucursal
    obtenerUsuarioSucursal(req, res) {
        const sucursal = req.get('sucursal');
        const idUsuario = req.get('idUsuario');
        clientModel_1.default.find({ sucursal: sucursal, _id: idUsuario })
            .populate('sucursal')
            .exec((err, usuariosDB) => {
            if (err) {
                return res.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }
            if (!usuariosDB) {
                return res.json({
                    ok: false,
                    mensaje: `No existen usuarios con ese criterio de búsqueda`,
                    usuariosDB
                });
            }
            return res.json({
                ok: true,
                usuariosDB
            });
        });
    }
    // Obtener todos los usuarios
    obtenerTodosUsuarios(req, res) {
        const id = req.usuario._id;
        const estadoHeader = req.get('estado');
        const estado = (0, castEstado_1.castEstado)(estadoHeader);
        clientModel_1.default.find({ estado: estado }, (err, usuariosDB) => {
            if (err) {
                return res.json({
                    ok: false,
                    mensaje: `Error Interno`,
                    err
                });
            }
            if (!usuariosDB) {
                return res.json({
                    ok: false,
                    mensaje: `No se encontraron Usuarios en la Base de datos`
                });
            }
            return res.json({
                ok: true,
                mensaje: `Usuarios encontrados`,
                usuariosDB,
                cantUsuarios: usuariosDB.length
            });
        });
    }
    // Eliminar un usuario
    eliminarUsuario(req, res) {
        const id = req.get('id') || '';
        clientModel_1.default.findByIdAndDelete(id, {}, (err, usuarioEliminadoDB) => {
            if (err) {
                return res.json({
                    ok: false,
                    mensaje: 'Erro interno',
                    err
                });
            }
            if (!usuarioEliminadoDB) {
                return res.json({
                    ok: false,
                    mensaje: `No se encontró Usuario con este ID`
                });
            }
            return res.json({
                ok: true,
                mensaje: `Usuario eliminado`,
                usuarioEliminadoDB
            });
        });
    }
}
exports.ClientClass = ClientClass;
