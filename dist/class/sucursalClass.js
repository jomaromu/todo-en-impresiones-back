"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sucursal = void 0;
const moment_1 = __importDefault(require("moment"));
const nanoid_1 = require("nanoid");
// Modelo
const sucursalModel_1 = __importDefault(require("../models/sucursalModel"));
// Funciones
const castEstado_1 = require("../functions/castEstado");
class Sucursal {
    constructor() {
        this.sucursalIDs = `sucursalIDs.json`;
        this.idRef = (0, nanoid_1.nanoid)(10);
    }
    // Crear sucursal
    nuevaSucursal(req, resp) {
        const idCreador = req.usuario._id;
        const nombre = req.body.nombre;
        const telefono = req.body.telefono;
        const pais = req.body.pais;
        const ciudad = req.body.ciudad;
        const direccion = req.body.direccion;
        const fecha = (0, moment_1.default)().format('YYYY-MM-DD');
        const nuevaSucursal = new sucursalModel_1.default({
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
            }
            else {
                return resp.json({
                    ok: true,
                    mensaje: `Sucursal creada`,
                    sucursalDB
                });
            }
        });
    }
    // Editar sucursal
    editarSucursal(req, resp) {
        const id = req.get('id');
        const nombre = req.body.nombre;
        const telefono = req.body.telefono;
        const pais = req.body.pais;
        const ciudad = req.body.ciudad;
        const direccion = req.body.direccion;
        // const estadoHeader: string = req.get('estado');
        // const estado: boolean = castEstado(estadoHeader);
        const estado = req.get('estado');
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
        };
        sucursalModel_1.default.findById(id, (err, sucursalDB) => {
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
            sucursalModel_1.default.findByIdAndUpdate(id, query, { new: true }, (err, sucursalDBActualizada) => {
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
    obtenerSucursal(req, resp) {
        const id = req.get('id');
        sucursalModel_1.default.findById(id, (err, sucursalDB) => {
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
    obtenerSucursalIdRef(req, resp) {
        const id = req.get('idReferencia');
        sucursalModel_1.default.findOne({ idReferencia: id }, (err, sucursalDB) => {
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
    obtenerTodas(req, resp) {
        const estadoHeader = req.get('estado');
        const estado = (0, castEstado_1.castEstado)(estadoHeader);
        sucursalModel_1.default.find({}, (err, sucursalesDB) => {
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
    eliminarSucursal(req, resp) {
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
        sucursalModel_1.default.findByIdAndDelete(id, {}, (err, sucursalDB) => {
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
exports.Sucursal = Sucursal;
