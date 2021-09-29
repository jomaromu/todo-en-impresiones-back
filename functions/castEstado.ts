const castEstado = (estado: string): boolean => {

    if (estado === 'false') {
        return false;
    } else if (estado === 'true') {
        return true;
    } else {
        return true;
    }
}

export {
    castEstado
}