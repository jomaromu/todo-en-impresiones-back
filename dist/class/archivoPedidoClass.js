"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArchivoClass = void 0;
const nanoid_1 = require("nanoid");
// Clases
const gestorCarpetaClass_1 = require("./gestorCarpetaClass");
const moment_1 = __importDefault(require("moment"));
moment_1.default.locale('es');
// Modelo
const archivosModel_1 = __importDefault(require("../models/archivosModel"));
const pedidoModel_1 = __importDefault(require("../models/pedidoModel"));
// Funciones externas
const archivos_1 = require("../functions/archivos");
const castEstado_1 = require("../functions/castEstado");
const server_1 = __importDefault(require("./server"));
class ArchivoClass {
    constructor() {
        this.idRef = (0, nanoid_1.nanoid)(10);
    }
    nuevoArchivo(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const idReferencia = this.idRef;
            const idCreador = req.usuario._id;
            const files = req.files;
            const tipo = req.body.tipo;
            // const nombre = req.body.nombre;
            const respArch = yield (0, archivos_1.extraerArchivo)(files);
            if (respArch.ok === false) {
                return resp.json({
                    ok: false,
                    mensaje: respArch.mensaje
                });
            }
            else {
                const file = respArch.data;
                const resArch = yield (0, archivos_1.subirArchivo)(file, req); // Recibo nombre del archivo
                if (resArch.ok === false) {
                    return resp.json({
                        ok: false,
                        mensaje: resArch.mensaje
                    });
                }
                else {
                    const nombre_archivo = resArch.mensaje;
                    // Crear archivo en DB
                    const nuevoArchivo = new archivosModel_1.default({
                        idReferencia: idReferencia,
                        idCreador: idCreador,
                        nombre_archivo: nombre_archivo,
                        pedido: req.get('pedido'),
                        // fecha: moment().format('YYYY-MM-DD'),
                        // fecha: moment('2021-08-30').format('YYYY-MM-DD'),
                        fecha: (0, moment_1.default)().add(3, 'days').format('YYYY-MM-DD'),
                        tipo: tipo
                    });
                    // eliminarArchivo(nombre_archivo);
                    nuevoArchivo.save((err, archivoDB) => {
                        if (err) {
                            (0, archivos_1.eliminarArchivo)(nombre_archivo);
                            return resp.json({
                                ok: false,
                                mensaje: `No se pudo guardar el archivo en la DB`,
                                err
                            });
                        }
                        else {
                            const pedido = req.get('pedido');
                            pedidoModel_1.default.findById(pedido, (err, pedidoDB) => __awaiter(this, void 0, void 0, function* () {
                                if (err) {
                                    (0, archivos_1.eliminarArchivo)(nombre_archivo);
                                    yield archivosModel_1.default.findByIdAndDelete(archivoDB._id);
                                    return resp.json({
                                        ok: false,
                                        mensaje: `Error interno`,
                                        err
                                    });
                                }
                                if (!pedidoDB) {
                                    (0, archivos_1.eliminarArchivo)(nombre_archivo);
                                    yield archivosModel_1.default.findByIdAndDelete(archivoDB._id);
                                    return resp.json({
                                        ok: false,
                                        mensaje: `No se encontró un pedido para anexar un archivo`
                                    });
                                }
                                if (pedidoDB.productos_pedidos.length <= 0) {
                                    (0, archivos_1.eliminarArchivo)(nombre_archivo);
                                    yield archivosModel_1.default.findByIdAndDelete(archivoDB._id);
                                    return resp.json({
                                        ok: false,
                                        mensaje: `Debe agregar un producto para poder crear archivos`
                                    });
                                }
                                pedidoModel_1.default.findByIdAndUpdate(pedido, { $push: { archivos: archivoDB._id } }, { new: true }, (err, pedidoDB) => __awaiter(this, void 0, void 0, function* () {
                                    if (err) {
                                        (0, archivos_1.eliminarArchivo)(nombre_archivo);
                                        yield archivosModel_1.default.findByIdAndDelete(archivoDB._id);
                                        return resp.json({
                                            ok: false,
                                            mensaje: `Error interno`,
                                            err
                                        });
                                    }
                                    if (!pedidoDB) {
                                        (0, archivos_1.eliminarArchivo)(nombre_archivo);
                                        yield archivosModel_1.default.findByIdAndDelete(archivoDB._id);
                                        return resp.json({
                                            ok: false,
                                            mensaje: `No se encontró un pedido para anexar un archivo`
                                        });
                                    }
                                    const gestorCarpeta = new gestorCarpetaClass_1.GestorCarpetaClass();
                                    const respGestor = yield gestorCarpeta.checkSize();
                                    const server = server_1.default.instance;
                                    server.io.emit('recibir-archivos');
                                    return resp.json({
                                        ok: true,
                                        mensaje: 'Archivo subido',
                                        pedidoDB,
                                        archivoDB,
                                        carpeta: respGestor
                                    });
                                }));
                            }));
                        }
                    });
                }
            }
        });
    }
    obtenerArchivo(req, resp) {
        const id = req.get('id');
        archivosModel_1.default.findById(id, (err, archivoDB) => {
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
    obtenerTodosArchivos(req, resp) {
        // const estadoHeader: string = req.get('estado');
        // const estado: boolean = castEstado(estadoHeader);
        archivosModel_1.default.find({})
            .sort({ tipo: 1 })
            .populate('idCreador')
            .exec((err, archivosDB) => {
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
    obtenerArchivosPorPedido(req, resp) {
        const idPedido = req.get('idPedido');
        archivosModel_1.default.find({ pedido: idPedido })
            .sort({ tipo: 1 })
            .populate('idCreador')
            .exec((err, archivosDB) => {
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
    obtenerArchivoAProbado(req, resp) {
        const estadoHeader = req.get('estado');
        const estado = (0, castEstado_1.castEstado)(estadoHeader);
        archivosModel_1.default.find({ tipo: 'aprobado', estado: estado }, (err, archivosDB) => {
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
    obtenerArchivoProceso(req, resp) {
        const estadoHeader = req.get('estado');
        const estado = (0, castEstado_1.castEstado)(estadoHeader);
        archivosModel_1.default.find({ tipo: 'proceso', estado: estado }, (err, archivosDB) => {
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
    obtenerArchivoAProbadoOriginal(req, resp) {
        const estadoHeader = req.get('estado');
        const estado = (0, castEstado_1.castEstado)(estadoHeader);
        archivosModel_1.default.find({ tipo: 'original', estado: estado }, (err, archivosDB) => {
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
    eliminarArhivoID(req, resp) {
        const id = req.get('id');
        const pedido = req.get('pedido');
        archivosModel_1.default.findById(id, (err, archivoDB) => {
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
            (0, archivos_1.eliminarArchivo)(nombre_archivo);
            archivosModel_1.default.findByIdAndDelete(id, {}, (err, archivoEliminadoDB) => {
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
                pedidoModel_1.default.findById(pedido, (err, pedidoDB) => {
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
                    pedidoModel_1.default.findByIdAndUpdate(pedido, { $pull: { archivos: { $in: id } } }, { new: true }, (err, archivoDB) => __awaiter(this, void 0, void 0, function* () {
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
                        const gestorCarpeta = new gestorCarpetaClass_1.GestorCarpetaClass();
                        const respGestor = yield gestorCarpeta.checkSize();
                        const server = server_1.default.instance;
                        server.io.emit('recibir-archivos');
                        return resp.json({
                            ok: true,
                            mensaje: 'Archivo eliminado',
                            archivoDB,
                            carpeta: respGestor
                        });
                    }));
                });
            });
        });
    }
    eliminarArchivoRangoFechas(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const fecha_inicial = req.body.fecha_inicial;
            const fecha_final = req.body.fecha_final;
            let tipo = req.body.tipo;
            const pedido = req.get('pedido');
            archivosModel_1.default.find({ $and: [{ pedido: pedido }, { tipo: tipo }, { fecha: { $gte: fecha_inicial } }, { fecha: { $lte: fecha_final } }] }, (err, archivosDB) => __awaiter(this, void 0, void 0, function* () {
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
                        (0, archivos_1.eliminarArchivo)(nombre_archivo);
                    });
                }
                archivosModel_1.default.deleteMany({ $and: [{ pedido: pedido }, { tipo: tipo }, { fecha: { $gte: fecha_inicial } }, { fecha: { $lte: fecha_final } }] })
                    .then(res => {
                    const idsArchivos = archivosDB.map((ele) => {
                        return ele._id;
                    });
                    pedidoModel_1.default.findById(pedido, (err, pedidoDB) => {
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
                        };
                        pedidoModel_1.default.findByIdAndUpdate(pedido, { $pull: { archivos: { $in: idsArchivos } } }, { new: true }, (err, pedidoActualizadoDB) => __awaiter(this, void 0, void 0, function* () {
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
                            const gestorCarpeta = new gestorCarpetaClass_1.GestorCarpetaClass();
                            const respGestor = yield gestorCarpeta.checkSize();
                            return resp.json({
                                ok: true,
                                pedidoActualizadoDB,
                                carpeta: respGestor
                            });
                        }));
                    });
                }).catch(errr => {
                    return resp.json({
                        ok: false,
                        mensaje: `Error`,
                        errr
                    });
                });
            }));
        });
    }
}
exports.ArchivoClass = ArchivoClass;
