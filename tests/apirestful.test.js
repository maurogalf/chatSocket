import assert from "assert";
import { expect } from "chai";
import supertest from "supertest";
import { describe, it } from "mocha";
import {
  deleteOneProduct,
  getOneProduct,
  getProducts,
  postOneProduct,
  updateProduct,
} from "../client.js";

const request = supertest("http://localhost:8080");

var newProductId = "";
var qProduct = 0;

const product = {
  name: "new product",
  description: "new product description",
  code: "NP",
  thumbnail: "new product thumbnail",
  price: 200,
  stock: 15,
};

const productMod = {
  ...product,
  name: "Product modificates",
};

describe("Testing apiRESTful", () => {
  describe("Testing create product", () => {
    it(`Should return "product saved successfully"`, async () => {
      const result = await request.post("/api/products").send(product);
      expect(result.text).to.equal("product saved successfully");
      expect(result.status).to.equal(200);
    });
  });
  describe("Testing get all products api", () => {
    it("Should return array of products", async () => {
      const { body } = await request.get("/api/products");
      qProduct = body.length;
      expect(typeof body).to.equal("object");
    });
    it("Should not return an empty array", async () => {
      const result = await request.get("/api/products");
      expect(result.body.length).to.not.equal(0);
    });
    it("Last product has to be test product", async () => {
      const { body } = await request.get("/api/products");
      newProductId = await body[body.length - 1]._id;
      expect(body[body.length - 1].name, "new product");
    });
  });
  describe("Testing getProducts by id api", () => {
    it("Should return an array of one product", async () => {
      const { body } = await request.get(`/api/products/${newProductId}`);
      expect(body.length).to.equal(1);
    });
    it(`The object name is "new product"`, async () => {
      const { body } = await request.get(`/api/products/${newProductId}`);
      expect(body[0].name).to.equal("new product");
    });
    it("The object id is the test id", async () => {
      const { body } = await request.get(`/api/products/${newProductId}`);
      expect(body[0]._id).to.equal(newProductId);
    });
  });
  describe("Testing modify product by id", () => {
    it(`Should return "product updated" message`, async () => {
      const { text } = await request
        .put(`/api/products/${newProductId}`)
        .send(productMod);
      expect(text).to.equal("product updated successfully");
    });
    it(`The last product name is "Product modificates"`, async () => {
      const { body } = await request.get(`/api/products`);
      expect(body[body.length - 1].name).to.equal("Product modificates");
    });
  });
  describe("Testing to delete test product", () => {
    it(`Should return "product deleted" message`, async () => {
      const { text } = await request.del(`/api/products/${newProductId}`);
      expect(text).to.equal("product deleted");
    });
    it("The products quantity should be one less", async () => {
      const { body } = await request.get(`/api/products`);
      expect(body.length).to.equal(qProduct - 1);
    });
  });
});
