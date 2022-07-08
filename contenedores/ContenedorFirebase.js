
import admin from "firebase-admin";
import Normalizer from "../tools/normalizer.js"


let norm = new Normalizer();

const serviceAccount = {
    "type": "service_account",
    "project_id": "chat-61393",
    "private_key_id": "d5b1e4b57e96ec2f83a23ab1844b5df769a3323f",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDGhViq+RIGvoKA\nlVU/KOkN+qb1iZoL0WU2FbpiiFicJa6RAzJjrk/0tgFjo2XUgbTlspaIX1xeryLF\nk8/xeki04NOTFvaEbBVWX3wQFtLIqCdCzcPtuUPy5kx6WH5+yq3NbZMB0aEsollD\nG2xD8846rwa3ZIpFHOFjHTlKyGAWxcGQJnHLLaA1RbfXvmw/NUp/VKiARAD6N+BP\nGCS7ZTOCxiNSrcnfII65wxnkLvStddTcJwHfVHzxPufVaN4IMckVIZsLkqUGpP2l\nFRgehN7RlS12A/ROdH6BAP+f3QKTG6pI7s46r5UYn30CaxfpIyOvpEX6oRjcaJXL\nfZhCWxOdAgMBAAECggEAGxnZnq+VYyfPU4PvaQmp9S9WaxcvmTTrCvzg3rIr3Jc1\nU1UbJCoH/sl4+5PzIxVY73GXpMLV7pQcnFnfLaFKuyylHYOpQC8sI4gx/NVMzblM\n8Mz71iBwUwDXCG27yQ3ct7phcwJd7SS1qFheSZGHQhIiSdd3G9PDPh9fcqLToU/8\nwpcZamRquDW6/k1Z4stbjUX0T8h4Ys2pnyYGDI+R7UIqKaBqhP/1tDpy/zLtrf9k\nAEnDtRh9l5IVNfrFnjuvl3yrTuOuc3Q6noyTikjxEZ9lyoENCTDEPXgShfD2buUh\n6c6Zn86R3RA3cb95GSgSq0YdrdQZz9ZXFD/ewznpCQKBgQDu8XTjocpguJlvyUrX\nrPvZcpmaSjwQYex+FTcFLxhCTbKVhLIQ/SQi3ohjkr5YXot+wFIUmbymR0hVPAVo\ndt7+yLLwRZ5yV9dI6ex6caQjHqa6gYP72TcewlDag5giTWbZK1IEuFygh0eOZ9Pf\n1a29DQTm2D+2Zy1n9ykmJwT3ZQKBgQDUsTJGKZ8TfWAc70KCcocW4lMvaRdhFtKz\nQiqDB0lCMGq4hhT0kPeARieOVVVfr1z2inWM2s0MLVETt4bEDEDu4FRKg9PtHnL/\nkcyOSPsMN1ettYS2TaEx7XLC9S7eWE2pozlT5vBPzlaqaUNSIAeJSnZtPD09zjVZ\n8wFYC0dz2QKBgCYi66EZRY/CZtrsqcFanqfKHrH9fzCuMGy/PhTZu2l5tTMgBrun\na4kVM3eRCEhabrFASNl44B856VWRStutfVH0/npS4kMlufqtO00fri7cyYei/EnK\nFX4XTYhS0IlJCU1IGMMgGciVTtpvv+VN2Xj/BvVBNooKVbjuPecU+znxAoGBAIq6\n5ZrkLRFuVtGosg4aG8kuaKnk903psBcikk4S45Lbt9CSDHsVT4qIt+Zb/KrD3HQn\nDdOJJ/PIXzjoHWwkvfnRsslDwWjJ0qKme/FW4wEt2++/FUg/zGOfiJpniGGY4VdD\n0vHKEXdMlDTlIfcgUyoWurY3c46rwRrhqT+/Y6TJAoGAYMPW4eCxa+wg3V6ZsFqc\n1yZoTXTQ5oomfqydJ/S5yWVf1bCGbrVM7iVFdM78vKhTQG6+WTfcI0T7TYU87w1u\nh0BMclGTybeZ577Tn5/nqoxn9MZ08kGcyGCaqR28FZGKGQhbPk2O0n04GR3fgcQV\n4S4Hz5+D1ZNmIcx+4l7IXyE=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-e747g@chat-61393.iam.gserviceaccount.com",
    "client_id": "106138111559890678586",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-e747g%40chat-61393.iam.gserviceaccount.com"
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://chat-61393.firebaseio.com"
});

console.log("Firebase Initialized")

const db = admin.firestore();
const collection = db.collection("chatSocket")
const mensajes = collection.doc("chatSocket")

class ContenedorFirebase {

    // OBTENER MENSAJES
    async getMessages() { // NO RECIBE NADA Y DEVUELVE EL OBJETO MENSAJES
        try {
            const data = await collection.get()
            const response = data.docs[0].data()
            return norm.denormalizar(response)
        } catch (err) {
            console.log("Error: no existen registros, devuelve objeto de creación")
            return {
                "id": "mensajes",
                "mensajes": []
            };
        }
    }

    // GUARDAR MENSAJE
    async saveMessage(object) { //RECIBE UN MENSAJE Y NO DEVUELVE NADA
        try {
            let chat = await this.getMessages()
            chat.mensajes.push(object)
            await this.saveFile(chat)
            return null
        } catch (err) {
            console.log(err)
        }
    }

    async saveFile(docs) {
        let docsNorm = norm.normalizar(docs)
        await mensajes.update(docsNorm)
        console.log("Successfully saved")
        return docs;
    }

    async clearMessages() { // LIMPIA EL OBJETO MENSAJES
        try {
            await mensajes.delete()
        } catch (err) {
            console.log(err)
        }
    }

    async compresion() {
        try {
            let chat = await this.getMessages()
            let chatNorm = norm.normalizar(chat)
            let sinNorm = JSON.stringify(chat).length
            let conNorm = JSON.stringify(chatNorm).length
            let compresion = Math.floor(conNorm / sinNorm * 100)
            return compresion
        } catch (err) {
            console.log(err)
        }
    }
}

export default ContenedorFirebase;

