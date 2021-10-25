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
exports.archivoJson = exports.directorios = void 0;
const fs_1 = __importDefault(require("fs"));
const nanoid_1 = require("nanoid");
// Manejar directorio
const directorios = (pathAssets, idRef, pathIds) => {
    return new Promise((resolve, reject) => {
        const objDir = {
            ok: false,
            data: ''
        };
        fs_1.default.mkdir(`${pathAssets}`, { recursive: true }, (err) => {
            if (err) {
                objDir.ok = false;
                objDir.data = `Error al crear el directorio para los IDs`;
                reject(objDir);
            }
            else {
                const Ids = {
                    ids: []
                };
                Ids.ids.push(idRef);
                const archivo = JSON.stringify(Ids);
                // Crear el archivo Json e insertar el ID
                fs_1.default.writeFile(`${pathAssets}/${pathIds}`, archivo, (err) => {
                    if (err) {
                        objDir.ok = false;
                        objDir.data = `Error al crear o escribir en el archivo de los IDs`;
                        reject(objDir);
                    }
                    else {
                        objDir.ok = true;
                        objDir.data = idRef;
                        resolve(objDir);
                    }
                });
            }
        });
    });
};
exports.directorios = directorios;
// Menajar archivo Json
const archivoJson = (pathAssets, idRef, cantIdsPermitidos, pathIds) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const objArch = {
            ok: false,
            data: ''
        };
        if (!fs_1.default.existsSync(`${pathAssets}/${pathIds}`)) {
            // Crear el archivo e insertar el ID
            const respDir = yield directorios(pathAssets, idRef, pathIds);
            if (respDir.ok === false) {
                objArch.ok = false;
                objArch.data = respDir.data;
                // reject(respDir.data);
                reject(objArch);
            }
            else {
                objArch.ok = true;
                objArch.data = respDir.data;
                // resolve(respDir.data);
                resolve(objArch);
            }
        }
        else {
            /*
                Leer si existe el atributo id
                Recorre los IDs
                Verificar que ninguno coincida con el idRef
                Insertar el ID
            */
            fs_1.default.readFile(`${pathAssets}/${pathIds}`, (err, archivo) => {
                try {
                    const archObj = JSON.parse(archivo);
                    if (err) {
                        objArch.ok = false;
                        objArch.data = `Error al leer el archivo de los IDs`;
                        reject(objArch);
                    }
                    else {
                        const attrIds = archObj.ids;
                        const objIds = {
                            ids: []
                        };
                        objIds.ids.push(idRef);
                        const data = JSON.stringify(objIds);
                        // Crear la propiedad ids
                        if (!attrIds) {
                            fs_1.default.writeFile(`${pathAssets}/${pathIds}`, data, (err) => {
                                if (err) {
                                    objArch.ok = false;
                                    objArch.data = `Error al crear la propiedad ids en el archivo de los IDs`;
                                    reject(objArch);
                                }
                                else {
                                    objArch.ok = true;
                                    objArch.data = idRef;
                                    resolve(objArch);
                                }
                            });
                        }
                        else {
                            // Cantida de Ids permitidos
                            if (attrIds.length > cantIdsPermitidos) {
                                objArch.ok = false;
                                objArch.data = `Ha superado el límite de IDs permitidos, cantidad de IDs registrados: ${cantIdsPermitidos}`;
                                reject(objArch);
                            }
                            else {
                                attrIds.find(id => {
                                    if (idRef === id) {
                                        idRef = (0, nanoid_1.nanoid)(10);
                                    }
                                });
                                attrIds.push(idRef);
                                const archstring = JSON.stringify(archObj);
                                fs_1.default.writeFile(`${pathAssets}/${pathIds}`, archstring, (err) => {
                                    if (err) {
                                        objArch.ok = false;
                                        objArch.data = `Error al crear la propiedad ids en el archivo de los IDs`;
                                        reject(objArch);
                                    }
                                    else {
                                        objArch.ok = true;
                                        objArch.data = idRef;
                                        resolve(objArch);
                                    }
                                });
                            }
                        }
                    }
                }
                catch (error) {
                    objArch.ok = false;
                    objArch.data = `No se reconoce el archivo de los IDs`;
                    reject(objArch);
                }
            });
        }
    }));
};
exports.archivoJson = archivoJson;
