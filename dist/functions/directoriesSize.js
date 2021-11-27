"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.directSizes = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const directSizes = (dirPath, arrayOfFiles) => {
    const resp = getAllFiles(dirPath, arrayOfFiles);
    let arrayFiles = 0;
    if (arrayOfFiles.length === 0) {
        arrayFiles = 0;
    }
    if (arrayOfFiles.length !== 0) {
        const totalSize = resp.map((respFile) => {
            const mapSizes = fs_1.default.statSync(respFile);
            return mapSizes.size;
        });
        arrayFiles = totalSize.reduce((acc, current) => {
            return acc + current;
        });
    }
    return arrayFiles;
    // const totalSize = resp.map((respFile) => {
    //     const mapSizes = fs.statSync(respFile);
    //     return mapSizes.size;
    // });
    // return totalSize.reduce((acc: number, current: number) => {
    //     return acc + current;
    // });
};
exports.directSizes = directSizes;
const getAllFiles = (dirPath, arrayOfFiles) => {
    const files = fs_1.default.readdirSync(dirPath); // Lee directorios y archivos
    arrayOfFiles = arrayOfFiles || [];
    // Verificar si cada elemento del array es un directorio
    files.forEach(file => {
        if (fs_1.default.statSync(`${dirPath}/${file}`).isDirectory()) {
            arrayOfFiles = getAllFiles(`${dirPath}/${file}`, arrayOfFiles);
        }
        else {
            arrayOfFiles.push(path_1.default.join(`${dirPath}/${file}`));
        }
    });
    return arrayOfFiles;
};
