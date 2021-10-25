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
exports.GestorCarpetaClass = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const directoriesSize_1 = require("../functions/directoriesSize");
class GestorCarpetaClass {
    constructor() { }
    checkSize() {
        return __awaiter(this, void 0, void 0, function* () {
            const maxSize = 1024 * 30;
            const pathFolder = path_1.default.resolve(__dirname, '../uploads');
            const existePath = fs_1.default.existsSync(pathFolder);
            const objSizeFolder = {
                porcentaje: 0,
                color: '',
                folder: maxSize
            };
            if (existePath) {
                const folderSize = (0, directoriesSize_1.directSizes)(pathFolder, []);
                const converToMB = folderSize / Math.pow(1024, 2);
                const porcent = Math.round((converToMB / maxSize) * 100);
                objSizeFolder.porcentaje = porcent;
                if (porcent >= 0 && porcent < 25) {
                    objSizeFolder.color = '#028E02';
                }
                else if (porcent >= 25 && porcent < 50) {
                    objSizeFolder.color = '#428E02';
                }
                else if (porcent >= 50 && porcent < 75) {
                    objSizeFolder.color = '#F39C12';
                }
                else if (porcent >= 75 && porcent <= 100) {
                    objSizeFolder.color = '#C40202';
                }
                return objSizeFolder;
            }
        });
    }
}
exports.GestorCarpetaClass = GestorCarpetaClass;
