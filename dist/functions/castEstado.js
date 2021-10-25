"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.castITBMS = exports.castEstado = void 0;
const castEstado = (estado) => {
    if (estado === 'false') {
        return false;
    }
    else if (estado === 'true') {
        return true;
    }
    else {
        return true;
    }
};
exports.castEstado = castEstado;
const castITBMS = (ibtms) => {
    if (ibtms === 'false') {
        return false;
    }
    else if (ibtms === 'true') {
        return true;
    }
    else {
        return false;
    }
};
exports.castITBMS = castITBMS;
