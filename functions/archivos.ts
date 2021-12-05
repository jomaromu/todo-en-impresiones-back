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
    // const arrayMime = file.mimetype.split('/');
    // const mime = arrayMime[arrayMime.length - 1];

    console.log(mime);

    if (mime !== 'text/plain' && mime !== 'image/png' && mime !== 'image/svg+xml' && mime !== 'image/tiff' && mime !== 'image/jpeg' && mime !== 'application/vnd.ms-powerpoint' && mime !== 'application/vnd.openxmlformats-officedocument.presentationml.presentation' && mime !== 'application/pdf' && mime !== 'application/msword' && mime !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && mime !== 'text/pain' && mime !== 'application/vnd.ms-excel' && mime !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {

        objArchivo.ok = false;
        objArchivo.mensaje = `El archivo no permitido`;
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

    if (!req.body.nombre || req.body.nombre === 'null') {
        nombreArchivo = `${nanoid(10)}.${mime}`;
    } else {
        nombreArchivo = `${req.body.nombre}-${miliseconds}${random}.${mime}`;
    }

    // console.log(nombreArchivo);

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