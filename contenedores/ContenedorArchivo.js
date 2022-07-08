import { promises as fs} from "fs";
import Normalizer from "../tools/normalizer.js"

let norm = new Normalizer();

class ContenedorArchivo {
    constructor(){
        this.ruta = "./data/chat.json"
    }

    // OBTENER MENSAJES
    async getMessages() {
        try {
            let data = await fs.readFile(this.ruta, "utf8");
            let response = norm.denormalizar(JSON.parse(data))
            return response
        }catch (err){
            console.log("Error: no existen registros, devuelve objeto de creación")
            return {
                "id": "mensajes",
                "mensajes": []
            };
        }
    }

    // GUARDAR MENSAJE
    async saveMessage(object) {
        try {
            let chat = await this.getMessages()
            chat.mensajes.push(object)
            await this.saveFile(chat)
            return null
        }catch(err){
            console.log(err)
        }
    }

    async clearMessages() {
        try {
            let emptyChat = {
                "id": "mensajes",
                "mensajes": []
            }
            await this.saveFile(emptyChat)
            console.log("Chat was cleared")
            return null
        } catch (err) {
            console.log(err)
        }
    }

    async saveFile(docs) {
        let docsNorm = norm.normalizar(docs)
        fs.writeFile(this.ruta, JSON.stringify(docsNorm), "utf8"), (err) => {
            if (err) {
                console.log(err)
            }else {
                console.log("Successfully saved")
                return docs;
            }
        }
    }

    async compresion(){
        try {
            let chat = await this.getMessages()
            let chatNorm = norm.normalizar(chat)
            let sinNorm = JSON.stringify(chat).length
            let conNorm = JSON.stringify(chatNorm).length
            let compresion = Math.floor(conNorm / sinNorm * 100)
            return compresion
        } catch(err) {
            console.log(err)
        }
    }
}

export default ContenedorArchivo;