import Router from 'express'
import { fork } from 'child_process'


const routerRandoms = Router()

routerRandoms.get("/random", (req, res) => {
    let cant = req.query.cant || 10000000
    const forked = fork("./routes/calculoPesado.js")
    forked.send(cant);
    forked.on('message', (random) => {
        res.setHeader('Content-Type', 'application/json');
        res.send({"port": parseInt(process.argv[2]), random});
    })
})

export default routerRandoms;