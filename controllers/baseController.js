const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  const commnets = await utilities.buildCommentsUL(5)
  // req.flash("notice", "This is a flash message.") testing to see later
  res.render("index", {
    title: "Home", 
    nav,
    commnets
  })
}

module.exports = baseController