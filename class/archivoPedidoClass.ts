import { Response, Request } from 'express';
import { CallbackError } from 'mongoose';
import { nanoid } from 'nanoid';

// Clases
import { GestorCarpetaClass } from './gestorCarpetaClass';

import moment from 'moment';
moment.locale('es');

import { UploadedFile } from 'express-fileupload';

// Modelo
import archivosModel from '../models/archivosModel';
import pedidoModel from '../models/pedidoModel';

// Interfaces
import { ArchivosInterface, PedidoModelInterface } from '../interfaces/pedidos';

// Funciones externas
import { eliminarArchivo, extraerArchivo, subirArchivo } from '../functions/archivos';
import { castEstado } from '../functions/castEstado';
import Server from './server';

export class ArchivoClass {

    private idRef: string;

    constructor() {
        this.idRef = nanoid(10);
    }

    async nuevoArchivo(req: any, resp: Response): Promise<any> {

        const idReferencia = this.idRef;
        const idCreador = req.usuario._id;
        const files: UploadedFile = req.files;
        const tipo = req.body.tipo;
        // const nombre = req.body.nombre;

        const respArch: RespPromise = await extraerArchivo(files);

        if (respArch.ok === false) {

            return resp.json({
                ok: false,
                mensaje: respArch.mensaje
            });

        } else {

            const file = respArch.data;
            const resArch: RespPromise = await subirArchivo(file, req); // Recibo nombre del archivo

            if (resArch.ok === false) {

                return resp.json({
                    ok: false,
                    mensaje: resArch.mensaje
                });

            } else {

                const nombre_archivo = resArch.mensaje;

                // Crear archivo en DB
                const nuevoArchivo = new archivosModel({

                    idReferencia: idReferencia,
                    idCreador: idCreador,
                    nombre_archivo: nombre_archivo,
                    pedido: req.get('pedido'),
                    // fecha: moment().format('YYYY-MM-DD'),
                    // fecha: moment('2021-08-30').format('YYYY-MM-DD'),
                    fecha: moment().add(3, 'days').format('YYYY-MM-DD'),
                    tipo: tipo
                });

                // eliminarArchivo(nombre_archivo);

                nuevoArchivo.save((err: CallbackError, archivoDB: ArchivosInterface) => {

                    if (err) {

                        eliminarArchivo(nombre_archivo);

                        return resp.json({
                            ok: false,
                            mensaje: `No se pudo guardar el archivo en la DB`,
                            err
                        });

                    } else {

                        const pedido = req.get('pedido');

                        pedidoModel.findById(pedido, async (err: CallbackError, pedidoDB: PedidoModelInterface) => {

                            if (err) {
                                eliminarArchivo(nombre_archivo);
                                await archivosModel.findByIdAndDelete(archivoDB._id);

                                return resp.json({
                                    ok: false,
                                    mensaje: `Error interno`,
                                    err
                                });
                            }

                            if (!pedidoDB) {
                                eliminarArchivo(nombre_archivo);
                                await archivosModel.findByIdAndDelete(archivoDB._id);

                                return resp.json({
                                    ok: false,
                                    mensaje: `No se encontró un pedido para anexar un archivo`
                                });
                            }

                            // if (pedidoDB.productos_pedidos.length <= 0) {

                            //     eliminarArchivo(nombre_archivo);
                            //     await archivosModel.findByIdAndDelete(archivoDB._id);

                            //     return resp.json({
                            //         ok: false,
                            //         mensaje: `Debe agregar un producto para poder crear archivos`
                            //     });
                            // }

                            pedidoModel.findByIdAndUpdate(pedido, { $push: { archivos: archivoDB._id } }, { new: true }, async (err: CallbackError, pedidoDB: any) => {

                                if (err) {
                                    eliminarArchivo(nombre_archivo);
                                    await archivosModel.findByIdAndDelete(archivoDB._id);

                                    return resp.json({
                                        ok: false,
                                        mensaje: `Error interno`,
                                        err
                                    });
                                }

                                if (!pedidoDB) {
                                    eliminarArchivo(nombre_archivo);
                                    await archivosModel.findByIdAndDelete(archivoDB._id);

                                    return resp.json({
                                        ok: false,
                                        mensaje: `No se encontró un pedido para anexar un archivo`
                                    });
                                }

                                const gestorCarpeta = new GestorCarpetaClass();
                                const respGestor = await gestorCarpeta.checkSize();

                                const server = Server.instance;
                                server.io.emit('recibir-archivos');

                                return resp.json({
                                    ok: true,
                                    mensaje: 'Archivo subido',
                                    pedidoDB,
                                    archivoDB,
                                    carpeta: respGestor
                                });
                            });
                        });
                    }
                });

            }
        }

    }

    obtenerArchivo(req: any, resp: Response): void {

        const id = req.get('id');

        archivosModel.findById(id, (err: CallbackError, archivoDB: ArchivosInterface) => {

            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }

            if (!archivoDB) {
                return resp.json({
                    ok: false,
                    mensaje: `No existe el archivo en la base de datos`
                });
            }

            return resp.json({
                ok: true,
                archivoDB
            });
        });
    }

    obtenerTodosArchivos(req: any, resp: Response): void {

        // const estadoHeader: string = req.get('estado');
        // const estado: boolean = castEstado(estadoHeader);

        archivosModel.find({})
            .sort({ tipo: 1 })
            .populate('idCreador')
            .exec((err: any, archivosDB: Array<ArchivosInterface>) => {

                if (err) {
                    return resp.json({
                        ok: false,
                        mensaje: `Error interno`,
                        err
                    });
                }

                return resp.json({
                    ok: true,
                    archivosDB,
                    cantidad: archivosDB.length
                });

            });
    }

    obtenerArchivosPorPedido(req: any, resp: Response): void {

        const idPedido = req.get('idPedido');

        archivosModel.find({ pedido: idPedido })
            .sort({ tipo: 1 })
            .populate('idCreador')
            .exec((err: any, archivosDB: Array<any>) => {

                if (err) {
                    resp.json({
                        ok: false,
                        mensaje: `Error interno`,
                        err
                    });
                }

                resp.json({
                    ok: true,
                    archivosDB
                });
            });
    }

    obtenerArchivoAProbado(req: any, resp: Response): void {

        const estadoHeader: string = req.get('estado');
        const estado: boolean = castEstado(estadoHeader);

        archivosModel.find({ tipo: 'aprobado', estado: estado }, (err: CallbackError, archivosDB: Array<ArchivosInterface>) => {

            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }

            return resp.json({
                ok: true,
                archivosDB,
                cantidad: archivosDB.length
            });
        });
    }

    obtenerArchivoProceso(req: any, resp: Response): void {

        const estadoHeader: string = req.get('estado');
        const estado: boolean = castEstado(estadoHeader);

        archivosModel.find({ tipo: 'proceso', estado: estado }, (err: CallbackError, archivosDB: Array<ArchivosInterface>) => {

            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }

            return resp.json({
                ok: true,
                archivosDB,
                cantidad: archivosDB.length
            });
        });
    }

    obtenerArchivoAProbadoOriginal(req: any, resp: Response): void {

        const estadoHeader: string = req.get('estado');
        const estado: boolean = castEstado(estadoHeader);

        archivosModel.find({ tipo: 'original', estado: estado }, (err: CallbackError, archivosDB: Array<ArchivosInterface>) => {

            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }

            return resp.json({
                ok: true,
                archivosDB,
                cantidad: archivosDB.length
            });
        });
    }

    eliminarArhivoID(req: Request, resp: Response): void {

        const id = req.get('id');
        const pedido = req.get('pedido');

        archivosModel.findById(id, (err: CallbackError, archivoDB: ArchivosInterface) => {

            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }

            if (!archivoDB) {
                return resp.json({
                    ok: false,
                    mensaje: `No existe el archivo en la base de datos o en el pedido`
                });
            }

            const nombre_archivo = archivoDB.nombre_archivo;
            eliminarArchivo(nombre_archivo);

            archivosModel.findByIdAndDelete(id, {}, (err: CallbackError, archivoEliminadoDB: any) => {

                if (err) {

                    return resp.json({
                        ok: false,
                        mensaje: 'Erro interno',
                        err
                    });
                }

                if (!archivoEliminadoDB) {

                    return resp.json({
                        ok: false,
                        mensaje: `No se encontró archivo con este ID`
                    });
                }


                pedidoModel.findById(pedido, (err: CallbackError, pedidoDB: PedidoModelInterface) => {

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
                            mensaje: `No se encontró un pedido para eliminar archivos`
                        });
                    }

                    pedidoModel.findByIdAndUpdate(pedido, { $pull: { archivos: { $in: id } } }, { new: true }, async (err: CallbackError, archivoDB: any) => {

                        if (err) {
                            return resp.json({
                                ok: false,
                                mensaje: `Error interno`,
                                err
                            });
                        }

                        if (!archivoDB) {
                            return resp.json({
                                ok: false,
                                mensaje: `No se encontró un pedido para eliminar archivos`
                            });
                        }

                        const gestorCarpeta = new GestorCarpetaClass();
                        const respGestor = await gestorCarpeta.checkSize();

                        const server = Server.instance;
                        server.io.emit('recibir-archivos');

                        return resp.json({
                            ok: true,
                            mensaje: 'Archivo eliminado',
                            archivoDB,
                            carpeta: respGestor
                        });
                    });
                });
            });

        });
    }

    async eliminarArchivoRangoFechas(req: Request, resp: Response): Promise<any> {

        const fecha_inicial = req.body.fecha_inicial;
        const fecha_final = req.body.fecha_final;
        let tipo = req.body.tipo;
        const pedido = req.get('pedido');

        archivosModel.find({ $and: [{ pedido: pedido }, { tipo: tipo }, { fecha: { $gte: fecha_inicial } }, { fecha: { $lte: fecha_final } }] }, async (err: CallbackError, archivosDB: Array<ArchivosInterface>) => {

            if (err) {

                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });

            }

            if (archivosDB.length <= 0) {

                return resp.json({
                    ok: true,
                    mensaje: `Nada para eliminar`,
                });
            }

            if (archivosDB.length >= 1) {


                // Eliminar las imágenes
                archivosDB.forEach(archivoDB => {

                    const id = archivoDB._id;
                    const nombre_archivo = archivoDB.nombre_archivo;
                    eliminarArchivo(nombre_archivo);
                });


            }

            archivosModel.deleteMany({ $and: [{ pedido: pedido }, { tipo: tipo }, { fecha: { $gte: fecha_inicial } }, { fecha: { $lte: fecha_final } }] })
                .then(res => {

                    const idsArchivos = archivosDB.map((ele) => {
                        return ele._id
                    });

                    pedidoModel.findById(pedido, (err: CallbackError, pedidoDB: PedidoModelInterface) => {

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
                                mensaje: `No se encontró un pedido para eliminar archivos`
                            });
                        }

                        const query = {
                            archivos: idsArchivos
                        }

                        pedidoModel.findByIdAndUpdate(pedido, { $pull: { archivos: { $in: idsArchivos } } }, { new: true }, async (err: CallbackError, pedidoActualizadoDB: any) => {

                            if (err) {
                                return resp.json({
                                    ok: false,
                                    mensaje: `Error interno`,
                                    err
                                });
                            }

                            if (!pedidoActualizadoDB) {
                                return resp.json({
                                    ok: false,
                                    mensaje: `No se encontró un pedido para eliminar archivos`
                                });
                            }

                            const gestorCarpeta = new GestorCarpetaClass();
                            const respGestor = await gestorCarpeta.checkSize();

                            return resp.json({
                                ok: true,
                                pedidoActualizadoDB,
                                carpeta: respGestor
                            });
                        });
                    });
                }).catch(errr => {

                    return resp.json({
                        ok: false,
                        mensaje: `Error`,
                        errr
                    });
                });
        });
    }

}

interface RespPromise {
    ok: boolean;
    mensaje: string;
    data: File | any;
}