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

pagoRoute.get('/obtenerPagos', [verificaToken], (req: Request, resp: Response) => {

    const obtenerPagos = new PagoClass();
    obtenerPagos.obtenerPagos(req, resp);
});

pagoRoute.get('/obtenerPagosPorPedido', [verificaToken], (req: Request, resp: Response) => {

    const obtenerPagosPorPedido = new PagoClass();
    obtenerPagosPorPedido.obtenerPagosPorPedido(req, resp);
});

pagoRoute.put('/deshabilitarPago', [verificaToken], (req: Request, resp: Response) => {

    const deshabilitarPago = new PagoClass();
    deshabilitarPago.deshabilitarPago(req, resp);
});

pagoRoute.put('/desactivarPago', [verificaToken], (req: Request, resp: Response) => {

    const desactivarPago = new PagoClass();
    desactivarPago.desactivarPago(req, resp);
});

export default pagoRoute;