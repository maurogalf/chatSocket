import Router from "express";
import os from "os";
import compression from "compression";

import passport from "../tools/passport/local-auth.js";
import yargs from "yargs";
import upload from "../tools/storage.js";
import contUserInfo from "../data/contenedores/ContenedorMongoUsersInfo.js";
import getHomePage from "../controllers/getHomePage.js";
import getRegisterPage from "../controllers/getRegisterPage.js";
import getLoginPage from "../controllers/getLoginPage.js";
import getFailLoginPage from "../controllers/getFailLoginPage.js";
import getFailRegisterPage from "../controllers/getFailRegisterPage.js";
import { setNewUser } from "../services/users/setNewUser.js";
import { getProfilePage } from "../controllers/getProfilePage.js";
import { setNewProduct } from "../services/products/setNewProduct.js";
import { setNewProductToCartUser } from "../services/users/setNewProductToCartUser.js";
import { getCartUserPage } from "../controllers/getCartUserPage.js";
import { setNewOrder } from "../services/orders/setNewOrder.js";

const userInfo = new contUserInfo();

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

router.get("/failregister", getFailRegisterPage);

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
    passport.authenticate("register", { failureRedirect: "/failregister" }),
    setNewUser
);

router.get("/logout", (req, res) => {
    req.logout(() => res.redirect("/login"));
});

router.get("/profile", isAuthenticated, compression(), getProfilePage);

router.get("/form", isAuthenticated, (req, res) => {
    res.render("form");
});

router.post("/form/newproduct", setNewProduct);

router.post("/addproduct/:code", setNewProductToCartUser);

router.get("/cart", isAuthenticated, getCartUserPage);

router.post("/delete/:code", (req, res) => {
    userInfo.removeFromCart(req.user.username, req.params.code);
    res.redirect("/cart");
});

router.post("/checkout", setNewOrder);

// ESTAS RUTAS LAS DEJO ASI PORQUE LAS VOY A SACAR

router.get("/info", (req, res) => {
    const info = {
        argumentos: JSON.stringify(args._),
        platform: process.platform,
        nodeVersion: process.version,
        processId: process.pid,
        dir: process.cwd(),
        memory: process.memoryUsage().rss,
        path: process.execPath,
        processQ: os.cpus().length,
    };
    res.render("info", { info: info });
});

router.get("/info-con-consola", (req, res) => {
    const info = {
        argumentos: JSON.stringify(args._),
        platform: process.platform,
        nodeVersion: process.version,
        processId: process.pid,
        dir: process.cwd(),
        memory: process.memoryUsage().rss,
        path: process.execPath,
        processQ: os.cpus().length,
    };
    res.render("info", { info: info });
});

router.get("/infozip", compression(), (req, res) => {
    const info = {
        argumentos: JSON.stringify(args._),
        platform: process.platform,
        nodeVersion: process.version,
        processId: process.pid,
        dir: process.cwd(),
        memory: process.memoryUsage().rss,
        path: process.execPath,
        processQ: os.cpus().length,
    };
    res.render("info", { info: info });
});

export default router;
