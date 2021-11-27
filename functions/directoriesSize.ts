import path from 'path';
import fs from 'fs';

const directSizes = (dirPath: string, arrayOfFiles: Array<any>): number => {


    const resp: Array<string> = getAllFiles(dirPath, arrayOfFiles);
    let arrayFiles = 0;


    if (arrayOfFiles.length === 0) {
        arrayFiles = 0;
    }

    if (arrayOfFiles.length !== 0) {

        const totalSize = resp.map((respFile) => {

            const mapSizes = fs.statSync(respFile);
            return mapSizes.size;
        });

        arrayFiles = totalSize.reduce((acc: number, current: number) => {
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

}

const getAllFiles = (dirPath: string, arrayOfFiles: Array<string>): Array<string> => {

    const files = fs.readdirSync(dirPath); // Lee directorios y archivos

    arrayOfFiles = arrayOfFiles || [];

    // Verificar si cada elemento del array es un directorio
    files.forEach(file => {
        if (fs.statSync(`${dirPath}/${file}`).isDirectory()) {

            arrayOfFiles = getAllFiles(`${dirPath}/${file}`, arrayOfFiles);

        } else {

            arrayOfFiles.push(path.join(`${dirPath}/${file}`));
        }
    });

    return arrayOfFiles;
}

export {
    directSizes
}