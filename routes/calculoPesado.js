let object = {};
process.on('message', (msg) => {
    const cant = msg
    for (let i = 0; i < cant; i++) {
        let num = Math.floor(Math.random() * 1000)
        if (object[num] === undefined) {
            object[num] = 1;
        } else {
            object[num]++;
        }
    }
    process.send(object);
})
