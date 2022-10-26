import { expect } from "chai";
import supertest from "supertest";
import { describe, it } from "mocha";

const request = supertest("http://localhost:8080");

var newProductId = "";
var qProduct = 0;
var token = "";

const testCredentials = {
  username: "test@test.com",
  password: "test",
};

const product = {
  name: "new product",
  description: "new product description",
  category: "Test category",
  thumbnail: "new product thumbnail",
  code: "NP",
  price: 200,
  stock: 15,
};

const productMod = {
  ...product,
  name: "Product modificates",
};

describe("Testing apiRESTful", () => {
  describe("Login should return a token", () => {
    it(`Should return a jwt token`, async () => {
      const result = await request.post("/api/login").send(testCredentials);
      token = result.body.token;
      expect(typeof token).to.equal("string");
      expect(token.length).to.greaterThan(170);
      expect(result.status).to.equal(200);
    });
  });
  describe("Testing create product", () => {
    it(`Should return "product saved successfully"`, async () => {
      const result = await request
        .post("/api/products")
        .set("authorization", `bearer ${token}`)
        .send(product);
      expect(result.text).to.equal("product saved successfully");
      expect(result.status).to.equal(200);
    });
  });
  describe("Testing get all products api", () => {
    it("Should return array of products", async () => {
      const { body } = await request
        .get("/api/products")
        .set("authorization", `bearer ${token}`);
      qProduct = body.length;
      expect(typeof body).to.equal("object");
    });
    it("Should not return an empty array", async () => {
      const result = await request
        .get("/api/products")
        .set("authorization", `bearer ${token}`);
      expect(result.body.length).to.not.equal(0);
    });
    it("Last product has to be test product", async () => {
      const { body } = await request
        .get("/api/products")
        .set("authorization", `bearer ${token}`);
      newProductId = await body[body.length - 1]._id;
      expect(body[body.length - 1].name, "new product");
    });
  });
  describe("Testing getProducts by id api", () => {
    it("Should return an object", async () => {
      const { body } = await request
        .get(`/api/products/${newProductId}`)
        .set("authorization", `bearer ${token}`);
      expect(typeof body).to.equal("object");
    });
    it(`The object name is "new product"`, async () => {
      const { body } = await request
        .get(`/api/products/${newProductId}`)
        .set("authorization", `bearer ${token}`);
      expect(body.name).to.equal("new product");
    });
    it("The object id is the test id", async () => {
      const { body } = await request
        .get(`/api/products/${newProductId}`)
        .set("authorization", `bearer ${token}`);
      expect(body._id).to.equal(newProductId);
    });
  });
  describe("Testing modify product by id", () => {
    it(`Should return an oject with _id equal to find id`, async () => {
      const { body } = await request
        .put(`/api/products/${newProductId}`)
        .send(productMod)
        .set("authorization", `bearer ${token}`);
      expect(body._id).to.equal(newProductId);
    });
    it(`The last product name is "Product modificates"`, async () => {
      const { body } = await request
        .get(`/api/products`)
        .set("authorization", `bearer ${token}`);
      expect(body[body.length - 1].name).to.equal("Product modificates");
    });
  });
  describe("Testing to delete test product", () => {
    it(`Should return "product deleted" message`, async () => {
      const { body } = await request
        .del(`/api/products/${newProductId}`)
        .set("authorization", `bearer ${token}`);
      expect(body._id).to.equal(newProductId);
    });
    it("The products quantity should be one less", async () => {
      const { body } = await request
        .get(`/api/products`)
        .set("authorization", `bearer ${token}`);
      expect(body.length).to.equal(qProduct - 1);
    });
  });
});
