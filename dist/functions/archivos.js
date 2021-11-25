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
exports.verFile = exports.eliminarArchivo = exports.subirArchivo = exports.extraerArchivo = void 0;
const nanoid_1 = require("nanoid");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const rimraf = require('rimraf');
const extraerArchivo = (files) => __awaiter(void 0, void 0, void 0, function* () {
    const objArchivo = {
        ok: false,
        mensaje: '',
        data: null
    };
    return new Promise((resolve, reject) => {
        // Caso de que no venga ningun archivo
        if (!files) {
            objArchivo.ok = false;
            objArchivo.mensaje = 'No hay archivos';
            reject(objArchivo);
        }
        // Si viene un sólo archivo
        if (!files.archivo.length) {
            verificaMime(files.archivo, resolve, reject, objArchivo);
        }
        // Si vienen varios archivos
        if (files.archivo.length > 0) {
            const img = files.archivo[0];
            verificaMime(img, resolve, reject, objArchivo);
        }
    }).then(res => {
        return res;
    }).catch(err => {
        return err;
    });
});
exports.extraerArchivo = extraerArchivo;
const verificaMime = (file, resolve, reject, objArchivo) => {
    // const mime = file.mimetype;
    const arrayMime = file.mimetype.split('/');
    const mime = arrayMime[arrayMime.length - 1];
    if (mime !== 'png' && mime !== 'jpeg' && mime !== 'svg' && mime !== 'tif' && mime !== 'tiff' && mime !== 'jpg' && mime !== 'ppt' && mime !== 'pdf') {
        objArchivo.ok = false;
        objArchivo.mensaje = `El archivo no parece ser una imágen válida`;
        resolve(objArchivo);
    }
    else {
        objArchivo.ok = true;
        objArchivo.data = file;
        resolve(objArchivo);
    }
};
// Manejar archivos de pedidos
const subirArchivo = (file, req) => __awaiter(void 0, void 0, void 0, function* () {
    const pathArch = path_1.default.resolve(__dirname, `../uploads/archivos`);
    const arrayName = file.name.split('.');
    const mime = arrayName[arrayName.length - 1];
    // const nombreArchivo = `${nanoid(10)}.${mime}`;
    const miliseconds = new Date().getMilliseconds();
    const random = Math.round(Math.random() * 100);
    let nombreArchivo = '';
    if (!req.body.nombre || req.body.nombre === undefined || req.body.nombre === 'undefined') {
        nombreArchivo = `${(0, nanoid_1.nanoid)(10)}.${mime}`;
    }
    else {
        nombreArchivo = `${req.body.nombre}-${miliseconds}${random}.${mime}`;
    }
    console.log(nombreArchivo);
    return new Promise((resolve, reject) => {
        const objArch = {
            ok: false,
            mensaje: '',
            data: {}
        };
        // Si no existe el directorio
        if (!fs_1.default.existsSync(pathArch)) {
            fs_1.default.mkdir(pathArch, { recursive: true }, (err) => {
                if (err) {
                    objArch.ok = false;
                    objArch.mensaje = `Error al crear la carpeta para subir archivos`;
                    reject(objArch);
                }
                else {
                    // Subir archivo
                    file.mv(`${pathArch}/${nombreArchivo}`, (err) => {
                        if (err) {
                            objArch.ok = false;
                            objArch.mensaje = `Error al subir archivos`;
                            reject(objArch);
                        }
                        else {
                            objArch.ok = true;
                            objArch.mensaje = nombreArchivo;
                            resolve(objArch);
                        }
                    });
                }
            });
        }
        else {
            // Subir archivo
            file.mv(`${pathArch}/${nombreArchivo}`, (err) => {
                if (err) {
                    objArch.ok = false;
                    objArch.mensaje = `Error al subir archivos`;
                    reject(objArch);
                }
                else {
                    objArch.ok = true;
                    objArch.mensaje = nombreArchivo;
                    resolve(objArch);
                }
            });
        }
    }).then(res => {
        return res;
    }).catch(err => {
        return err;
    });
});
exports.subirArchivo = subirArchivo;
const eliminarArchivo = (nombreArchivo) => {
    try {
        const pathArchivo = path_1.default.resolve(__dirname, `../uploads/archivos/${nombreArchivo}`);
        rimraf.sync(pathArchivo);
    }
    catch (error) {
        console.log('error al eliminar archivo'); // revisar ..........................................................................
    }
};
exports.eliminarArchivo = eliminarArchivo;
const verFile = (ruta, file, resp) => {
    const folder = path_1.default.resolve(__dirname, `${ruta}/${file}`);
    return resp.sendFile(folder);
};
exports.verFile = verFile;
