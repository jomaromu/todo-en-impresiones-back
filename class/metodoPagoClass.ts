import { Request, Response } from 'express';
import { CallbackError } from 'mongoose';

// Funciones
import { castEstado } from '../functions/castEstado';

// Intefaces
import { MetodoPagoInterface } from '../interfaces/metodoPago';

// Modelos
import metodoPagoModel from '../models/metodoPagoModel';

export class MetodoPagoClass {

    constructor() { }

    crearMetodoPago(req: any, resp: Response): void {


        const nuevoMetodoPago = new metodoPagoModel({

            idCreador: req.usuario._id,
            nombre: req.body.nombre

        });

        nuevoMetodoPago.save((err: CallbackError, metodoDB: MetodoPagoInterface) => {

            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }

            return resp.json({
                ok: true,
                mensaje: `Método de pago ${req.body.nombre} creado`,
                metodoDB
            });
        });
    }

    editarMetodoPago(req: any, resp: Response): void {

        const id = req.get('id');

        const nombreBody: string = req.body.nombre;
        // const estadBody: string = req.body.estado;
        // const estado: boolean = castEstado(estadoHeader);
        const nivelBody: number = Number(req.body.nivel);
        const estado = req.body.estado;

        const query = {
            nombre: nombreBody,
            estado: estado,
            nivel: nivelBody
        }

        metodoPagoModel.findById(id, (err: CallbackError, metodoDB: MetodoPagoInterface) => {


            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }

            if (!metodoDB) {
                return resp.json({
                    ok: false,
                    mensaje: `No se encontró un método de pago con ese ID`,
                });
            }

            if (!query.nombre) {
                query.nombre = metodoDB.nombre;
            }

            if (!query.nivel) {
                query.nivel = metodoDB.nivel;
            }

            metodoPagoModel.findByIdAndUpdate(id, query, { new: true }, (err: CallbackError, metodoDB: any) => {

                if (err) {
                    return resp.json({
                        ok: false,
                        mensaje: `Error interno`,
                        err
                    });
                }


                return resp.json({
                    ok: true,
                    mensaje: 'Método actuaizado',
                    metodoDB
                });
            });
        });

    }

    obtenerMetodoID(req: any, resp: Response) {

        const id = req.get('id');

        metodoPagoModel.findById(id, (err: CallbackError, metodoDB: MetodoPagoInterface) => {

            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }

            if (!metodoDB) {
                return resp.json({
                    ok: false,
                    mensaje: `No se encontró un método de pago con ese ID`,
                });
            }

            return resp.json({
                ok: true,
                metodoDB
            });
        });
    }

    obtenerTododsMetodos(req: any, resp: Response) {

        const estadoHeader: string = req.get('estado');
        const estado: boolean = castEstado(estadoHeader);

        metodoPagoModel.find({ }, (err: CallbackError, metodosDB: Array<MetodoPagoInterface>) => { // estado: estado

            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }

            return resp.json({
                ok: true,
                metodosDB,
                cantidad: metodosDB.length
            });
        });
    }

    eliminarMetodoID(req: any, resp: Response) {

        const id = req.get('id');

        metodoPagoModel.findByIdAndDelete(id, {}, (err: CallbackError, metodoDB: any) => {

            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }

            if (!metodoDB) {
                return resp.json({
                    ok: false,
                    mensaje: `No se encontró un método de pago con ese ID`,
                });
            }

            return resp.json({
                ok: true,
                mensaje: 'Método eliminado',
                metodoDB
            });
        });
    }
}