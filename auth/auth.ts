import { NextFunction, Request, Response } from 'express';
import { CallbackError } from 'mongoose';
import jwt from 'jsonwebtoken';
const SEED = require('../environment/environment');

// Globales
import { environmnet } from '../environment/environment';

// Modelos
import roleWorkerModel from '../models/roleWorkerModel';
import roleClientModel from '../models/roleClientModel';
import workerModel from '../models/workerModel';
import etapaPedidoModel from '../models/etapaPedidoModel';
import metodoPagoModel from '../models/metodoPagoModel';
import pedidoModel from '../models/pedidoModel';

// Interfaces
import { RoleColModel } from '../interfaces/role';
import { RoleClientModelInterface } from '../interfaces/clientRole';
import { EtapaPedidoInterface, PedidoModelInterface } from '../interfaces/pedidos';
import { MetodoPagoInterface } from '../interfaces/metodoPago';

const verificaToken = (req: any, resp: Response, next: NextFunction) => {

    const token = req.get('token') || '';

    // Comprobación del token
    jwt.verify(token, environmnet.SEED, (err: any, decoded: any) => {

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
}

const crearUsuario = (req: any, resp: Response, next: NextFunction) => {

    const tokenRole = req.usuario.colaborador_role;

    if (tokenRole === 'SuperRole' || tokenRole === 'AdminRole') {
        next();
    } else {
        return resp.json({
            ok: false,
            mensaje: `No está autorizado para realizar esta operación`
        });
    }
}

const editarUsuario = (req: any, resp: Response, next: NextFunction) => {

    const tokenRole = req.usuario.colaborador_role;

    if (tokenRole === 'SuperRole' || tokenRole === 'AdminRole') {
        next();
    } else {
        return resp.json({
            ok: false,
            mensaje: `No está autorizado para realizar esta operación`
        });
    }
}

const eliminarUsuario = (req: any, resp: Response, next: NextFunction) => {

    const tokenRole = req.usuario.colaborador_role;

    if (tokenRole === 'SuperRole' || tokenRole === 'AdminRole') {
        next();
    } else {
        return resp.json({
            ok: false,
            mensaje: `No está autorizado para realizar esta operación`
        });
    }
}

const editarRole = (req: any, resp: Response, next: NextFunction) => {

    const id = req.get('id');

    roleWorkerModel.findById(id, (err: CallbackError, roleDB: RoleColModel) => {

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

        } else {
            next();
        }
    });

}

const editarRoleCliente = (req: any, resp: Response, next: NextFunction) => {

    const id = req.get('id');

    roleClientModel.findById(id, (err: CallbackError, roleDB: RoleClientModelInterface) => {

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

        } else {
            next();
        }
    });

}

const eliminarRole = (req: any, resp: Response, next: NextFunction) => {

    const id = req.get('id');

    roleWorkerModel.findById(id, (err: CallbackError, roleDB: RoleColModel) => {

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

        } else {
            next();
        }
    });

}

const eliminarRoleCliente = (req: any, resp: Response, next: NextFunction) => {

    const id = req.get('id');

    roleClientModel.findById(id, (err: CallbackError, roleDB: RoleClientModelInterface) => {

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

        } else {
            next();
        }
    });

}

const verClientes = (req: any, resp: Response, next: NextFunction) => {

    const colRole = req.usuario.colaborador_role;

    if (colRole === 'DiseniadorRole') {

        return resp.json({
            ok: false,
            mensaje: `No está autorizado para realizar esta operación`
        });

    } else {
        next();
    }
}

const editarEtapa = (req: any, resp: Response, next: NextFunction) => {

    const id = req.get('id');

    etapaPedidoModel.findById(id, (err: CallbackError, etapaPedidoDB: EtapaPedidoInterface) => {

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

        } else {
            next();
        }
    });

}

const eliminarEtapa = (req: any, resp: Response, next: NextFunction) => {

    const id = req.get('id');

    etapaPedidoModel.findById(id, (err: CallbackError, etapaPedidoDB: RoleColModel) => {

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

        } else {
            next();
        }
    });

}

const eliminarArchivo = (req: any, resp: Response, next: NextFunction) => {

    const tokenRole = req.usuario.colaborador_role;

    if (tokenRole === 'SuperRole' || tokenRole === 'AdminRole') {
        next();
    } else {
        return resp.json({
            ok: false,
            mensaje: `No está autorizado para realizar esta operación`
        });
    }
}

const editarMetodoPago = (req: any, resp: Response, next: NextFunction) => {

    const id = req.get('id');

    metodoPagoModel.findById(id, (err: CallbackError, metodoPagoDB: MetodoPagoInterface) => {

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

        } else {
            next();
        }
    });

}

const editarPedido = (req: any, resp: Response, next: NextFunction) => {

    const roleColaborador = req.usuario.colaborador_role;
    const id = req.get('id');
    // console.log(roleColaborador);

    pedidoModel.findById(id, (err: CallbackError, pedidoDB: PedidoModelInterface) => {

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

        if (roleColaborador === environmnet.colRole.DiseniadorRole) {

            return resp.json({
                ok: false,
                mensaje: `No está autorizado para realizar esta operación`
            });

        } else {

            next();
        }


    });

}

export {
    verificaToken,
    crearUsuario,
    editarUsuario,
    eliminarUsuario,
    editarRole,
    editarRoleCliente,
    eliminarRole,
    eliminarRoleCliente,
    verClientes,
    editarEtapa,
    eliminarEtapa,
    eliminarArchivo,
    editarMetodoPago,
    editarPedido
}