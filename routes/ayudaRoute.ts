import { Router, Request, Response } from 'express';

// Auth
import { verificaToken } from '../auth/auth';
import { AyudaClass } from '../class/ayudaClass';


const ayudaRoute = Router();

ayudaRoute.post('/crearAyuda', [verificaToken], (req: Request, resp: Response) => {

    const crearAyuda = new AyudaClass();
    crearAyuda.crearAyuda(req, resp);
});

ayudaRoute.put('/editarAyuda', [verificaToken], (req: Request, resp: Response) => {

    const editarAyuda = new AyudaClass();
    editarAyuda.editarAyuda(req, resp);
});

ayudaRoute.get('/obtenerAyudaID', [verificaToken], (req: Request, resp: Response) => {

    const obtenerAyudaID = new AyudaClass();
    obtenerAyudaID.obtenerAyudaID(req, resp);
});

ayudaRoute.get('/obtenerTodas', [verificaToken], (req: Request, resp: Response) => {

    const obtenerTodas = new AyudaClass();
    obtenerTodas.obtenerTodas(req, resp);
});

ayudaRoute.delete('/eliminarAyuda', [verificaToken], (req: Request, resp: Response) => {

    const eliminarAyuda = new AyudaClass();
    eliminarAyuda.eliminarAyuda(req, resp);
});

export default ayudaRoute;