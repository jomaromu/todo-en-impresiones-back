import { Response } from "express";
import { CallbackError } from "mongoose";

// Funciones
import { castEstado } from "../functions/castEstado";

// Interfaces
import { OrigenPedidoInterface } from "../interfaces/origenPedido";

// Modelos
import origenPedidoModel from "../models/origenPedidoModel";

export class OrigenPedido {

    constructor() { }

    crearOrigen(req: any, resp: Response): void {

        const idCreador = req.usuario._id;
        const nombre = req.body.nombre;

        const nuevoOrigen = new origenPedidoModel({
            idCreador: idCreador,
            nombre: nombre
        });

        nuevoOrigen.save((err: CallbackError, origenDB: OrigenPedidoInterface) => {

            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }

            return resp.json({
                ok: true,
                mensaje: `Origen de pedido creado`,
                origenDB
            });
        });
    }

    async editarOrigen(req: any, resp: Response): Promise<any> {

        const id = req.get('id');
        const nombre = req.body.nombre;

        const estadoHeader: string = req.get('estado');
        const estado: boolean = castEstado(estadoHeader);

        const respOrigen = await origenPedidoModel.findById(id).exec();

        if (!respOrigen) {

            return resp.json({
                ok: false,
                mensaje: `No se encontró un Origen de Pedido`
            });

        } else {

            const query = {
                nombre: nombre,
                estado: estado
            }

            if (!query.nombre) {
                query.nombre = respOrigen.nombre;
            }

            if (!query.estado) {
                query.estado = respOrigen.estado;
            }

            origenPedidoModel.findByIdAndUpdate(id, query, { new: true }, (err: CallbackError, origenActualizadoDB: any) => {

                if (err) {
                    return resp.json({
                        ok: false,
                        mensaje: `Error interno`,
                        err
                    });
                }

                return resp.json({
                    ok: true,
                    origenActualizadoDB
                });
            });
        }

    }

    obtenerOrigen(req: any, resp: Response): void {

        const id = req.get('id');

        origenPedidoModel.findById(id, (err: CallbackError, origenDB: OrigenPedidoInterface) => {

            if (err) {

                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }

            if (!origenDB) {
                return resp.json({
                    ok: false,
                    mensaje: `No se encontró un Origen de Pedido`
                });
            }

            return resp.json({
                ok: true,
                origenDB
            });
        })
    }

    obtenerOrigenes(req: any, resp: Response): void {

        const estadoHeader: string = req.get('estado');
        const estado: boolean = castEstado(estadoHeader);

        origenPedidoModel.find({ estado: estado }, (err: CallbackError, origenesDB: Array<OrigenPedidoInterface>) => {

            if (err) {

                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }

            if (origenesDB.length === 0) {
                return resp.json({
                    ok: false,
                    mensaje: `No se encontró un Origen de Pedido`
                });
            }

            return resp.json({
                ok: true,
                origenesDB
            });
        })
    }

    eliminarOrigen(req: any, resp: Response): void {

        const id = req.get('id');

        origenPedidoModel.findById(id, (err: CallbackError, origenDB: OrigenPedidoInterface) => {

            if (err) {

                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }

            if (!origenDB) {
                return resp.json({
                    ok: false,
                    mensaje: `No se encontró un Origen de Pedido`
                });
            }

            origenPedidoModel.findByIdAndDelete(id, {}, (err: CallbackError, origenEliminadoDB: any) => {

                if (err) {

                    return resp.json({
                        ok: false,
                        mensaje: `Error interno`,
                        err
                    });
                }

                return resp.json({
                    ok: true,
                    origenEliminadoDB
                });

            });
        })
    }
}