import { Router, Request, Response } from 'express';
import { crearUsuario, editarEtapa, eliminarEtapa, verificaToken } from '../auth/auth';
import { etapaPedidoClass } from '../class/etapaPedidoClass';

// instanciar el Router
const etapaRouter = Router();

// ==================================================================== //
// Crear una etapa de pedido
// ==================================================================== //
etapaRouter.post('/nuevaEtapaPedido', [verificaToken, crearUsuario], (req: Request, resp: Response) => {

    const nuevaEtapaPedido = new etapaPedidoClass();
    nuevaEtapaPedido.nuevaEtapaPedido(req, resp);
});

// ==================================================================== //
// Editar una etapa de pedido
// ==================================================================== //
etapaRouter.put('/editarEtapaPedido', [verificaToken, crearUsuario, editarEtapa], (req: Request, resp: Response) => {

    const editarEtapaPedido = new etapaPedidoClass();
    editarEtapaPedido.editarEtapaPedido(req, resp);
});

// ==================================================================== //
// Obtener una etapa de pedido
// ==================================================================== //
etapaRouter.get('/obtenerEtapaPedido', [verificaToken], (req: Request, resp: Response) => {

    const obtenerEtapaPedido = new etapaPedidoClass();
    obtenerEtapaPedido.obtenerEtapaPedido(req, resp);
});

// ==================================================================== //
// Obtener todas las etapas de pedido
// ==================================================================== //
etapaRouter.get('/obtenerTodasEtapaPedido', [verificaToken], (req: Request, resp: Response) => {

    const obtenerTodasEtapaPedido = new etapaPedidoClass();
    obtenerTodasEtapaPedido.obtenerTodasEtapaPedido(req, resp);
});

// ==================================================================== //
// Eliminar una etapa de pedido
// ==================================================================== //
etapaRouter.delete('/eliminarEtapaPedido', [verificaToken, eliminarEtapa], (req: Request, resp: Response) => {

    const eliminarEtapaPedido = new etapaPedidoClass();
    eliminarEtapaPedido.eliminarEtapaPedido(req, resp);
});

export default etapaRouter;