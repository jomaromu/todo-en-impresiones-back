import { Router, Request, Response } from 'express';
import path from 'path';
import { verificaToken } from '../auth/auth';
import { verFile } from '../functions/archivos';

const getFileRouter = Router();

// Obtener img de archivos
getFileRouter.get('/:file', [verificaToken], (req: Request, resp: Response) => {

    const ruta = path.resolve(__dirname, `../uploads/archivos`);
    const file = req.params.file;
    // console.log(file);
    // return;
    // const file = req.get('file') || '';
    verFile(ruta, file, resp);
});


export default getFileRouter;