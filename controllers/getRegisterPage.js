import { countryCodes } from "../data/countryCodes.js";

const getRegisterPage = (req,res) => {
    res.render("register", {countryCodes: countryCodes} );
}

export default getRegisterPage;