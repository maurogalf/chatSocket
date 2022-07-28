let daosContenedor;

switch (process.env.MESSAGE_SOURCE) {
    case "archivo":
        const { default : ContenedorArchivo } = await import ("../contenedores/ContenedorArchivo.js")
        daosContenedor = new ContenedorArchivo()
        break
    case "firebase":
        const { default : ContenedorFirebase } = await import ("../contenedores/ContenedorFirebase.js")
        daosContenedor = new ContenedorFirebase()
        break
    case "mongodb":
        const { default : ContenedorMongo } = await import ("../contenedores/ContenedorMongo.js")
        daosContenedor = new ContenedorMongo()
        break
}

export default daosContenedor