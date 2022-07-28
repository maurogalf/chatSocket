import Router from 'express'
import { fork } from 'child_process'

const router = Router()

router.get("/random", (req, res) => {
    let cant = req.query.cant || 10000000
    const forked = fork("./routes/calculoPesado.js")
    forked.send(cant);
    forked.on('message', (random) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(random);
    })
})

export default router;