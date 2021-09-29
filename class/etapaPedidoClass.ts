import { Response } from 'express';
import { CallbackError } from 'mongoose';

// Funciones
import { castEstado } from '../functions/castEstado';

// Intefaces
import { EtapaPedidoInterface } from '../interfaces/pedidos';

// Modelos
import etapaPedidoModel from '../models/etapaPedidoModel';

export class etapaPedidoClass {

    nuevaEtapaPedido(req: any, resp: Response): void {

        const idCreador = req.usuario._id;
        const nombre = req.body.nombre;

        const nuevaEtapaPedido = new etapaPedidoModel({

            idCreador: idCreador,
            nombre: nombre
        });

        nuevaEtapaPedido.save((err: CallbackError, etapaPedidoDB: EtapaPedidoInterface) => {

            if (err) {

                return resp.json({
                    ok: false,
                    mensaje: `No se pudo crear la nueva etapa`,
                    err
                });

            } else {

                return resp.json({
                    ok: true,
                    mensaje: `Nueva etapa creada`,
                    etapaPedidoDB
                });
            }
        });

    }

    editarEtapaPedido(req: any, resp: Response): void {

        const id = req.get('id');
        const estadoHeader: string = req.get('estado');
        const estado: boolean = castEstado(estadoHeader);

        const query = {
            nombre: req.body.nombre,
            nivel: Number(req.body.nivel),
            estado: estado
        }

        etapaPedidoModel.findById(id, (err: CallbackError, etapaPedidoDB: EtapaPedidoInterface) => {

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

            etapaPedidoModel.findByIdAndUpdate(id, query, { new: true }, (err: CallbackError, etapaActualizadaDB: any) => {

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

    obtenerEtapaPedido(req: any, resp: Response): void {

        const id = req.get('id');

        etapaPedidoModel.findById(id, (err: CallbackError, etapaPedidoDB: EtapaPedidoInterface) => {

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

    obtenerTodasEtapaPedido(req: any, resp: Response): void {

        const estadoHeader: string = req.get('estado');
        const estado: boolean = castEstado(estadoHeader);

        etapaPedidoModel.find({ estado: estado }, (err: CallbackError, etapaPedidoDB: Array<EtapaPedidoInterface>) => {

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

    eliminarEtapaPedido(req: any, resp: Response): void {

        const id = req.get('id');

        etapaPedidoModel.findByIdAndDelete(id, {}, (err: CallbackError, etapaPedidoDB: any) => {

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