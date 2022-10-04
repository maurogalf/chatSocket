import { buildSchema } from "graphql";
import { graphqlHTTP } from "express-graphql";
import fs from "fs";
import { resolvers } from "./resolvers.js";

const schemaProducts = fs
  .readFileSync("./graphql/schemas/product.graphql")
  .toString();
export const schema = buildSchema(schemaProducts);

const graphMiddleware = graphqlHTTP({
  schema,
  rootValue: {
    getProducts: resolvers.getProducts,
    getProductById: resolvers.getProductById,
    addProduct: resolvers.saveProduct,
    deleteProduct: resolvers.deleteProduct,
    updateProduct: resolvers.updateProduct,
  },
  graphiql: true,
});

export default graphMiddleware;
