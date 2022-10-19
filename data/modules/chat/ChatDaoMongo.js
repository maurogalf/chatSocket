import mongoose from "mongoose";
const { Schema } = mongoose;
import logger from "../../../tools/winston.js";

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
      return await collection.find().lean();
    } catch (err) {
      throw new Error("Error: Error al leer la colección mensajes");
    }
  }

  // GUARDAR MENSAJE
  async saveMessage(object) {
    //RECIBE UN MENSAJE Y NO DEVUELVE NADA
    const allMessages = await this.getMessages();
    try {
      if (allMessages.length === 0) {
        return await collection.create(object);
      } else {
        return await collection.replaceOne({ result: "mensajes" }, object);
      }
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
}

export default ChatDaoMongo;
