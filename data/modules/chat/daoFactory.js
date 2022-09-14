let daosContenedor;

switch (process.env.DAO_TYPE_CHAT) {
    case "ARCHIVO":
        const { default : ChatDaoArchivo } = await import ("./ChatDaoArchivo.js")
        daosContenedor = new ChatDaoArchivo()
        break
    case "FIREBASE":
        const { default : ChatDaoFirebase } = await import ("./ChatDaoFirebase.js")
        daosContenedor = new ChatDaoFirebase()
        break
    case "MONGODB":
        const { default : ChatDaoMongo } = await import ("./ChatDaoMongo.js")
        daosContenedor = new ChatDaoMongo()
        break
}

export default daosContenedor;