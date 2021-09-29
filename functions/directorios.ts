import fs from 'fs';
import { nanoid } from 'nanoid'

// Manejar directorio
const directorios = (pathAssets: string, idRef: string, pathIds: string): Promise<any> => {

    return new Promise((resolve, reject) => {

        const objDir: RespPromise = {
            ok: false,
            data: ''
        }

        fs.mkdir(`${pathAssets}`, { recursive: true }, (err) => {

            if (err) {

                objDir.ok = false;
                objDir.data = `Error al crear el directorio para los IDs`;
                reject(objDir);

            } else {

                const Ids: any = {
                    ids: []
                }

                Ids.ids.push(idRef);
                const archivo = JSON.stringify(Ids);

                // Crear el archivo Json e insertar el ID
                fs.writeFile(`${pathAssets}/${pathIds}`, archivo, (err) => {

                    if (err) {

                        objDir.ok = false;
                        objDir.data = `Error al crear o escribir en el archivo de los IDs`;
                        reject(objDir);

                    } else {

                        objDir.ok = true;
                        objDir.data = idRef;
                        resolve(objDir);
                    }
                });
            }
        });
    });

}

// Menajar archivo Json
const archivoJson = (pathAssets: string, idRef: string, cantIdsPermitidos: number, pathIds: string): Promise<any> => {

    return new Promise(async (resolve, reject) => {

        const objArch: RespPromise = {
            ok: false,
            data: ''
        }

        if (!fs.existsSync(`${pathAssets}/${pathIds}`)) {

            // Crear el archivo e insertar el ID
            const respDir: RespPromise = await directorios(pathAssets, idRef, pathIds);

            if (respDir.ok === false) {

                objArch.ok = false;
                objArch.data = respDir.data;
                // reject(respDir.data);
                reject(objArch);

            } else {

                objArch.ok = true;
                objArch.data = respDir.data;
                // resolve(respDir.data);
                resolve(objArch);
            }

        } else {

            /* 
                Leer si existe el atributo id
                Recorre los IDs
                Verificar que ninguno coincida con el idRef
                Insertar el ID
            */

            fs.readFile(`${pathAssets}/${pathIds}`, (err, archivo: any) => {

                try {

                    const archObj: Archivo = JSON.parse(archivo);

                    if (err) {

                        objArch.ok = false;
                        objArch.data = `Error al leer el archivo de los IDs`;
                        reject(objArch);

                    } else {

                        const attrIds = archObj.ids;
                        const objIds: any = {
                            ids: []
                        }

                        objIds.ids.push(idRef);
                        const data = JSON.stringify(objIds);

                        // Crear la propiedad ids

                        if (!attrIds) {

                            fs.writeFile(`${pathAssets}/${pathIds}`, data, (err) => {

                                if (err) {

                                    objArch.ok = false;
                                    objArch.data = `Error al crear la propiedad ids en el archivo de los IDs`;
                                    reject(objArch);

                                } else {

                                    objArch.ok = true;
                                    objArch.data = idRef;
                                    resolve(objArch);
                                }
                            });

                        } else {

                            // Cantida de Ids permitidos
                            if (attrIds.length > cantIdsPermitidos) {

                                objArch.ok = false;
                                objArch.data = `Ha superado el límite de IDs permitidos, cantidad de IDs registrados: ${cantIdsPermitidos}`;
                                reject(objArch);

                            } else {

                                attrIds.find(id => {

                                    if (idRef === id) {

                                        idRef = nanoid(10);
                                    }
                                });

                                attrIds.push(idRef);
                                const archstring = JSON.stringify(archObj);

                                fs.writeFile(`${pathAssets}/${pathIds}`, archstring, (err) => {

                                    if (err) {

                                        objArch.ok = false;
                                        objArch.data = `Error al crear la propiedad ids en el archivo de los IDs`;
                                        reject(objArch);

                                    } else {

                                        objArch.ok = true;
                                        objArch.data = idRef;
                                        resolve(objArch);
                                    }
                                });
                            }
                        }

                    }

                } catch (error) {

                    objArch.ok = false;
                    objArch.data = `No se reconoce el archivo de los IDs`;
                    reject(objArch);

                }

            });
        }

    });

}

interface Archivo {
    ids: Array<string>
}

interface RespPromise {
    ok: boolean;
    data: string;
}

export {
    directorios,
    archivoJson,
}