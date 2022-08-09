import "dotenv/config";

import cluster from "cluster";
import os from "os";
import { fork } from "child_process";
import runServer from "./app.js";


// PUERTO
const port = parseInt(process.argv[2]) || 8080 ;

const mode = process.argv[3] || "DEFAULT";

if (mode === "FORK") {
    const forked = fork("./serverFork.js")
    forked.send(port)
    forked.on("message", (port) => {
        console.log("Server fork is running.");
    })


} else if (mode === "CLUSTER") {
    if (cluster.isPrimary) {
        for (let i = 0; i < os.cpus().length; i++) {
            cluster.fork();
        }
        cluster.on("exit", worker => {
            console.log(`Worker process with pid ${worker.process.pid} exited.`)
        })
    } else {
        runServer(port)
    }
    console.log("Server cluster is running.")

} else if (mode === "DEFAULT" ){
    runServer(port)
}
