"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.castFloats = exports.castMontos = void 0;
const castMontos = (valor) => {
    let precio, castValor = 0;
    if (typeof (valor) === 'string') {
        precio = parseFloat(valor).toFixed(2);
        castValor = parseInt(precio);
    }
    return castValor;
};
exports.castMontos = castMontos;
const castFloats = (valor) => {
    let castValor = 0, cast;
    return castValor = parseInt(parseFloat(valor).toFixed(2));
};
exports.castFloats = castFloats;
