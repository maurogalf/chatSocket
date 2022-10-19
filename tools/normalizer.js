import norm from "normalizr";

const schemaAuthor = new norm.schema.Entity("authors");
const schemaMensaje = new norm.schema.Entity("mensajes", {
  author: schemaAuthor,
});
const schemaChat = new norm.schema.Entity("chat", {
  mensajes: [schemaMensaje],
});

class Normalizer {
  normalizar(data) {
    const normalizado = norm.normalize(data, schemaChat);
    return normalizado;
  }

  denormalizar(data) {
    const denormalizado = norm.denormalize(
      data.result,
      schemaChat,
      data.entities
    );
    return denormalizado;
  }
}

export const normalizer = new Normalizer();
