import { Router, Request, Response } from 'express';
import { WorkkerClass } from '../class/workerClass';

// instanciar el Router
const workerRouter = Router();

// Auth
import {
    crearUsuario,
    editarUsuario,
    eliminarUsuario,
    verificaToken
} from '../auth/auth';

// ==================================================================== //
// Crear un usuario super
// ==================================================================== //
workerRouter.post('/nuevoUsuarioSuper', (req: Request, resp: Response) => {

    const nuevoUsuarioSuper = new WorkkerClass();
    nuevoUsuarioSuper.nuevoUsuarioSuper(req, resp);
});

// ==================================================================== //
// Crear un usuario
// ==================================================================== //
workerRouter.post('/nuevoUsuario', [verificaToken, crearUsuario], (req: Request, resp: Response) => {

    const nuevoUsuario = new WorkkerClass();
    nuevoUsuario.nuevoUsuario(req, resp);
});

// ==================================================================== //
// Editar un usuario
// ==================================================================== //
workerRouter.put('/editarUsuario', [verificaToken, editarUsuario], (req: Request, resp: Response) => {

    const editarUsuario = new WorkkerClass();
    editarUsuario.editarUsuario(req, resp);
});

// ==================================================================== //
// Editar perfil
// ==================================================================== //
workerRouter.put('/EditarPefil', [verificaToken], (req: Request, resp: Response) => {

    const EditarPefil = new WorkkerClass();
    EditarPefil.EditarPefil(req, resp);
});

// ==================================================================== //
// Obtener un usuario por ID
// ==================================================================== //
workerRouter.get('/obtenerUsuarioID', [verificaToken], (req: Request, resp: Response) => {

    const obtenerUsuarioID = new WorkkerClass();
    obtenerUsuarioID.obtenerUsuarioID(req, resp);
});

// ==================================================================== //
// Obtener un usuario por ID Referencia
// ==================================================================== //
workerRouter.get('/obtenerUsuarioIDRef', [verificaToken], (req: Request, resp: Response) => {

    const obtenerUsuarioIDRef = new WorkkerClass();
    obtenerUsuarioIDRef.obtenerUsuarioIDRef(req, resp);
});

// ==================================================================== //
// Obtener un usuario por Teléfono
// ==================================================================== //
workerRouter.get('/obtenerUsuarioTel', [verificaToken], (req: Request, resp: Response) => {

    const obtenerUsuarioTel = new WorkkerClass();
    obtenerUsuarioTel.obtenerUsuarioTel(req, resp);
});

// ==================================================================== //
// Obtener un usuario por Role
// ==================================================================== //
workerRouter.get('/obtenerUsuariosRole', [verificaToken], (req: Request, resp: Response) => {

    const obtenerUsuariosRole = new WorkkerClass();
    obtenerUsuariosRole.obtenerUsuariosRole(req, resp);
});

// ==================================================================== //
// Obtener un usuario por Sucursal y Role
// ==================================================================== //
workerRouter.get('/cargarUsuariosSucursalRole', [verificaToken], (req: Request, resp: Response) => {

    const cargarUsuariosSucursalRole = new WorkkerClass();
    cargarUsuariosSucursalRole.cargarUsuariosSucursalRole(req, resp);
});

// ==================================================================== //
// Obtener un usuario por criterio nombre
// ==================================================================== //
workerRouter.get('/obtenerUsuarioCriterioNombre', [verificaToken], (req: Request, resp: Response) => {

    const obtenerUsuarioCriterioNombre = new WorkkerClass();
    obtenerUsuarioCriterioNombre.obtenerUsuarioCriterioNombre(req, resp);
});

// ==================================================================== //
// Obtener usuarios por sucursal
// ==================================================================== //
workerRouter.get('/obtenerUsuariosSucursal', [verificaToken], (req: Request, resp: Response) => {

    const obtenerUsuariosSucursal = new WorkkerClass();
    obtenerUsuariosSucursal.obtenerUsuariosSucursal(req, resp);
});

// ==================================================================== //
// Obtener usuario por sucursal
// ==================================================================== //
workerRouter.get('/obtenerUsuarioSucursal', [verificaToken], (req: Request, resp: Response) => {

    const obtenerUsuarioSucursal = new WorkkerClass();
    obtenerUsuarioSucursal.obtenerUsuarioSucursal(req, resp);
});

// ==================================================================== //
// Obtener todos los usuarios
// ==================================================================== //
workerRouter.get('/obtenerTodosUsuarios', [verificaToken], (req: Request, resp: Response) => {

    const obtenerTodosUsuarios = new WorkkerClass();
    obtenerTodosUsuarios.obtenerTodosUsuarios(req, resp);
});

// ==================================================================== //
// Eliminar un usuario
// ==================================================================== //
workerRouter.delete('/eliminarUsuario', [verificaToken, eliminarUsuario], (req: Request, resp: Response) => {

    const eliminarUsuario = new WorkkerClass();
    eliminarUsuario.eliminarUsuario(req, resp);
});

// ==================================================================== //
// Loguear usuario
// ==================================================================== //
workerRouter.post('/loguearUsuario', (req: Request, resp: Response) => {

    const loguearUsuario = new WorkkerClass();
    loguearUsuario.loguearUsuario(req, resp);
});

// ==================================================================== //
// Decodificar token
// ==================================================================== //
workerRouter.get('/decodificarToken', (req: Request, resp: Response) => {

    const decodificarToken = new WorkkerClass();
    decodificarToken.decodificarToken(req, resp);
});

// ==================================================================== //
// Refrescar token
// ==================================================================== //
workerRouter.post('/refrescarToken', (req: Request, resp: Response) => {

    const refrescarToken = new WorkkerClass();
    refrescarToken.refrescarToken(req, resp);
});


export default workerRouter;