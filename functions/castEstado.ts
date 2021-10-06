const castEstado = (estado: string): boolean => {

    if (estado === 'false') {
        return false;
    } else if (estado === 'true') {
        return true;
    } else {
        return true;
    }
}


const castITBMS = (ibtms: string): boolean => {

    if (ibtms === 'false') {
        return false;
    } else if (ibtms === 'true') {
        return true;
    } else {
        return false;
    }
}

export {
    castEstado,
    castITBMS
}