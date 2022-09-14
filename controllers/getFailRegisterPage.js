import { countryCodes } from "../tools/datafiles/countryCodes.js";

export const getFailRegisterPage = (req,res) => {
    res.render("register", {countryCodes: countryCodes, error: true});
}
