import { faker } from '@faker-js/faker';

faker.setLocale("es")

const crearProducto = () => {
    return{
        title: faker.commerce.product(),
        price: faker.commerce.price(500, 1000, 0, "$"),
        thumbnail: faker.image.image(640,640,true)
    }
}
const products = [];

for(let i = 0; i < 5; i++){
    products.push(crearProducto());
}


export default products;