import { Request, Response } from 'express';
import { nanoid } from 'nanoid';
import fs from 'fs';
import path from 'path';
import { UploadedFile } from 'express-fileupload';

const rimraf = require('rimraf');

const extraerArchivo = async (files: UploadedFile | any): Promise<any> => {

    const objArchivo: RespPromise = {
        ok: false,
        mensaje: '',
        data: null
    }

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
}

const verificaMime = (file: UploadedFile, resolve: any, reject: any, objArchivo: RespPromise) => {

    const mime = file.mimetype;

    if (mime !== 'image/jpeg' && mime !== 'application/pdf') {

        objArchivo.ok = false;
        objArchivo.mensaje = `El archivo no parece ser una imágen válida`;
        resolve(objArchivo);

    } else {

        objArchivo.ok = true;
        objArchivo.data = file;
        resolve(objArchivo);

    }
}

// Manejar archivos de pedidos
const subirArchivo = async (file: UploadedFile, req: Request): Promise<any> => {

    const pathArch = path.resolve(__dirname, `../uploads/archivos`);

    const arrayName = file.name.split('.');
    const mime = arrayName[arrayName.length - 1];
    // const nombreArchivo = `${nanoid(10)}.${mime}`;
    const miliseconds = new Date().getMilliseconds();
    const random = Math.round(Math.random() * 100);
    let nombreArchivo: string = '';

    if (!req.body.nombre || req.body.nombre === undefined || req.body.nombre === 'undefined') {
        nombreArchivo = `${nanoid(10)}.${mime}`;
    } else {
        nombreArchivo = `${req.body.nombre}-${miliseconds}${random}.${mime}`;
    }

    console.log(nombreArchivo);

    return new Promise((resolve, reject) => {

        const objArch: RespPromise = {
            ok: false,
            mensaje: '',
            data: {}
        }

        // Si no existe el directorio
        if (!fs.existsSync(pathArch)) {

            fs.mkdir(pathArch, { recursive: true }, (err) => {

                if (err) {

                    objArch.ok = false;
                    objArch.mensaje = `Error al crear la carpeta para subir archivos`;
                    reject(objArch);

                } else {

                    // Subir archivo
                    file.mv(`${pathArch}/${nombreArchivo}`, (err) => {

                        if (err) {
                            objArch.ok = false;
                            objArch.mensaje = `Error al subir archivos`;
                            reject(objArch);

                        } else {

                            objArch.ok = true;
                            objArch.mensaje = nombreArchivo;
                            resolve(objArch);
                        }
                    });
                }
            });

        } else {

            // Subir archivo
            file.mv(`${pathArch}/${nombreArchivo}`, (err) => {

                if (err) {
                    objArch.ok = false;
                    objArch.mensaje = `Error al subir archivos`;
                    reject(objArch);

                } else {

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
}

const eliminarArchivo = (nombreArchivo: string) => {

    try {

        const pathArchivo = path.resolve(__dirname, `../uploads/archivos/${nombreArchivo}`);
        rimraf.sync(pathArchivo);

    } catch (error) {

        console.log('error al eliminar archivo'); // revisar ..........................................................................
    }
}

const verFile = (ruta: string, file: string, resp: Response) => {

    const folder = path.resolve(__dirname, `${ruta}/${file}`);
    return resp.sendFile(folder);
}

export {
    extraerArchivo,
    subirArchivo,
    eliminarArchivo,
    verFile
}

interface RespPromise {
    ok: boolean;
    mensaje: string;
    data: UploadedFile | any;
}