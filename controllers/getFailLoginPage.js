export const getFailLoginPage = (req, res ) => {
    res.render("login", {error:true});
}
