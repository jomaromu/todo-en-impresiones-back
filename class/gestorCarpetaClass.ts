import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import { directSizes } from '../functions/directoriesSize';

export class GestorCarpetaClass {

    constructor() { }

    async checkSize(): Promise<any> {

        const maxSize: number = 1024 * 30;

        const pathFolder = path.resolve(__dirname, '../uploads');
        const existePath = fs.existsSync(pathFolder);

        const objSizeFolder = {
            porcentaje: 0,
            color: '',
            folder: maxSize
        }

        if (existePath) {

            const folderSize = directSizes(pathFolder, []);
            const converToMB = folderSize / Math.pow(1024, 2);

            const porcent = Math.round((converToMB / maxSize) * 100);

            objSizeFolder.porcentaje = porcent;
            if (porcent >= 0 && porcent < 25) {

                objSizeFolder.color = '#028E02';

            } else if (porcent >= 25 && porcent < 50) {

                objSizeFolder.color = '#428E02';

            } else if (porcent >= 50 && porcent < 75) {

                objSizeFolder.color = '#F39C12';

            } else if (porcent >= 75 && porcent <= 100) {

                objSizeFolder.color = '#C40202';
            }

            return objSizeFolder;

        }


    }
}