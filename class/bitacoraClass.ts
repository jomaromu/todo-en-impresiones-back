import { Response } from "express";
import moment from "moment";
moment.locale('es');

// Modelos
import bitacoraModel from "../models/bitacoraModel";

export class BitacoraClass {

    constructor() { }

    async crearBitacora(req: any, accion: string, pedidoDB: any): Promise<boolean> {

        const idCreador: any = req.usuario._id;
        const fecha: string = moment().format('lll');
        const pedido: any = req.get('pedido');

        const nuevaBitacora = new bitacoraModel({
            idCreador: idCreador,
            pedido: pedidoDB._id,
            fecha_creacion: fecha,
            accion: accion
        });

        const respBitacora = await nuevaBitacora.save();

        if (!respBitacora) {
            return false;
        } else {
            return true;
        }
    }
}