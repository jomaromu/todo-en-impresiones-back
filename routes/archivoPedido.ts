import { Router, Request, Response } from 'express';
import { ArchivoClass } from '../class/archivoPedidoClass';
import { eliminarArchivo, verificaToken } from '../auth/auth';
import path from 'path';

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
// Obtener archivos por pedido
// ==================================================================== //
archivoRouter.get('/obtenerArchivosPorPedido', [verificaToken], (req: Request, resp: Response) => {

    const obtenerArchivosPorPedido = new ArchivoClass();
    obtenerArchivosPorPedido.obtenerArchivosPorPedido(req, resp);
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

// ==================================================================== //
// Enviar archivo
// ==================================================================== //
archivoRouter.get('/enviarArchivo', (req: Request, resp: Response) => {

    const nombreArchivo = req.query.nombreArchivo; 
    // dist/uploads/archivos/null-3216.jpg

    const pathFile = path.resolve(__dirname, `../uploads/archivos/${nombreArchivo}`);
    return resp.sendFile(pathFile);
});
 

export default archivoRouter;