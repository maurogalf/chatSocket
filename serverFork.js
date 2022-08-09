import runServer from './app.js';

process.on('message', port => {
    runServer(port); 
    process.send("msg");
})