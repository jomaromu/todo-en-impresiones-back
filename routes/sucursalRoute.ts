import { Router, Request, Response } from 'express';
import { crearUsuario, editarUsuario, eliminarUsuario, verificaToken } from '../auth/auth';
import { Sucursal } from '../class/sucursalClass';

// instanciar el Router
const sucursalRouter = Router();

// ==================================================================== //
// Crear una sucursal
// ==================================================================== //
sucursalRouter.post('/nuevaSucursal', [verificaToken, crearUsuario], (req: Request, resp: Response) => {

    const nuevaSucursal = new Sucursal();
    nuevaSucursal.nuevaSucursal(req, resp);
});

// ==================================================================== //
// Editar una sucursal
// ==================================================================== //
sucursalRouter.put('/editarSucursal', [verificaToken, editarUsuario], (req: Request, resp: Response) => {

    const editarSucursal = new Sucursal();
    editarSucursal.editarSucursal(req, resp);
});

// ==================================================================== //
// Obtener una sucursal por ID
// ==================================================================== //
sucursalRouter.get('/obtenerSucursalID', [verificaToken], (req: Request, resp: Response) => {

    const obtenerSucursal = new Sucursal();
    obtenerSucursal.obtenerSucursal(req, resp);
});

// ==================================================================== //
// Obtener una sucursal por ID Referencia
// ==================================================================== //
sucursalRouter.get('/obtenerSucursalIDRef', [verificaToken], (req: Request, resp: Response) => {

    const obtenerSucursal = new Sucursal();
    obtenerSucursal.obtenerSucursalIdRef(req, resp);
});

// ==================================================================== //
// Obtener todas las sucursales
// ==================================================================== //
sucursalRouter.get('/obtenerTodasSucursales', [verificaToken], (req: Request, resp: Response) => {

    const obtenerTodas = new Sucursal();
    obtenerTodas.obtenerTodas(req, resp);

});

// ==================================================================== //
// Eliminar una sucursal
// ==================================================================== //
sucursalRouter.delete('/eliminarSucursal', [verificaToken, eliminarUsuario], (req: Request, resp: Response) => {

    const eliminarSucursal = new Sucursal();
    eliminarSucursal.eliminarSucursal(req, resp);
});

export default sucursalRouter;