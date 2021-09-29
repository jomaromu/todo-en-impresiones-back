import { Response, Request } from 'express';
import { CallbackError } from 'mongoose';

// Funciones
import { castEstado } from '../functions/castEstado';

// Intefaces
import { PrioridadPedidoInterface } from '../interfaces/pedidos';

// Modelos
import prioridadPedidoModel from '../models/prioridadPedidoModel';

export class prioridadClass {

    nuevaProridad(req: any, resp: Response): void {

        const idCreador: any = req.usuario._id;
        const nombre: string = req.body.nombre;
        const color: string = req.body.color;
        const importancia: number = Number(req.body.importancia);

        const nuevaPrioridadPedido = new prioridadPedidoModel({

            idCreador: idCreador,
            color_prioridad: color,
            nombre: nombre,
            importancia: importancia
        });

        nuevaPrioridadPedido.save((err: CallbackError, prioridadPedidoDB: PrioridadPedidoInterface) => {

            if (err) {

                return resp.json({
                    ok: false,
                    mensaje: `No se pudo crear la prioridad`,
                    err
                });

            } else {

                return resp.json({
                    ok: true,
                    mensaje: `Nueva etapa creada`,
                    prioridadPedidoDB
                });
            }
        });

    }

    editarPrioridadPedido(req: any, resp: Response): void {

        const id = req.get('id');
        const estadoHeader: string = req.get('estado');
        const estado: boolean = castEstado(estadoHeader);

        const query = {
            nombre: req.body.nombre,
            color_prioridad: req.body.color,
            importancia: Number(req.body.importancia),
            nivel: Number(req.body.nivel),
            estado: estado
        }

        prioridadPedidoModel.findById(id, (err: CallbackError, prioridadPedidoDB: PrioridadPedidoInterface) => {

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

            prioridadPedidoModel.findByIdAndUpdate(id, query, { new: true }, (err: CallbackError, prioridadActualizadaDB: any) => {

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

    obtenerPrioridadID(req: Request, resp: Response): void {

        const id = req.get('id');

        prioridadPedidoModel.findById(id, (err: CallbackError, prioridadPedidoDB: Document) => {

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

    obtenerTodasPrioridades(req: any, resp: Response): any {

        const estadoHeader: string = req.get('estado');
        const estado: boolean = castEstado(estadoHeader);

        prioridadPedidoModel.find({ estado: estado }, (err: CallbackError, prioridadPedidoDB: Document) => {

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

    eliminarPrioridad(req: Request, resp: Response): any {

        const id = req.get('id');

        prioridadPedidoModel.findByIdAndDelete(id, {}, (err: CallbackError, prioridadPedidoDB: any) => {

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