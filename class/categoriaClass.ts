import { Response } from "express";
import { CallbackError } from "mongoose";

// Funciones
import { castEstado } from "../functions/castEstado";

// Interfaces
import { CategoriaModelInterface } from "../interfaces/categoria";

// Modelo
import categoriaModel from "../models/categoriaModel";

export class CategoriaClass {

    constructor() { }

    crearCategoria(req: any, resp: Response): void {

        const idCreador = req.usuario._id;
        const nombre = req.body.nombre;

        const nuevaCategoria = new categoriaModel({
            idCreador: idCreador,
            nombre: nombre
        });

        nuevaCategoria.save((err: CallbackError, categoriaDB: CategoriaModelInterface) => {

            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });

            } else {

                return resp.json({
                    ok: true,
                    categoriaDB
                });
            }
        });

    }

    editarCategoriaID(req: any, resp: Response): any {

        const id = req.get('id');
        const nombre: string = req.body.nombre;
        
        const estadoHeader: string = req.get('estado');
        const estado: boolean = castEstado(estadoHeader);

        const query = {
            nombre: nombre,
            estado: estado
        }

        categoriaModel.findById(id, (err: CallbackError, categoriaDB: CategoriaModelInterface) => {

            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }

            if (!categoriaDB) {
                return resp.json({
                    ok: false,
                    mensaje: `No se encontró una categoría con ese ID`
                });
            }

            if (!query.nombre) {
                query.nombre = categoriaDB.nombre;
            }

            if (!query.estado) {
                query.estado = categoriaDB.estado;
            }

            categoriaModel.findByIdAndUpdate(id, query, { new: true }, (err: CallbackError, categoriaDB: any) => {

                if (err) {
                    return resp.json({
                        ok: false,
                        mensaje: `Error interno`,
                        err
                    });
                }

                if (!categoriaDB) {
                    return resp.json({
                        ok: false,
                        mensaje: `No se encontró una categoría con ese ID`
                    });
                }

                return resp.json({
                    ok: true,
                    categoriaDB
                });
            });

        });
    }

    obtenerTodasCategorias(req: any, resp: Response): void {

        const estadoHeader: string = req.get('estado');
        const estado: boolean = castEstado(estadoHeader);

        categoriaModel.find({ estado: estado }, (err: CallbackError, categoriaDB: Array<CategoriaModelInterface>) => {

            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }

            if (categoriaDB.length === 0) {
                return resp.json({
                    ok: false,
                    mensaje: `No se encontraron categorías`
                });
            }

            return resp.json({
                ok: true,
                categoriaDB
            });
        });
    }

    obtenerCategoriaID(req: any, resp: Response): void {

        const id = req.get('id');

        categoriaModel.findById(id, (err: CallbackError, categoriaDB: CategoriaModelInterface) => {

            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }

            if (!categoriaDB) {
                return resp.json({
                    ok: false,
                    mensaje: `No se encontró una categoría con ese ID`
                });
            }

            return resp.json({
                ok: true,
                categoriaDB
            });
        });
    }

    eliminarCategoriaID(req: any, resp: Response): void {

        const id = req.get('id');

        categoriaModel.findByIdAndDelete(id, {}, (err: any, categoriaDB: any) => {

            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err
                });
            }

            if (!categoriaDB) {
                return resp.json({
                    ok: false,
                    mensaje: `No se encontró una categoría con ese ID`
                });
            }

            return resp.json({
                ok: true,
                categoriaDB
            });
        });
    }
}