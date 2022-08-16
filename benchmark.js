import autocannon from "autocannon";
import { PassThrough } from "stream";

const ejecutar = (url) => {
    const buf = [];
    const outputStream = new PassThrough();

    const inst = autocannon({
        url,
        connection: 100,
        duration: 20
    })

    autocannon.track(inst, {outputStream});

    outputStream.on("data", (data)=> {
        buf.push(data);
    });
    
    inst.on("done", ()=> {
        process.stdout.write(Buffer.concat(buf))
    });

}

ejecutar("http://localhost:8080/info")
ejecutar("http://localhost:8080/info-con-consola")