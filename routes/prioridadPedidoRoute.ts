import { Router, Request, Response } from 'express';
import { crearUsuario, editarUsuario, eliminarUsuario, verificaToken } from '../auth/auth';
import { prioridadClass } from '../class/prioridadPedidoClass';

// instanciar el Router
const prioridadRouter = Router();

// ==================================================================== //
// Crear una prioridad
// ==================================================================== //
prioridadRouter.post('/nuevaProridad', [verificaToken, crearUsuario], (req: Request, resp: Response) => {

    const nuevaProridad = new prioridadClass();
    nuevaProridad.nuevaProridad(req, resp);
});

// ==================================================================== //
// Editar una prioridad
// ==================================================================== //
prioridadRouter.put('/editarPrioridadPedido', [verificaToken, editarUsuario], (req: Request, resp: Response) => {

    const editarPrioridadPedido = new prioridadClass();
    editarPrioridadPedido.editarPrioridadPedido(req, resp);
});

// ==================================================================== //
// Obtener una prioridad por ID
// ==================================================================== //
prioridadRouter.get('/obtenerPrioridadID', [verificaToken], (req: Request, resp: Response) => {

    const obtenerPrioridadID = new prioridadClass();
    obtenerPrioridadID.obtenerPrioridadID(req, resp);
});

// ==================================================================== //
// Obtener todas las prioridades
// ==================================================================== //
prioridadRouter.get('/obtenerTodasPrioridades', [verificaToken], (req: Request, resp: Response) => {

    const obtenerTodasPrioridades = new prioridadClass();
    obtenerTodasPrioridades.obtenerTodasPrioridades(req, resp);
});

// ==================================================================== //
// Eliminar una prioridad
// ==================================================================== //
prioridadRouter.delete('/eliminarPrioridad', [verificaToken, eliminarUsuario], (req: Request, resp: Response) => {

    const eliminarPrioridad = new prioridadClass();
    eliminarPrioridad.eliminarPrioridad(req, resp);
});

export default prioridadRouter;