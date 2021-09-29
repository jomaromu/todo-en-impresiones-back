import { Router, Request, Response } from 'express';
import { verificaToken } from '../auth/auth';
import { PagoClass } from '../class/pagoClass';


const pagoRoute = Router();

pagoRoute.post('/crearPago', [verificaToken], (req: Request, resp: Response) => {

    const crearPago = new PagoClass();
    crearPago.crearPago(req, resp);
});

pagoRoute.get('/obtenerPagoID', [verificaToken], (req: Request, resp: Response) => {

    const obtenerPagoID = new PagoClass();
    obtenerPagoID.obtenerPagoID(req, resp);
});

pagoRoute.put('/deshabilitarPago', [verificaToken], (req: Request, resp: Response) => {

    const deshabilitarPago = new PagoClass();
    deshabilitarPago.deshabilitarPago(req, resp);
});

export default pagoRoute;