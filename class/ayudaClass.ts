import { Response } from 'express';
import { CallbackError } from 'mongoose';

// Modelo
import ayudaModel from '../models/ayudaModel';

// Interfaces
import { AyudaModelInterface } from '../interfaces/ayuda';

export class AyudaClass {

    constructor() { }

    crearAyuda(req: any, resp: Response): void {

        const nombre = req.body.nombre;
        const descripcion = req.body.descripcion;
        const idCreador = req.usuario._id;

        const nuevaAyuda = new ayudaModel({
            idCreador: idCreador,
            nombre: nombre,
            descripcion: descripcion
        });

        nuevaAyuda.save((err: CallbackError, ayudaDB: AyudaModelInterface) => {

            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });

            } else {

                return resp.json({
                    ok: true,
                    ayudaDB
                });
            }
        });


    }

    async editarAyuda(req: any, resp: Response): Promise<any> {

        const id = req.get('id');

        ayudaModel.findById(id, (err: CallbackError, ayudaDB: AyudaModelInterface) => {

            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }

            if (!ayudaDB) {
                return resp.json({
                    ok: false,
                    mensaje: `No se encontró una ayuda`
                });
            }

            const query = {

                nombre: req.body.nombre,
                descripcion: req.body.descripcion
            }

            if (!query.nombre) {
                query.nombre = ayudaDB.nombre;
            }

            if (!query.descripcion) {
                query.descripcion = ayudaDB.descripcion;
            }

            ayudaModel.findByIdAndUpdate(id, query, { new: true }, (err: any, ayudaActualizadaDB: any) => {

                if (err) {
                    return resp.json({
                        ok: false,
                        mensaje: `Error interno`,
                        err
                    });
                }

                return resp.json({
                    ok: true,
                    ayudaActualizadaDB
                });
            });

        });
    }

    async obtenerAyudaID(req: any, resp: Response): Promise<any> {

        const id = req.get('id');

        const respAyuda = await ayudaModel.findById(id);

        if (!respAyuda) {

            return resp.json({
                ok: false,
                mensaje: `No se encontró una ayuda o un error ha ocurrido`
            });

        } else {

            return resp.json({
                ok: true,
                respAyuda
            });
        }
    }

    async obtenerTodas(req: any, resp: Response): Promise<any> {

        const respAyuda = await ayudaModel.find({});

        if (!respAyuda) {

            return resp.json({
                ok: false,
                mensaje: `Error interno o no se encontraron ayuda(s)`
            });

        } else {

            resp.json({
                ok: true,
                respAyuda
            });
        }
    }

    async eliminarAyuda(req: any, resp: Response): Promise<any> {

        const id = req.get('id');

        const respAyuda = await ayudaModel.findByIdAndDelete(id);

        if (!respAyuda) {

            return resp.json({
                ok: false,
                mensaje: `No se encontró una ayuda o un error ha ocurrido`
            });

        } else {

            return resp.json({
                ok: true,
                respAyuda
            });
        }
    }
}