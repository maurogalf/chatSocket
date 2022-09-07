import { countryCodes } from "../data/countryCodes.js";

const getFailRegisterPage = (req,res) => {
    res.render("register", {countryCodes: countryCodes, error: true});
}

export default getFailRegisterPage;