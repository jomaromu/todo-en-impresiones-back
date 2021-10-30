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
exports.WorkkerClass = void 0;
const nanoid_1 = require("nanoid");
const moment_1 = __importDefault(require("moment"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const environment_1 = require("../environment/environment");
// Modelo
const workerModel_1 = __importDefault(require("../models/workerModel"));
// Funciones
const nivelWorker_1 = require("../functions/nivelWorker");
const castEstado_1 = require("../functions/castEstado");
class WorkkerClass {
    constructor() {
        this.pathIds = `workderIDs.json`;
        this.idRef = (0, nanoid_1.nanoid)(10);
        this.token = '';
    }
    //  Crear un usuario super
    nuevoUsuarioSuper(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = req.body.correo;
            const pass = req.body.password;
            const role = req.body.colaborador_role;
            if (!email || !pass || !role) {
                return resp.json({
                    ok: false,
                    mensaje: `Necesita llenar al menos correo, password y role`
                });
            }
            else {
                if (email === environment_1.environmnet.emailSuper && pass === environment_1.environmnet.passSuper && role === environment_1.environmnet.colaborador_role) {
                    const nombre = req.body.nombre;
                    const apellido = req.body.apellido;
                    const identificacion = req.body.identificacion;
                    const telefono = req.body.telefono;
                    const correo = req.body.correo;
                    const password = bcrypt_1.default.hashSync(req.body.password, 10);
                    const fecha_alta = (0, moment_1.default)().format("MMM Do YY");
                    const colaborador_role = req.body.colaborador_role;
                    const sucursal = req.body.sucursal;
                    const nuevoUsuario = new workerModel_1.default({
                        idReferencia: this.idRef,
                        nombre: nombre,
                        apellido: apellido,
                        identificacion: identificacion,
                        telefono: telefono,
                        correo: correo,
                        password: password,
                        fecha_alta: fecha_alta,
                        colaborador_role: colaborador_role,
                        sucursal: sucursal,
                    });
                    // console.log(nombre);
                    // return;
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
                            usuarioDB.password = ';)';
                            return resp.json({
                                ok: true,
                                mensaje: `Usuario Creado`,
                                usuarioDB
                            });
                        }
                    });
                }
            }
        });
    }
    //  Crear un usuario
    nuevoUsuario(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const nombre = req.body.nombre;
            const apellido = req.body.apellido;
            const identificacion = req.body.identificacion;
            const telefono = req.body.telefono;
            const correo = req.body.correo;
            const password = bcrypt_1.default.hashSync(req.body.password, 10);
            const fecha_alta = (0, moment_1.default)().format("MMM Do YY");
            const colaborador_role = req.body.colaborador_role;
            const sucursal = req.body.sucursal;
            const nuevoUsuario = new workerModel_1.default({
                idReferencia: this.idRef,
                nombre: nombre,
                apellido: apellido,
                identificacion: identificacion,
                telefono: telefono,
                correo: correo,
                password: password,
                fecha_alta: fecha_alta,
                colaborador_role: colaborador_role,
                sucursal: sucursal,
            });
            // console.log(nombre);
            // return;
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
                    usuarioDB.password = ';)';
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
        const colaborador_role = req.get('colaborador_role') || '';
        const datosNuevos = {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            telefono: req.body.telefono,
            sucursal: req.body.sucursal,
            estado: req.body.estado,
            identificacion: req.body.identificacion,
            colaborador_role: colaborador_role,
        };
        workerModel_1.default.findById(id, (err, usuarioDB) => {
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
            if (req.usuario.correo === usuarioDB.correo) {
                return res.json({
                    ok: false,
                    mensaje: `No puede editar su mismo usuario`
                });
            }
            if (!req.body.nombre) {
                datosNuevos.nombre = usuarioDB.nombre;
            }
            if (!req.body.apellido) {
                datosNuevos.apellido = usuarioDB.apellido;
            }
            if (!req.body.telefono) {
                datosNuevos.telefono = usuarioDB.telefono;
            }
            if (!req.body.sucursal) {
                datosNuevos.sucursal = usuarioDB.sucursal;
            }
            if (!req.body.estado) {
                datosNuevos.estado = usuarioDB.estado;
            }
            if (!req.get('colaborador_role')) {
                datosNuevos.colaborador_role = usuarioDB.colaborador_role;
            }
            workerModel_1.default.findByIdAndUpdate(id, datosNuevos, { new: true }, (err, usuarioDBActualizado) => {
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
    // Editar perfil
    EditarPefil(req, res) {
        const correoToken = req.usuario.correo;
        const id = req.usuario._id;
        const estadoHeader = req.get('estado');
        const estado = (0, castEstado_1.castEstado)(estadoHeader);
        const query = {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            telefono: req.body.telefono,
            correo: req.body.correo,
            password: req.body.password,
            estado: estado
        };
        workerModel_1.default.findOne({ correo: correoToken, _id: id }, (err, workerDB) => {
            if (err) {
                return res.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }
            if (!workerDB) {
                return res.json({
                    ok: false,
                    mensaje: `No se encontró un usuario`
                });
            }
            if (!query.nombre) {
                query.nombre = workerDB.nombre;
            }
            if (!query.apellido) {
                query.apellido = workerDB.apellido;
            }
            if (!query.telefono) {
                query.telefono = workerDB.telefono;
            }
            if (!query.correo) {
                query.correo = workerDB.correo;
            }
            if (!query.estado) {
                query.estado = workerDB.estado;
            }
            if (!query.password) {
                query.password = workerDB.password;
            }
            else {
                query.password = bcrypt_1.default.hashSync(req.body.password, 10);
            }
            // return;
            workerModel_1.default.findOneAndUpdate({ correo: correoToken, _id: id }, query, { new: true }, (err, workerActualizadoDB) => {
                if (err) {
                    return res.json({
                        ok: false,
                        mensaje: `Error interno`,
                        err
                    });
                }
                return res.json({
                    ok: true,
                    mensaje: `Usuario actualizado`,
                    workerActualizadoDB
                });
            });
        });
    }
    // Obtener usuario por ID
    obtenerUsuarioID(req, res) {
        const id = req.get('id') || '';
        workerModel_1.default.findById(id, (err, usuario) => {
            if (err) {
                return res.json({
                    ok: false,
                    mensaje: `Error al búscar Usuario o no existe`,
                    err
                });
            }
            if (!usuario) {
                return res.json({
                    ok: false,
                    mensaje: `No existe el Usuario en la base de datos`
                });
            }
            const resultado = (0, nivelWorker_1.evaluaRole)(req.usuario.colaborador_role, usuario.colaborador_role);
            if (resultado === 0) {
                return res.json({
                    ok: false,
                    mensaje: `No está autorizado para realizar esta operación`
                });
            }
            else if (resultado === 1) {
                return res.json({
                    ok: true,
                    usuario
                });
            }
        });
    }
    // Obtener usuario por ID Referencia
    obtenerUsuarioIDRef(req, res) {
        const idReferencia = req.get('idReferencia');
        workerModel_1.default.findOne({ idReferencia: idReferencia }, (err, usuarioDB) => {
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
            const resultado = (0, nivelWorker_1.evaluaRole)(req.usuario.colaborador_role, usuarioDB.colaborador_role);
            if (resultado === 0) {
                return res.json({
                    ok: false,
                    mensaje: `No está autorizado para realizar esta operación`
                });
            }
            else if (resultado === 1) {
                return res.json({
                    ok: true,
                    usuarioDB
                });
            }
        });
    }
    // Obtener usuario por Teléfono
    obtenerUsuarioTel(req, res) {
        const telefono = req.get('telefono');
        workerModel_1.default.findOne({ telefono: telefono }, (err, usuarioDB) => {
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
            const resultado = (0, nivelWorker_1.evaluaRole)(req.usuario.colaborador_role, usuarioDB.colaborador_role);
            if (resultado === 0) {
                return res.json({
                    ok: false,
                    mensaje: `No está autorizado para realizar esta operación`
                });
            }
            else if (resultado === 1) {
                return res.json({
                    ok: true,
                    usuarioDB
                });
            }
        });
    }
    // Obtener usuarios por role
    obtenerUsuariosRole(req, res) {
        const estadoHeader = req.get('estado');
        const estado = (0, castEstado_1.castEstado)(estadoHeader);
        const role = req.get('role');
        // console.log(req.usuario.role);
        workerModel_1.default.find({ $and: [{ colaborador_role: role }, { estado: estado }] }, (err, usuariosDB) => {
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
            const resultado = (0, nivelWorker_1.evaluaRole)(req.usuario.colaborador_role, role);
            if (resultado === 0) {
                return res.json({
                    ok: false,
                    mensaje: `No está autorizado para realizar esta operación`
                });
            }
            else if (resultado === 1) {
                return res.json({
                    ok: true,
                    usuariosDB,
                    cantidad: usuariosDB.length
                });
            }
        });
    }
    // Obtener usuarios por criterio nombre
    obtenerUsuarioCriterioNombre(req, res) {
        const estadoHeader = req.get('estado');
        const estado = (0, castEstado_1.castEstado)(estadoHeader);
        const criterioNombre = req.body.criterioNombre;
        // /^[a-zA-ZáéíóúÁÉÍÓU]+$/
        workerModel_1.default.find({ nombre: { $regex: criterioNombre, $options: 'i' }, estado: estado }, (err, usuariosDB) => {
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
            const usuarios = usuariosDB.filter((usuario) => {
                const roleDB = usuario.colaborador_role;
                const roleToken = req.usuario.colaborador_role;
                const resultado = (0, nivelWorker_1.evaluaRole)(roleToken, roleDB);
                if (resultado === 1) {
                    return usuario;
                }
            });
            return res.json({
                ok: true,
                usuarios,
                cantidad: usuarios.length
            });
        });
    }
    // Obtener usuarios por sucursal
    obtenerUsuariosSucursal(req, res) {
        const estadoHeader = req.get('estado');
        const estado = (0, castEstado_1.castEstado)(estadoHeader);
        const sucursal = req.get('sucursal');
        const id = req.usuario._id;
        ;
        workerModel_1.default.find({ $and: [{ sucursal: sucursal }, { estado: estado }] }, (err, usuariosDB) => {
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
            const usuarios = usuariosDB.filter((usuario) => {
                const roleDB = usuario.colaborador_role;
                const roleToken = req.usuario.colaborador_role;
                const resultado = (0, nivelWorker_1.evaluaRole)(roleToken, roleDB);
                if (resultado === 1) {
                    return usuario;
                }
            });
            return res.json({
                ok: true,
                usuarios,
                cantidad: usuarios.length
            });
        });
    }
    // Obtener usuario por sucursal
    obtenerUsuarioSucursal(req, res) {
        const sucursal = req.get('sucursal');
        const idUsuario = req.get('idUsuario');
        workerModel_1.default.findOne({ sucursal: sucursal, _id: idUsuario }, (err, usuarioDB) => {
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
                    mensaje: `No existen usuarios con ese criterio de búsqueda`,
                });
            }
            const resultado = (0, nivelWorker_1.evaluaRole)(req.usuario.colaborador_role, usuarioDB.colaborador_role);
            if (resultado === 0) {
                return res.json({
                    ok: false,
                    mensaje: `No está autorizado para realizar esta operación`
                });
            }
            else if (resultado === 1) {
                return res.json({
                    ok: true,
                    usuarioDB
                });
            }
        });
    }
    // Obtener todos los usuarios
    obtenerTodosUsuarios(req, res) {
        const estadoHeader = req.get('estado');
        const estado = (0, castEstado_1.castEstado)(estadoHeader);
        const id = req.usuario._id;
        workerModel_1.default.find({ $and: [{ _id: { $ne: id }, colaborador_role: { $ne: 'SuperRole' } }] }, (err, usuariosDB) => {
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
            const usuarios = usuariosDB.filter((usuario) => {
                const roleDB = usuario.colaborador_role;
                const roleToken = req.usuario.colaborador_role;
                const resultado = (0, nivelWorker_1.evaluaRole)(roleToken, roleDB);
                if (resultado === 1) {
                    return usuario;
                }
            });
            return res.json({
                ok: true,
                usuarios,
                cantidad: usuarios.length
            });
        });
    }
    // Eliminar un usuario
    eliminarUsuario(req, res) {
        const id = req.get('id') || '';
        workerModel_1.default.findByIdAndDelete(id, {}, (err, usuarioEliminadoDB) => {
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
    // Loguear Usuario
    loguearUsuario(req, resp) {
        const correo = req.body.correo;
        const password = req.body.password;
        // Actualizar la fecha de login
        const fecha = (0, moment_1.default)().format("YYYY-MM-DD");
        workerModel_1.default.findOne({ correo: correo }, (err, usuarioDB) => {
            // Error interno
            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error al Loguear Usuario`,
                    err
                });
            }
            // Verificar correo
            if (!usuarioDB) {
                return resp.json({
                    ok: false,
                    mensaje: `Credenciales incorrectas - correo`
                });
            }
            // Verifica password
            if (!bcrypt_1.default.compareSync(password, usuarioDB.password)) {
                return resp.json({
                    ok: false,
                    mensaje: `Credenciales incorrectas - password`
                });
            }
            const sumaLogin = usuarioDB.cantVisitas + 1;
            workerModel_1.default.findByIdAndUpdate(usuarioDB._id, { fecha_login: fecha, cantVisitas: sumaLogin }, { new: true }, (err, usuarioFechaDB) => {
                if (err) {
                    resp.json({
                        ok: false,
                        mensaje: `Error al actualzar fecha de Login, intentelo más tarde`,
                        err
                    });
                }
                else {
                    // Crear token
                    usuarioFechaDB.password = ':)';
                    this.token = jsonwebtoken_1.default.sign({ usuario: usuarioFechaDB }, environment_1.environmnet.SEED, { expiresIn: 3600 }); // Token válido por una hora 3600
                    return resp.json({
                        ok: true,
                        mensaje: `Acceso correcto`,
                        usuarioFechaDB,
                        token: this.token
                    });
                }
            });
        });
    }
    decodificarToken(req, resp) {
        const token = req.get('token');
        // Comprobación del token
        jsonwebtoken_1.default.verify(token, environment_1.environmnet.SEED, (err, decoded) => {
            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Token incorrecto`,
                    err
                });
            }
            else {
                return resp.json({
                    ok: true,
                    mensaje: `Token correcto`,
                    usuario: decoded.usuario,
                    token,
                    iat: decoded.iat,
                    exp: decoded.exp,
                });
            }
        });
    }
    refrescarToken(req, resp) {
        const idUsuario = req.body.idUsuario;
        workerModel_1.default.findById(idUsuario, (err, usuarioDB) => {
            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }
            if (!usuarioDB) {
                return resp.json({
                    ok: false,
                    mensaje: `No existe un usuario ${idUsuario}`
                });
            }
            // Crear token
            usuarioDB.password = ':)';
            this.token = jsonwebtoken_1.default.sign({ usuario: usuarioDB }, environment_1.environmnet.SEED, { expiresIn: 3600 }); // Token válido por una hora
            return resp.json({
                ok: true,
                mensaje: `Acceso correcto`,
                usuario: usuarioDB,
                token: this.token
            });
        });
    }
}
exports.WorkkerClass = WorkkerClass;
