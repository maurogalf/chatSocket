import Router from "express";
import os from "os";
import compression from "compression";

import daosContenedor from "../daos/index.js";
import passport from "../passport/local-auth.js";
import yargs from "yargs";
import logger from "../winston.js";
import { countryCodes } from "../data/countryCodes.js";
import upload from "../tools/storage.js";
import { registerMail, newOrderMail } from "../tools/nodemailer.js";
import { sendMessage, sendWhatsapp } from "../tools/twilio.js";
import contUserInfo from "../contenedores/ContenedorMongoUsersInfo.js";
import contenedorProduct from "../contenedores/ContenedorMongoProducts.js";
import contenedorOrders from "../contenedores/ContenedorMongoOrders.js";

const userInfo = new contUserInfo();
const product = new contenedorProduct();
const orders = new contenedorOrders();

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
router.get("/", isAuthenticated, (req, res) => {
    product.getProducts().then((response) => {
        const products = response;
        daosContenedor
            .getMessages()
            .then((data) => {
                if (data.mensajes.length > 0) {
                    daosContenedor.compresion().then((compresion) => {
                        res.render("home", {
                            products: products,
                            chat: data.mensajes,
                            compresion: compresion,
                            user: req.user.username,
                        });
                    });
                } else {
                    res.render("home", {
                        products: products,
                        chat: data.mensajes,
                        user: req.username,
                    });
                }
            })
            .catch((err) => {
                logger.error(err);
            });
    });
});

router.get("/login", isNotAuthenticated, (req, res) => {
    res.render("login");
});

router.post(
    "/login",
    passport.authenticate("login", {
        successRedirect: "/",
        failureRedirect: "/faillogin",
    }),
    (req, res) => {
        res.redirect("/");
    }
);

router.get("/faillogin", (req, res) => {
    res.render("login", { error: true });
});

router.get("/register", isNotAuthenticated, (req, res) => {
    res.render("register", {countryCodes: countryCodes } );
});

router.post(
    "/register",
    upload.single("avatar"),
    passport.authenticate("register", { failureRedirect: "/failregister" }),
    (req, res) => {
        const { username, name, address, age, phone, area } = req.body;
        const newUser = {
            username,
            name,
            address,
            age,
            phone: `${area}${phone}`,
            avatar: req.file.filename,
        };
        registerMail(newUser);
        userInfo.saveUser(newUser);
        res.redirect("/");
    }
);

router.get("/failregister", (req, res) => {
    res.render("register", { error: true });
});

router.get("/logout", (req, res) => {
    req.logout(() => res.redirect("/login"));
});

router.get("/profile", isAuthenticated, (req, res) => {
    userInfo.getUserInfo(req.user.username).then((response) => {
        res.render("profile", { user: response });
    });
});

router.get("/form", isAuthenticated, (req, res) => {
    res.render("form");
});

router.post("/form/newproduct", (req, res) => {
    const { name, description, code, thumbnail, price, stock } = req.body;
    const newProduct = {
        name,
        description,
        code,
        thumbnail,
        price,
        stock,
        timestamp: new Date(),
    };
    product.saveProduct(newProduct);
    res.redirect("/");
});

router.post("/addproduct/:code", (req, res) => {
    userInfo.addToCart(req.user.username, req.params.code);
    res.redirect("/");
});

router.get("/cart", isAuthenticated, (req, res) => {
    userInfo.getCart(req.user.username).then((cart) => {
        product.getProducts().then((allProducts) => {
            let userCart = [];
            cart.map((cartProd) => {
                const prod = allProducts.find((p) => p.code === cartProd.code);
                userCart.push({ ...prod, cant: cartProd.cant });
            });
            const finish = userCart.length > 0;
            res.render("cartdetail", {
                userCart: userCart,
                user: req.user.username,
                showFinish: finish,
            });
        });
    });
});

router.post("/delete/:code", (req, res) => {
    userInfo.removeFromCart(req.user.username, req.params.code);
    res.redirect("/cart");
});

router.post("/checkout", (req, res) => {
    userInfo.getUserInfo(req.user.username).then((user) => {
        const order = {
            order_id: Date.now() + "-" + Math.round(Math.random() * 1e9),
            username: user.username,
            name: user.name,
            cart: user.cart,
        };
        orders.checkOut(order);
        newOrderMail(order);
        sendWhatsapp(order);
        sendMessage(order, user.phone);
        userInfo.cleanCart(req.user.username);
        res.redirect("/cart");
    });
});

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
