import Router from 'express'
import os from "os";

import daosContenedor from "../daos/index.js";
import passport from '../passport/local-auth.js'
import products from "../data/FakerProducts.js";
import yargs from 'yargs';


const router = Router()


// FUNCION DE CONTROL DE AUTENTICACION
const isAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.redirect("/login")
const isNotAuthenticated = (req, res, next) => !req.isAuthenticated() ? next() : res.redirect("/")

// YARGS
const args = yargs(process.argv.slice(2))
    .default({ PORT: 8080, MODE: "FORK" })
    .alias({ p: "PORT" }).argv;


// RUTA PRINCIPAL
router.get("/", isAuthenticated, (req, res) => {
    daosContenedor.getMessages().then((data) => {
        if (data.mensajes.length > 0) {
            daosContenedor.compresion().then((compresion) => {
                res.render("products", { data: products, chat: data.mensajes, compresion: compresion, user: req.user.username })
            })
        } else {
            res.render("products", { data: products, chat: data.mensajes, user: req.username });
        }
    }).catch((err) => {
        console.log(err)
    })
});


router.get("/login", isNotAuthenticated, (req, res) => {
    req.session.user && res.redirect("/")
    res.render("login")
})

router.post("/login", passport.authenticate('login', { successRedirect: '/', failureRedirect: '/faillogin' }), (req, res) => {
    res.redirect("/")
})

router.get("/faillogin", (req, res) => {
    res.render("login", { error: true })
});


router.get("/register", isNotAuthenticated, (req, res) => {
    res.render("register")
})

router.post("/register", passport.authenticate('register', { successRedirect: '/', failureRedirect: '/failregister' }), (req, res) => {
    res.redirect("/")
})

router.get("/failregister", (req, res) => {
    res.render("register", { error: true })
});


router.get("/logout", (req, res) => {
    req.logout(() => res.redirect("/login"));
})


router.get("/info", (req, res) => {
    const info = {
        argumentos: JSON.stringify(args._),
        platform: process.platform,
        nodeVersion: process.version,
        processId: process.pid,
        dir: process.cwd(),
        memory: process.memoryUsage().rss,
        path: process.execPath,
        processQ: os.cpus().length
    }
    res.render("info", { info: info })
})

export default router;