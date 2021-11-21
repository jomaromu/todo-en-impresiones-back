import { Router, Request, Response } from 'express';
import { verificaToken } from '../auth/auth';
import { ProductoPedido } from '../class/productoPedidoClass';

const productoPedidoRouter = Router();

productoPedidoRouter.post('/crearProductoPedido', [verificaToken], (req: Request, resp: Response) => {

    const productoPedido = new ProductoPedido();
    productoPedido.crearProductoPedido(req, resp);
});

productoPedidoRouter.put('/editarProductoPedido', [verificaToken], (req: Request, resp: Response) => {

    const editarProductoPedido = new ProductoPedido();
    editarProductoPedido.editarProductoPedido(req, resp);
});

// productoPedidoRouter.put('/inhabilitarProductoPedido', [verificaToken], (req: Request, resp: Response) => {

//     const inhabilitarProductoPedido = new ProductoPedido();
//     inhabilitarProductoPedido.inhabilitarProductoPedido(req, resp);
// });

productoPedidoRouter.get('/obtenerProductoPedido', [verificaToken], (req: Request, resp: Response) => {

    const obtenerProductoPedido = new ProductoPedido();
    obtenerProductoPedido.obtenerProductoPedido(req, resp);
});

productoPedidoRouter.get('/obtenerPorPedido', [verificaToken], (req: Request, resp: Response) => {

    const obtenerPorPedido = new ProductoPedido();
    obtenerPorPedido.obtenerPorPedido(req, resp);
});

productoPedidoRouter.delete('/eliminarProductoPedido', [verificaToken], (req: Request, resp: Response) => {

    const eliminarProductoPedido = new ProductoPedido();
    eliminarProductoPedido.eliminarProductoPedido(req, resp);
});

export default productoPedidoRouter;