import Router from "express";
import compression from "compression";

import passport from "../tools/passport/local-auth.js";
import yargs from "yargs";
import upload from "../tools/storage.js";

import { setNewProduct } from "../controllers/setNewProduct.js";
import { setNewOrder } from "../controllers/setNewOrder.js";
import { getHomePage } from "../controllers/getHomePage.js";
import { getRegisterPage } from "../controllers/getRegisterPage.js";
import { getLoginPage } from "../controllers/getLoginPage.js";
import { getFailLoginPage } from "../controllers/getFailLoginPage.js";
import { getFailRegisterPage } from "../controllers/getFailRegisterPage.js";
import { setNewUser } from "../controllers/setNewUser.js";
import { getProfilePage } from "../controllers/getProfilePage.js";
import { setNewProductToCartUser } from "../controllers/setNewProductToCartUser.js";
import { getCartUserPage } from "../controllers/getCartUserPage.js";
import { removeProduct } from "../controllers/removeProduct.js";
import { getFormPage } from "../controllers/getFormPage.js";

const router = Router();

// FUNCION DE CONTROL DE AUTENTICACION
const isAuthenticated = (req, res, next) =>
    req.isAuthenticated() ? next() : res.redirect("/login");
const isNotAuthenticated = (req, res, next) =>
    !req.isAuthenticated() ? next() : res.redirect("/");

// YARGS
const args = yargs(process.argv.slice(2))
    .default({ PORT: 8080, MODE: "FORK" })
    .alias({ p: "PORT" }).argv;

// RUTA PRINCIPAL
router.get("/", isAuthenticated, compression(), getHomePage);

router.get("/login", isNotAuthenticated, getLoginPage);

router.get("/faillogin", isNotAuthenticated, getFailLoginPage);

router.get("/register", isNotAuthenticated, getRegisterPage);

router.get("/failregister", isNotAuthenticated, getFailRegisterPage);

router.post(
    "/login",
    passport.authenticate("login", {
        successRedirect: "/",
        failureRedirect: "/faillogin",
    })
);

router.post(
    "/register",
    upload.single("avatar"),
    passport.authenticate("register", {
        failureRedirect: "/failregister",
    }),
    setNewUser
);

router.get("/logout", (req, res) => {
    req.logout(() => res.redirect("/login"));
});

router.get("/profile", isAuthenticated, compression(), getProfilePage);

router.get("/form", isAuthenticated, getFormPage);

router.post("/form/newproduct", setNewProduct);

router.post("/addproduct/:code", setNewProductToCartUser);

router.get("/cart", isAuthenticated, getCartUserPage);

router.post("/delete/:code", removeProduct);

router.post("/checkout", setNewOrder);

export default router;
