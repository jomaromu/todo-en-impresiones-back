import { Router, Request, Response } from 'express';
import { RoleColClass } from '../class/workerRoleClass';
import { crearUsuario, editarRole, eliminarRole, verificaToken } from '../auth/auth';

// Instanciar el router
const roleColRouter = Router();

// Nuevo role
roleColRouter.post('/nuevoRole', [verificaToken, crearUsuario], (req: Request, resp: Response) => {

    const nuevoRole = new RoleColClass();
    nuevoRole.nuevoRole(req, resp);

});

// Editar role
roleColRouter.put('/editarRole', [verificaToken, editarRole], (req: Request, resp: Response) => {

    const editarRole = new RoleColClass();
    editarRole.editarRole(req, resp);

});

// Obtener role por ID
roleColRouter.get('/obtenerRoleID', [verificaToken], (req: Request, resp: Response) => {

    const obtenerRoleID = new RoleColClass();
    obtenerRoleID.obtenerRoleID(req, resp);

});

// Obtener todos los roles
roleColRouter.get('/obtenerTodos', [verificaToken], (req: Request, resp: Response) => {

    const obtenerTodos = new RoleColClass();
    obtenerTodos.obtenerTodos(req, resp);

});

// Eliminar role
roleColRouter.delete('/eliminarRole', [verificaToken, eliminarRole], (req: Request, resp: Response) => {

    const eliminarRole = new RoleColClass();
    eliminarRole.eliminarRole(req, resp);

});

export default roleColRouter;