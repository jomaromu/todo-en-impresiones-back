import { Request, Response, Router} from 'express';
import { verificaToken } from '../auth/auth';
import { GestorCarpetaClass } from '../class/gestorCarpetaClass';

const gestorRoute = Router();

gestorRoute.get('/checkSize', [verificaToken], (req: Request, resp: Response) => {

    const checkSize = new GestorCarpetaClass();
    checkSize.checkSize();
});



export default gestorRoute;