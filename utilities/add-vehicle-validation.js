const utilities = require(".")
const { body, validationResult } = require("express-validator")

/// NEXT
const validate = {}

/**
 * Classification Data Validation Rules
 * @returns the rules for the Form inputs: 
 * classification_id inv_make inv_model 
 * inv_description inv_image inv_thumbnail
 * inv_price inv_year inv_miles inv_color, inv_id
 */
 validate.vehicleRules = () => {
    
    const rules = []
  
    rules[0] = 
    body("classification_id")
    .trim()
    .escape()
    .notEmpty()                            
    .withMessage("Please select a class")     // on error this message is sent.

    rules[1] = 
    body("inv_make")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Please put a valid make")

    rules[2] = 
    body("inv_model")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Please put a valid model")

    rules[3] = 
    body("inv_description")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Please add a description")

    rules[4] = 
    body("inv_image")
    .trim()
    .notEmpty()
    .withMessage("Please add an image path")

    rules[5] = 
    body("inv_thumbnail")
    .trim()
    .notEmpty()
    .withMessage("Please add a thumbnail path")

    rules[6] = 
    body("inv_price")
    .trim()
    .escape()
    .notEmpty()
    .isFloat({ gt: 0 })           // https://express-validator.github.io/docs/api/validation-chain/  there is to much 
    .withMessage("Please add a price")

    rules[7] = 
    body("inv_year")
    .trim()
    .escape()
    .notEmpty()
    .matches(/[0-9]{4,4}/)
    .withMessage("Please add the vehicel year")

    rules[8] = 
    body("inv_miles")
    .trim()
    .escape()
    .notEmpty()
    .matches(/[0-9]{1,}/)
    .withMessage("Please add the vehicel miles")

    rules[9] = 
    body("inv_color")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Please add the vehicel color")

    rules[10] = 
    body("inv_id")
    .if((value, { req }) => req.body.hasOwnProperty('inv_id'))   // https://express-validator.github.io/docs/api/validation-chain/#if
    .trim()
    .escape()
    .isInt()
    .notEmpty()
    .withMessage("There is a problem with the vehicle ID")     

    return rules
}

/**
 * Check data and renders errors OR continue to adding the vehicle
 * @returns NOTHING : this is to escape the function
 * @next IF the errors list is empty go next() 
 */
 validate.checkVehicleData = async (req, res, next) => {
    console.log("log 1")
    const { 
        classification_id, inv_make, inv_model, 
        inv_description, inv_image, inv_thumbnail, 
        inv_price, inv_year, inv_miles, inv_color 
     } = req.body
     let errors = []
     errors = validationResult(req)
     console.log(req.body)

        /**
         * IF errs, do NOT go next()  
         */
         if (!errors.isEmpty()) {                                // i just relized this says: if the errors list is not empty stop everything and render the page with the errors
         let nav = await utilities.getNav()
         let select = await utilities.getSelectLabel()
         res.render("./inventory/add-vehicle", {
            errors,
            title: "Add Vehicle",
            nav,
            select,
            classification_id, inv_make, inv_model, 
            inv_description, inv_image, inv_thumbnail, 
            inv_price, inv_year, inv_miles, inv_color 
         // then 
        }); return }

    next()
}

/**
 * Check data and renders errors OR continue to editing the vehicle
 * @returns NOTHING : this is to escape the function
 * @next IF the errors list is empty go next() 
 */
 validate.editVehicleData = async (req, res, next) => {
   console.log("log 1")
   const { 
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id, 
    } = req.body
    let errors = []
    errors = validationResult(req)
    console.log(req.body)

      /**
       * IF errs, do NOT go next()  ${inv_id}
       */
       if (!errors.isEmpty()) {                                // i just relized this says: if the errors list is not empty stop everything and render the page with the errors
       let nav = await utilities.getNav()
       let classSelect = await utilities.getSelectLabel()
       res.render(`inventory/edit-vehicle`, {
          errors,
          title: "Add Vehicle",
          nav,
          classSelect,
          inv_id,
          inv_make,
          inv_model,
          inv_description,
          inv_image,
          inv_thumbnail,
          inv_price,
          inv_year,
          inv_miles,
          inv_color,
          classification_id,
       // then 
      }); return }

   next()
}

module.exports = validate