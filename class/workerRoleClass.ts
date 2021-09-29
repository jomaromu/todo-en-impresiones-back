import { Response } from 'express';
import { CallbackError } from 'mongoose';
import { castEstado } from '../functions/castEstado';

// Interfaces
import { RoleColModel } from '../interfaces/role';

// Modelo 
import roleWorkerModel from '../models/roleWorkerModel';

export class RoleColClass {

    constructor() { }

    // Nuevo role
    nuevoRole(req: any, resp: Response): void {

        const idCreador = req.usuario._id;
        const nombre = req.body.nombre;

        const nuevoRole = new roleWorkerModel({
            idCreador: idCreador,
            nombre: nombre
        });

        nuevoRole.save((err: CallbackError, roleDB: RoleColModel) => {

            if (err) {

                return resp.json({
                    mensaje: `Error interno`,
                    err
                });

            } else {

                return resp.json({
                    ok: true,
                    mensaje: `Role ${nombre} creado`,
                    roleDB
                });
            }
        });
    }

    // Editar role
    editarRole(req: any, resp: Response): void {

        const id = req.get('id');
        const estadoHeader: string = req.get('estado');
        const estado: boolean = castEstado(estadoHeader);

        const query = {
            nombre: req.body.nombre,
            nivel: Number(req.body.nivel),
            estado: estado
        }

        roleWorkerModel.findById(id, (err: CallbackError, roleDB: any) => {

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


            if (query.nombre) {
                query.nombre = roleDB.nombre;
            }
            if (query.nivel) {
                query.nivel = roleDB.nivel;
            }
            if (!query.estado) {
                query.estado = roleDB.estado;
            }

            roleWorkerModel.findByIdAndUpdate(id, query, { new: true }, (err: CallbackError, nuevoRoleDB: any) => {

                if (err) {
                    return resp.json({
                        ok: false,
                        mensaje: `No se pudo editar la Sucursal`,
                        err
                    });
                }

                if (!nuevoRoleDB) {
                    return resp.json({
                        ok: false,
                        mensaje: `No existe el role que quiere Editar`,
                    });
                }

                return resp.json({
                    ok: true,
                    mensaje: `Role actualizado`,
                    nuevoRoleDB
                });
            });
        });

    }

    // Obtener role por ID
    obtenerRoleID(req: any, resp: Response): void {

        const id = req.get('id');

        roleWorkerModel.findById(id, (err: CallbackError, roleDB: Document) => {

            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error al búscar role o no existe`,
                    err
                });
            }

            if (!roleDB) {
                return resp.json({
                    ok: false,
                    mensaje: `No existe el role en la base de datos`
                });
            }

            return resp.json({
                ok: true,
                roleDB
            });
        });
    }

    // Obtener todos los roles
    obtenerTodos(req: any, resp: Response): void {

        const estadoHeader: string = req.get('estado');
        const estado: boolean = castEstado(estadoHeader);

        roleWorkerModel.find({ estado: estado }, (err: CallbackError, roleDB: Array<Document>) => {

            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error al búscar role o no existe`,
                    err
                });
            }

            if (!roleDB || roleDB.length === 0) {
                return resp.json({
                    ok: false,
                    mensaje: `No existen el role en la base de datos`
                });
            }

            return resp.json({
                ok: true,
                roleDB
            });
        });
    }

    // Eliminar un role por ID
    eliminarRole(req: any, resp: Response): void {

        const id = req.get('id');

        roleWorkerModel.findByIdAndDelete(id, {}, (err: CallbackError, roleDB: any) => {

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
                    mensaje: `No existe el role en la base de datos`
                });
            }

            return resp.json({
                ok: true,
                roleDB
            });
        });
    }

}