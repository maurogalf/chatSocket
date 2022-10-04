import koa from "koa";
import koaBody from "koa-body";
import productsRoute from "./routes/products-routes.js";
import "dotenv/config";
import json from "koa-json";
import { graphqlHTTP } from "koa-graphql";
import mount from "koa-mount";
import { schema } from "../graphql/graphql.js";
import { resolvers } from "../graphql/resolvers.js";

const PORT = process.env.PORT || parseInt(process.argv[2]) || 8080;

const app = new koa();

app.use(koaBody({ multipart: true }));
app.use(json());

app.use(productsRoute.routes());
app.use(
  mount(
    "/graphql",
    graphqlHTTP({
      schema,
      rootValue: {
        getProducts: resolvers.getProducts,
        getProductById: resolvers.getProductById,
        addProduct: resolvers.saveProduct,
        deleteProduct: resolvers.deleteProduct,
        updateProduct: resolvers.updateProduct,
      },
      graphiql: true,
    })
  )
);

app.listen(PORT, () => {
  console.log(
    `Server Koa listening on port ${PORT}\nhttp://localhost:${PORT}/products\nhttp://localhost:${PORT}/graphql`
  );
});
