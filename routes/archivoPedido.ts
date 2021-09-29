import { Router, Request, Response } from 'express';
import { ArchivoClass } from '../class/archivoPedidoClass';
import { eliminarArchivo, verificaToken } from '../auth/auth';

// instanciar el Router
const archivoRouter = Router();

// ==================================================================== //
// Crear un archivo
// ==================================================================== //
archivoRouter.post('/nuevoArchivo', [verificaToken], (req: Request, resp: Response) => {

    const nuevoArchivo = new ArchivoClass();
    nuevoArchivo.nuevoArchivo(req, resp);
});

// ==================================================================== //
// Obtener un archivo
// ==================================================================== //
archivoRouter.get('/obtenerArchivo', [verificaToken], (req: Request, resp: Response) => {

    const obtenerArchivo = new ArchivoClass();
    obtenerArchivo.obtenerArchivo(req, resp);
});

// ==================================================================== //
// Obtener archivos
// ==================================================================== //
archivoRouter.get('/obtenerTodosArchivos', [verificaToken], (req: Request, resp: Response) => {

    const obtenerTodosArchivos = new ArchivoClass();
    obtenerTodosArchivos.obtenerTodosArchivos(req, resp);
});

// ==================================================================== //
// Obtener archivos aprobados
// ==================================================================== //
archivoRouter.get('/obtenerArchivoAProbado', [verificaToken], (req: Request, resp: Response) => {

    const obtenerArchivoAProbado = new ArchivoClass();
    obtenerArchivoAProbado.obtenerArchivoAProbado(req, resp);
});

// ==================================================================== //
// Obtener archivos no aprobados
// ==================================================================== //
archivoRouter.get('/obtenerArchivoProceso', [verificaToken], (req: Request, resp: Response) => {

    const obtenerArchivoProceso = new ArchivoClass();
    obtenerArchivoProceso.obtenerArchivoProceso(req, resp);
});

// ==================================================================== //
// Obtener archivos original
// ==================================================================== //
archivoRouter.get('/obtenerArchivoAProbadoOriginal', [verificaToken], (req: Request, resp: Response) => {

    const obtenerArchivoAProbadoOriginal = new ArchivoClass();
    obtenerArchivoAProbadoOriginal.obtenerArchivoAProbadoOriginal(req, resp);
});

// ==================================================================== //
// Eliminar un archivo por ID
// ==================================================================== //
archivoRouter.delete('/eliminarArhivoID', [verificaToken], (req: Request, resp: Response) => {

    const eliminarArhivoID = new ArchivoClass();
    eliminarArhivoID.eliminarArhivoID(req, resp);
});

// ==================================================================== //
// Eliminar un archivos por rango de fecha
// ==================================================================== //
archivoRouter.delete('/eliminarArchivoRangoFechas', [verificaToken, eliminarArchivo], (req: Request, resp: Response) => {

    const eliminarArchivoRangoFechas = new ArchivoClass();
    eliminarArchivoRangoFechas.eliminarArchivoRangoFechas(req, resp);
});

export default archivoRouter;