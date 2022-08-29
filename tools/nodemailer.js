import nodemailer from "nodemailer";

const adminEmail = process.env.NODEMAILER_ADMIN_EMAIL;
const adminPassword = process.env.NODEMAILER_ADMIN_PW;

export const registerMail = async (user) => {

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: adminEmail,
            pass: adminPassword
        }
    });
    
    let info = await transporter.sendMail({
        from: `${user.name} <${user.username}>`,
        to: adminEmail,
        subject: "New register",
    text: `New register:
    Username: ${user.username}
    Name: ${user.name}
    Address: ${user.address}
    Age: ${user.age}
    Phone: ${user.phone}
    Avatar: ${user.avatar}
    `, 
    html: `<h2>New Register</h2>
    <h4>Username: ${user.username}</h4>
    <h4>Name: ${user.name}</h4>
    <h4>Address: ${user.address}</h4>
    <h4>Age: ${user.age}</h4>
    <h4>Phone: ${user.phone}</h4>
    <h4>Avatar: ${user.avatar}</h4>
    `,
});
console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

export const newOrderMail = async (order) => {

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: adminEmail,
            pass: adminPassword
        }
    });
    
    let info = await transporter.sendMail({
        from: '"Admin" <rod.hilll31@ethereal.email>',
        to: adminEmail,
        subject: "New order by " + order.name,
    text: `New order info:
    Username: ${order.username}
    Name: ${order.name}
    Id: ${order.order_id}
    Cart Detail : ${order.cart.map(prod => (`Product: ${prod.code} - Cant: ${prod.cant}
    `))}`,
    html: `<h2>New order info:</h2>
    <h4>Username: ${order.username}</h4>
    <h4>Name: ${order.name}</h4>
    <h4>Id: ${order.order_id}</h4>
    <h4>Cart Detail :</h4>
    ${order.cart.map(prod => (`<p>Product: ${prod.code} - Cant: ${prod.cant}</p>
    `))}`, 
});
console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

