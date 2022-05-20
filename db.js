const knex = require('knex')({
    client: 'mysql',
    connection: {
        host : '127.0.0.1',
        port : 3306,
        user : 'root',
        password : '',
        database : 'products_db'
    },
    pool : {
        min : 0,
        max : 7
    }
});

knex.schema.createTableIfNotExists('products', (table) => {
    table.increments('id').primary();
    table.string('title');
    table.string('price');
    table.string('thumbnail');
}).then(() => {
    console.log('Tabla creada');
}).catch((err) => {
    console.log(err);
});

knex.schema.createTableIfNotExists('chat', (table) => {
    table.increments('id').primary();
    table.string('user');
    table.string('date');
    table.string('message');
}).then(() => {
    console.log('Tabla creada');
}).catch((err) => {
    console.log(err);
});



module.exports = knex
