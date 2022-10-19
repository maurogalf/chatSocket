import daosContenedor from "../../data/modules/chat/daoFactory.js";
import { normalizer } from "../../tools/normalizer.js";

class Chat {
  async getMessages() {
    const allMessages = await daosContenedor.getMessages();
    return allMessages.length === 0
      ? {
          id: "mensajes",
          mensajes: [],
        }
      : await normalizer.denormalizar({
          entities: allMessages[0].entities,
          result: allMessages[0].result,
        });
  }

  async saveMessage(message) {
    const allMessages = await this.getMessages();
    allMessages.mensajes.push(message);
    const normAllMessages = normalizer.normalizar(allMessages);
    const response = await daosContenedor.saveMessage(normAllMessages);
    return response;
  }
}
export const chat = new Chat();
