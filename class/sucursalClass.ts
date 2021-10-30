import { Response, Request } from 'express';
import moment from 'moment';
import { CallbackError } from 'mongoose';
import path from 'path';
import fs from 'fs';
import { nanoid } from 'nanoid'

// Modelo
import sucursalModel from '../models/sucursalModel';

// Interfaces
import { SucursalModel } from '../interfaces/sucursal';

// Funciones
import { castEstado } from '../functions/castEstado';

export class Sucursal {

    public idRef: string;
    public readonly sucursalIDs = `sucursalIDs.json`;

    constructor() {
        this.idRef = nanoid(10);
    }


    // Crear sucursal
    nuevaSucursal(req: any, resp: Response): void {

        const idCreador: any = req.usuario._id;
        const nombre: string = req.body.nombre;
        const telefono: string = req.body.telefono;
        const pais: string = req.body.pais;
        const ciudad: string = req.body.ciudad;
        const direccion: string = req.body.direccion;
        const fecha: string = moment().format('YYYY-MM-DD');

        const nuevaSucursal = new sucursalModel({

            idCreador: idCreador,
            idReferencia: this.idRef,
            nombre: nombre,
            telefono: telefono,
            ubicacion: {
                pais: pais,
                ciudad: ciudad,
                direccion: direccion
            },
            fecha_creacion: fecha
        });

        // guardar la sucursal
        nuevaSucursal.save((err, sucursalDB) => {
            if (err) {

                return resp.json({
                    ok: false,
                    mensaje: `No se pudo crear la Sucursal`,
                    err
                });

            } else {
                return resp.json({
                    ok: true,
                    mensaje: `Sucursal creada`,
                    sucursalDB
                });
            }
        });
    }

    // Editar sucursal
    editarSucursal(req: any, resp: Response): void {

        const id = req.get('id');
        const nombre: string = req.body.nombre;
        const telefono: string = req.body.telefono;
        const pais: string = req.body.pais;
        const ciudad: string = req.body.ciudad;
        const direccion: string = req.body.direccion;

        // const estadoHeader: string = req.get('estado');
        // const estado: boolean = castEstado(estadoHeader);

        const estado: boolean = req.get('estado');


        // console.log(estado);

        const query = {

            nombre: nombre,
            telefono: telefono,
            ubicacion: {

                pais: pais,
                ciudad: ciudad,
                direccion: direccion
            },
            estado: estado
        }

        sucursalModel.findById(id, (err: CallbackError, sucursalDB: SucursalModel) => {

            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }

            if (!sucursalDB) {
                return resp.json({
                    ok: false,
                    mensaje: `No se encontró una sucursal con ese ID en la base de datos`
                });
            }

            if (!query.nombre) {
                query.nombre = sucursalDB.nombre;
            }
            if (!query.telefono) {
                query.telefono = sucursalDB.telefono;
            }
            if (!query.ubicacion.pais) {
                query.ubicacion.pais = sucursalDB.ubicacion.pais;
            }
            if (!query.ubicacion.ciudad) {
                query.ubicacion.ciudad = sucursalDB.ubicacion.ciudad;
            }
            if (!query.ubicacion.direccion) {
                query.ubicacion.direccion = sucursalDB.ubicacion.direccion;
            }
            if (!query.estado) {
                query.estado = sucursalDB.estado;
            }

            sucursalModel.findByIdAndUpdate(id, query, { new: true }, (err: CallbackError, sucursalDBActualizada: any) => {

                if (err) {
                    return resp.json({
                        ok: false,
                        mensaje: `No se pudo editar la Sucursal`,
                        err
                    });
                }

                if (!sucursalDB) {
                    return resp.json({
                        ok: false,
                        mensaje: `No existe la sucursal que quiere Editar`,
                        err
                    });
                }

                return resp.json({
                    ok: true,
                    mensaje: `Sucursal actualizada`,
                    sucursalDBActualizada
                });
            });
        });

    }

    // Obtener sucursal por ID
    obtenerSucursal(req: Request, resp: Response): void {

        const id = req.get('id');

        sucursalModel.findById(id, (err: CallbackError, sucursalDB: Document) => {

            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error al búscar Sucursal o no existe`,
                    err
                });
            }

            if (!sucursalDB) {
                return resp.json({
                    ok: false,
                    mensaje: `No existe la sucursal en la base de datos`
                });
            }

            return resp.json({
                ok: true,
                sucursalDB
            });
        });
    }

    // Obtener sucursal por ID referencia
    obtenerSucursalIdRef(req: Request, resp: Response): void {

        const id = req.get('idReferencia')

        sucursalModel.findOne({ idReferencia: id }, (err: CallbackError, sucursalDB: Document) => {

            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error al búscar Sucursal o no existe`,
                    err
                });
            }

            if (!sucursalDB) {
                return resp.json({
                    ok: false,
                    mensaje: `No existe la sucursal en la base de datos`
                });
            }

            return resp.json({
                ok: true,
                sucursalDB
            });
        });
    }

    // obtener todas las sucursales
    obtenerTodas(req: any, resp: Response): any {

        const estadoHeader: string = req.get('estado');
        const estado: boolean = castEstado(estadoHeader);

        sucursalModel.find({}, (err: CallbackError, sucursalesDB: Document) => { // estado: estado

            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error al búscar Sucursales o no existe ninguna`,
                    err
                });
            }

            if (!sucursalesDB) {
                return resp.json({
                    ok: false,
                    mensaje: `No hay sucursales en la Base de datos`
                });
            }

            return resp.json({
                ok: true,
                sucursalesDB
            });

        });
    }

    // Eliminar una sucursal
    eliminarSucursal(req: Request, resp: Response): any {

        const id = req.get('id');

        // // Eliminar ID actual de IDsJson.json
        // const eliminarIDActual = (idRef: string) => {

        //     const pathIDsJson = path.resolve(__dirname, `../uploads/assets/${this.sucursalIDs}`);

        //     const archivo: any = fs.readFileSync(`${pathIDsJson}`);
        //     const archiObj: Archivo = JSON.parse(archivo);

        //     const nuevoArray = archiObj.ids.filter(id => {
        //         return id !== idRef;
        //     });

        //     archiObj.ids = nuevoArray;

        //     const nuevoArhivo = JSON.stringify(archiObj);
        //     fs.writeFileSync(`${pathIDsJson}`, nuevoArhivo);

        // }


        sucursalModel.findByIdAndDelete(id, {}, (err: CallbackError, sucursalDB) => {

            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error al eliminar sucursal o no existe`,
                    err
                });
            }

            if (!sucursalDB) {
                return resp.json({
                    ok: false,
                    mensaje: `No existe la sucursal que desea eliminar`
                });

            }

            // const idRef = sucursalDB?.idReferencia || '';
            // eliminarIDActual(idRef);

            return resp.json({
                ok: true,
                mensaje: `Sucursal eliminada`,
                sucursalDB
            });

        });
    }
}

// Interfaz para manejar los datos del archivo idSucursal.json
interface Archivo {
    ids: Array<string>
}

interface RespPromise {
    ok: boolean;
    data: string;
}