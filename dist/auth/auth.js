"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editarPedido = exports.editarMetodoPago = exports.eliminarArchivo = exports.eliminarEtapa = exports.editarEtapa = exports.verClientes = exports.eliminarRoleCliente = exports.eliminarRole = exports.editarRoleCliente = exports.editarRole = exports.eliminarUsuario = exports.editarUsuario = exports.crearUsuario = exports.verificaToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SEED = require('../environment/environment');
// Globales
const environment_1 = require("../environment/environment");
// Modelos
const roleWorkerModel_1 = __importDefault(require("../models/roleWorkerModel"));
const roleClientModel_1 = __importDefault(require("../models/roleClientModel"));
const etapaPedidoModel_1 = __importDefault(require("../models/etapaPedidoModel"));
const metodoPagoModel_1 = __importDefault(require("../models/metodoPagoModel"));
const pedidoModel_1 = __importDefault(require("../models/pedidoModel"));
const verificaToken = (req, resp, next) => {
    const token = req.get('token') || '';
    // Comprobación del token
    jsonwebtoken_1.default.verify(token, environment_1.environmnet.SEED, (err, decoded) => {
        if (err) {
            return resp.json({
                ok: false,
                mensaje: `Token incorrecto`,
                err
            });
        }
        // Insertar en el Request el usuario
        req.usuario = decoded.usuario;
        next();
    });
};
exports.verificaToken = verificaToken;
const crearUsuario = (req, resp, next) => {
    const tokenRole = req.usuario.colaborador_role;
    if (tokenRole === 'SuperRole' || tokenRole === 'AdminRole') {
        next();
    }
    else {
        return resp.json({
            ok: false,
            mensaje: `No está autorizado para realizar esta operación`
        });
    }
};
exports.crearUsuario = crearUsuario;
const editarUsuario = (req, resp, next) => {
    const tokenRole = req.usuario.colaborador_role;
    if (tokenRole === 'SuperRole' || tokenRole === 'AdminRole') {
        next();
    }
    else {
        return resp.json({
            ok: false,
            mensaje: `No está autorizado para realizar esta operación`
        });
    }
};
exports.editarUsuario = editarUsuario;
const eliminarUsuario = (req, resp, next) => {
    const tokenRole = req.usuario.colaborador_role;
    if (tokenRole === 'SuperRole' || tokenRole === 'AdminRole') {
        next();
    }
    else {
        return resp.json({
            ok: false,
            mensaje: `No está autorizado para realizar esta operación`
        });
    }
};
exports.eliminarUsuario = eliminarUsuario;
const editarRole = (req, resp, next) => {
    const id = req.get('id');
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
        if (roleDB.nivel === 0) {
            return resp.json({
                ok: false,
                mensaje: `Este role no es editable`,
            });
        }
        else {
            next();
        }
    });
};
exports.editarRole = editarRole;
const editarRoleCliente = (req, resp, next) => {
    const id = req.get('id');
    roleClientModel_1.default.findById(id, (err, roleDB) => {
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
        if (roleDB.nivel === 0) {
            return resp.json({
                ok: false,
                mensaje: `Este role no es editable`,
            });
        }
        else {
            next();
        }
    });
};
exports.editarRoleCliente = editarRoleCliente;
const eliminarRole = (req, resp, next) => {
    const id = req.get('id');
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
        if (roleDB.nivel === 0) {
            return resp.json({
                ok: false,
                mensaje: `Este role no se puede eliminar`,
            });
        }
        else {
            next();
        }
    });
};
exports.eliminarRole = eliminarRole;
const eliminarRoleCliente = (req, resp, next) => {
    const id = req.get('id');
    roleClientModel_1.default.findById(id, (err, roleDB) => {
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
        if (roleDB.nivel === 0) {
            return resp.json({
                ok: false,
                mensaje: `Este role no se puede eliminar`,
            });
        }
        else {
            next();
        }
    });
};
exports.eliminarRoleCliente = eliminarRoleCliente;
const verClientes = (req, resp, next) => {
    const colRole = req.usuario.colaborador_role;
    if (colRole === 'DiseniadorRole') {
        return resp.json({
            ok: false,
            mensaje: `No está autorizado para realizar esta operación`
        });
    }
    else {
        next();
    }
};
exports.verClientes = verClientes;
const editarEtapa = (req, resp, next) => {
    const id = req.get('id');
    etapaPedidoModel_1.default.findById(id, (err, etapaPedidoDB) => {
        if (err) {
            return resp.json({
                ok: false,
                mensaje: `Error interno`,
                err
            });
        }
        if (!etapaPedidoDB) {
            return resp.json({
                ok: false,
                mensaje: `No existe una etapa con ese ID`,
            });
        }
        if (etapaPedidoDB.nivel === 0) {
            return resp.json({
                ok: false,
                mensaje: `Esta etapa no es editable`,
            });
        }
        else {
            next();
        }
    });
};
exports.editarEtapa = editarEtapa;
const eliminarEtapa = (req, resp, next) => {
    const id = req.get('id');
    etapaPedidoModel_1.default.findById(id, (err, etapaPedidoDB) => {
        if (err) {
            return resp.json({
                ok: false,
                mensaje: `Error interno`,
                err
            });
        }
        if (!etapaPedidoDB) {
            return resp.json({
                ok: false,
                mensaje: `No existe al etapa con ese ID`,
            });
        }
        if (etapaPedidoDB.nivel === 0) {
            return resp.json({
                ok: false,
                mensaje: `Esta etapa no se puede eliminar`,
            });
        }
        else {
            next();
        }
    });
};
exports.eliminarEtapa = eliminarEtapa;
const eliminarArchivo = (req, resp, next) => {
    const tokenRole = req.usuario.colaborador_role;
    if (tokenRole === 'SuperRole' || tokenRole === 'AdminRole') {
        next();
    }
    else {
        return resp.json({
            ok: false,
            mensaje: `No está autorizado para realizar esta operación`
        });
    }
};
exports.eliminarArchivo = eliminarArchivo;
const editarMetodoPago = (req, resp, next) => {
    const id = req.get('id');
    metodoPagoModel_1.default.findById(id, (err, metodoPagoDB) => {
        if (err) {
            return resp.json({
                ok: false,
                mensaje: `Error interno`,
                err
            });
        }
        if (!metodoPagoDB) {
            return resp.json({
                ok: false,
                mensaje: `No existe el método con ese ID`,
            });
        }
        if (metodoPagoDB.nivel === 0) {
            return resp.json({
                ok: false,
                mensaje: `Este método no es editable`,
            });
        }
        else {
            next();
        }
    });
};
exports.editarMetodoPago = editarMetodoPago;
const editarPedido = (req, resp, next) => {
    const roleColaborador = req.usuario.colaborador_role;
    const id = req.get('id');
    // console.log(roleColaborador);
    pedidoModel_1.default.findById(id, (err, pedidoDB) => {
        if (err) {
            return resp.json({
                ok: false,
                mensaje: `Error interno`,
                err
            });
        }
        if (!pedidoDB) {
            return resp.json({
                ok: false,
                mensaje: `No se encontró un pedido`
            });
        }
        if (roleColaborador === environment_1.environmnet.colRole.DiseniadorRole) {
            return resp.json({
                ok: false,
                mensaje: `No está autorizado para realizar esta operación`
            });
        }
        else {
            next();
        }
    });
};
exports.editarPedido = editarPedido;
