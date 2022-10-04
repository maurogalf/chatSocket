import "dotenv/config";

import cluster from "cluster";
import os from "os";
import runServer from "./app.js";
import logger from "./tools/winston.js";

// PUERTO
const port = process.env.PORT || parseInt(process.argv[2]) || 8080;

const modoCluster = process.argv[3] || process.env.MODO_CLUSTER === "true";

if (modoCluster && cluster.isPrimary) {
  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker) => {
    logger.info(`Worker process with pid ${worker.process.pid} exited.`);
    cluster.fork();
  });
} else {
  runServer(port);
}
