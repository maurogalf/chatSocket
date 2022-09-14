import { countryCodes } from "../tools/datafiles/countryCodes.js";

export const getRegisterPage = (req,res) => {
    res.render("register", {countryCodes: countryCodes} );
}

