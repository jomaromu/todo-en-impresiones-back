
// Funcion que evalúa si el que hace la consulta tiene privilegios para la misma
const evaluaRole = (tokeRole: string, DBRole: string): number => {


    /* 
        Comparar tokens
     */

    let nivel = 0;

    switch (tokeRole) {

        case 'SuperRole':
            nivel = 1;
            break;
        case 'AdminRole':
            nivel = 1;
            break;
        case 'ProduccionVIPRole':
            if (DBRole === 'SuperRole' || DBRole === 'AdminRole') {
                nivel = 0;
            } else {
                nivel = 1;
            }
            break;
        case 'ProduccionNormalRole':
            if (DBRole === 'SuperRole' || DBRole === 'AdminRole' || DBRole === 'ProduccionVIPRole') {
                nivel = 0;
            } else {
                nivel = 1;
            }
            break;
        case 'VendedorVIPRole':
            if (DBRole === 'SuperRole' || DBRole === 'AdminRole' || DBRole === 'ProduccionVIPRole' || DBRole === 'ProduccionNormalRole') {
                nivel = 0;
            } else {
                nivel = 1;
            }
            break;
        case 'VendedorNormalRole':
            if (DBRole === 'SuperRole' || DBRole === 'AdminRole' || DBRole === 'ProduccionVIPRole' || DBRole === 'ProduccionNormalRole' || DBRole === 'VendedorVIPRole') {
                nivel = 0;
            } else {
                nivel = 1;
            }
            break;
        default: nivel = 0;
    }

    return nivel;
}

export {
    evaluaRole
}

/*
    1: Permite todo
    0: No permite nada
*/