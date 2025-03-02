const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")



/// next
const invCont = {}

/**
 * Build inventory page by classification id view
 * @data This is the list of cars that are from the same class
 * @grid This is a dinamicly made HTML crafted in utilities file with data 
 */
 invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId                          // i dont know how 1 2 3 4 get there but i think its like peramiter 1 peramiter 2 ect
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/**
 * Build detaild page by Inentory view
 * @data This should be a single item in a list
 * @detailspage This is a dinamicly made HTML crafted in utilities file with data 
 */
 invCont.BuildDetailsFromInventroyById = async function (reg, res, next) {
  const vehicleId = reg.params.vehicleId
  const data = await invModel.getDetailsFromInventroyById(vehicleId)
  const detailsPage = await utilities.buildVehicleDetailPage(data[0]) // one row
  let nav = await utilities.getNav()
  const description = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model} `
  res.render("./details/details", {
    title: description,
    nav,
    detailsPage 
  })       
}


// mannagment --------
// mannagment ---\/---
/**
 * This is to build managment main view
 */
 invCont.buildManagementView = async function (reg, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Inventroy Management",
    nav,
    errors: null
  })
}

/**
 * This is to build the add classification FORM
 */
 invCont.buildAddClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav()
  req.flash("notice", "This is a flash message.")
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null
  })
}

/**
 * This is to build the add vehicle FORM
 * @select THIS is a select tag made in utilities
 */
 invCont.buildAddVehicleView = async function (req, res, next) {
  let nav = await utilities.getNav()
  let select = await utilities.getSelectLabel()
  res.render("./inventory/add-vehicle", {
    title: "Add Vehicle",
    nav,
    select,
    errors: null
  })
}







// big stuff
// big stuff

/**
 * Process New Vehicle:
 * @step_one Run The SQL to add the vehicle
 * @step_two an IF stament to render a view based on result
 * @result The result of step one
 */
invCont.addvehicle = async function (req, res) {
  console.log("log 2")
  console.log(req.body)

  //STEP_ONE: this actulay runs the sql to add a class
     const { 
      classification_id, inv_make, inv_model, 
      inv_description, inv_image, inv_thumbnail, 
      inv_price, inv_year, inv_miles, inv_color 
     } = req.body
     const result = await invModel.addvehicle( classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color  )

  //STEP_TWO: render good or bad
  let nav = await utilities.getNav()
  let select = await utilities.getSelectLabel()
  
    if (result) // good
      {
        req.flash("notice",`The Class ${inv_make} ${inv_model} Has Ben Added`)
        res.render("./inventory/add-vehicle", {
          title: "Add vehicle",
          nav,
          select,
          errors: null
        })
      } 
    else         // bad
      {
        req.flash("notice",`There was an issue in our atemped to add ${inv_make} ${inv_model} to vehicles`)
        res.render("./inventory/add-vehicle", {
          title: "Add vehicle",
          nav,
          select,
          errors: null
        })
      }
}


/**
 * Process New Class:
 * @step_one Run The SQL to add the class
 * @step_two an IF stament to render a view based on result
 * @result The result of step one
 */
 invCont.addclassification = async function (req, res) {

  //STEP_ONE: this actulay runs the sql to add a class
     const { classification_name } = req.body
     const result = await invModel.addclassification( classification_name )

  //STEP_TWO: render good or bad
    let nav = await utilities.getNav()
    if (result) // good
      {
        req.flash("notice",`The Class ${classification_name} Has Ben Made`)
        res.render("./inventory/add-classification", {
          title: "Add Classification",
          nav,
          errors: null
        })
      } 
    else         // bad
      {
        req.flash("notice",`There was an issue in our atemped to add ${classification_name} to classifications`)
        res.render("./inventory/add-classification", {
          title: "Add Classification",
          nav,
          errors: null
        })
      }
}


module.exports = invCont