import Router from "express";
import compression from "compression";

import passport from "../tools/passport/local-auth.js";
import yargs from "yargs";
import upload from "../tools/storage.js";

import { frontendController } from "../controllers/frontend/frontend.controller.js";
import { userController } from "../controllers/frontend/users.controller.js";
import { cartsController } from "../controllers/frontend/carts.controller.js";
import { productsController } from "../controllers/frontend/products.controller.js";

const frontRouter = Router();

// FUNCION DE CONTROL DE AUTENTICACION
const isAuthenticated = (req, res, next) =>
  req.isAuthenticated() ? next() : res.redirect("/login");
const isNotAuthenticated = (req, res, next) =>
  !req.isAuthenticated() ? next() : res.redirect("/productos");

// YARGS
const args = yargs(process.argv.slice(2))
  .default({ PORT: 8080, MODE: "FORK" })
  .alias({ p: "PORT" }).argv;

// RUTA PRINCIPAL
frontRouter.get("/", isAuthenticated, isNotAuthenticated);

frontRouter.get(
  "/productos",
  isAuthenticated,
  compression(),
  frontendController.getHomePage
);

frontRouter.get(
  "/productos/category/:category",
  isAuthenticated,
  compression(),
  frontendController.getHomePage
);

frontRouter.get("/login", isNotAuthenticated, frontendController.getLoginPage);

frontRouter.get(
  "/faillogin",
  isNotAuthenticated,
  frontendController.getFailLoginPage
);

frontRouter.get(
  "/register",
  isNotAuthenticated,
  frontendController.getRegisterPage
);

frontRouter.get(
  "/failregister",
  isNotAuthenticated,
  frontendController.getFailRegisterPage
);

frontRouter.post(
  "/login",
  passport.authenticate("login", {
    successRedirect: "/productos",
    failureRedirect: "/faillogin",
  })
);

frontRouter.post(
  "/register",
  upload.single("avatar"),
  passport.authenticate("register", {
    failureRedirect: "/failregister",
  }),
  userController.setNewUser
);

frontRouter.get("/logout", (req, res) => {
  req.logout(() => res.redirect("/login"));
});

frontRouter.get(
  "/profile",
  isAuthenticated,
  compression(),
  userController.getProfilePage
);

frontRouter.get("/form", isAuthenticated, frontendController.getFormPage);

frontRouter.get(
  "/productos/:id",
  isAuthenticated,
  productsController.getProductPage
);

frontRouter.post(
  "/form/newproduct",
  upload.single("thumbnail"),
  productsController.setNewProduct
);

// CART ROUTES

frontRouter.get("/cart", isAuthenticated, cartsController.getCartUserPage);

frontRouter.post("/productos/:code", cartsController.saveProductInCart);

frontRouter.post("/cart/delete/:code", cartsController.removeProductFromCart);

// ORDER ROUTES

frontRouter.post("/checkout", frontendController.sendOrder);

frontRouter.get("/orders", frontendController.showOrders);

frontRouter.get("/orders/:id", frontendController.showOneOrder);

export default frontRouter;
