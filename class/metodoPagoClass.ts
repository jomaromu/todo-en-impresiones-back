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

        nuevoMetodoPago.save((err: CallbackError, metodoPagoDB: MetodoPagoInterface) => {

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
                metodoPagoDB
            });
        });
    }

    editarMetodoPago(req: any, resp: Response): void {

        const id = req.get('id');

        const nombreBody: string = req.body.nombre;
        const estadBody: string = req.body.estado;
        const nivelBody: number = Number(req.body.nivel);

        const estadoHeader: string = req.get('estado');
        const estado: boolean = castEstado(estadoHeader);

        const query = {
            nombre: nombreBody,
            estado: estado,
            nivel: nivelBody
        }

        metodoPagoModel.findById(id, (err: CallbackError, metodoActualizadoDB: MetodoPagoInterface) => {


            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }

            if (!metodoActualizadoDB) {
                return resp.json({
                    ok: false,
                    mensaje: `No se encontró un método de pago con ese ID`,
                });
            }

            if (query.nombre) {
                query.nombre = metodoActualizadoDB.nombre;
            }

            if (query.estado) {
                query.estado = metodoActualizadoDB.estado;
            }

            if (query.nivel) {
                query.nivel = metodoActualizadoDB.nivel;
            }

            metodoPagoModel.findByIdAndUpdate(id, query, { new: true }, (err: CallbackError, metodoActualizadoDB: any) => {

                if (err) {
                    return resp.json({
                        ok: false,
                        mensaje: `Error interno`,
                        err
                    });
                }


                return resp.json({
                    ok: true,
                    metodoActualizadoDB
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

        metodoPagoModel.find({ estado: estado }, (err: CallbackError, metodosDB: Array<MetodoPagoInterface>) => {

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
                metodoDB
            });
        });
    }
}