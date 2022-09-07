import admin from "firebase-admin";
import Normalizer from "../../tools/normalizer.js";
import logger from "../../tools/winston.js";

let norm = new Normalizer();

const serviceAccount = {
    type: "service_account",
    project_id: "chat-61393",
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: "firebase-adminsdk-e747g@chat-61393.iam.gserviceaccount.com",
    client_id: "106138111559890678586",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
        "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-e747g%40chat-61393.iam.gserviceaccount.com",
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.firestore();
const collection = db.collection("chatSocket");
const mensajes = collection.doc("chatSocket");

class ContenedorFirebase {
    // OBTENER MENSAJES
    async getMessages() {
        // NO RECIBE NADA Y DEVUELVE EL OBJETO MENSAJES
        try {
            const data = await collection.get();
            const response = data.docs[0].data();
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

    async saveFile(docs) {
        let docsNorm = norm.normalizar(docs);
        await mensajes.update(docsNorm);
        logger.info("Successfully saved");
        return docs;
    }

    async clearMessages() {
        // LIMPIA EL OBJETO MENSAJES
        try {
            await mensajes.delete();
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

export default ContenedorFirebase;
