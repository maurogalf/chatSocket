import daosContenedor from "../../data/modules/chat/daoFactory.js"

export const getMessages = async () => {
    return await daosContenedor.getMessages();
}

export const getCompresion = async () => {
    return await daosContenedor.compresion();
}