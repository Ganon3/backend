const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data) // this data is a list
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build detaild page by Inentory view
 * ************************** */
invCont.BuildDetailsFromInventroyById = async function (reg, res, next) {
  const vehicleId = reg.params.vehicleId
  const data = await invModel.getDetailsFromInventroyById(vehicleId)
  const detailsPage = await utilities.buildVehicleDetailPage(data[0]) // one row
  let nav = await utilities.getNav()
  const description = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model} `
  res.render("./details/details", {
    title: description,
    nav,
    detailsPage, // needs an e
  })       
}


module.exports = invCont