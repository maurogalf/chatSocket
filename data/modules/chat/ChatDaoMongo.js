import mongoose from "mongoose";
const { Schema } = mongoose;
import Normalizer from "../tools/normalizer.js";
import logger from "../tools/winston.js";

const norm = new Normalizer();

const conn = mongoose.createConnection(process.env.MONGODB_ATLAS_CLUSTER);
mongoose.connection.on("error", (err) => {
    logger.error(err);
});
mongoose.connection.on("open", () => {
    logger.info("MongoDB Atlas connected");
});

const mensajesSchema = new Schema({
    entities: Object,
    result: String,
});

const collection = conn.model("mensaje", mensajesSchema);

class ChatDaoMongo {
    async getMessages() {
        // NO RECIBE NADA Y DEVUELVE EL OBJETO MENSAJES
        try {
            const data = await collection.find().lean();
            const response = {
                entities: data[0].entities,
                result: data[0].result,
            };
            return norm.denormalizar(response);
        } catch (err) {
            logger.error(
                "Error: no existen registros, devuelve objeto de creación"
            );
            return {
                id: "mensajes",
                mensajes: [],
            };
        }
    }

    // GUARDAR MENSAJE
    async saveMessage(object) {
        //RECIBE UN MENSAJE Y NO DEVUELVE NADA
        try {
            let chat = await this.getMessages();
            chat.mensajes.push(object);
            await this.saveFile(chat);
            return null;
        } catch (err) {
            logger.error(err);
        }
    }

    async clearMessages() {
        // LIMPIA EL OBJETO MENSAJES
        try {
            await collection.deleteMany({});
        } catch (err) {
            logger.error(err);
        }
    }

    async saveFile(docs) {
        try {
            let docsNorm = norm.normalizar(docs);
            if (docs.mensajes.length == 1) {
                await collection.create(docsNorm);
            } else {
                await collection.replaceOne({ result: "mensajes" }, docsNorm);
            }
            logger.info("Successfully saved");
            return docs;
        } catch (err) {
            logger.error(err);
        }
    }

    async compresion() {
        try {
            let chat = await this.getMessages();
            let chatNorm = norm.normalizar(chat);
            let sinNorm = JSON.stringify(chat).length;
            let conNorm = JSON.stringify(chatNorm).length;
            let compresion = Math.floor((conNorm / sinNorm) * 100);
            return compresion;
        } catch (err) {
            logger.error(err);
        }
    }
}

export default ChatDaoMongo;
