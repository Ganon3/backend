const utilities = require(".")
const { body, validationResult } = require("express-validator")


/// NEXT
const validate = {}

/**
 * Classification Data Validation Rules
 * @returns a rule for the Form input: classification_name
 */ 
validate.classificationRules = () => { 
    
    const rule = []
  
    rule[0] = 
    body("classification_name")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .matches(/[A-Za-z]{1,}/)                               //https://stackoverflow.com/questions/58475407/how-to-check-if-input-in-input-field-has-alphabets-only-in-express-validator
    .withMessage("Please provide a valid classifier.")     // on error this message is sent.
  
    return rule
}

/**
 * Check data and renders errors OR continue to adding classification
 * @returns NOTHING : this is to escape the function
 * @next IF the errors list is empty go next() 
 */
 validate.checkclassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)

        /**
         * IF errs, do NOT go next()  
         */
         if (!errors.isEmpty()) {                                // i just relized this says: if the errors list is not empty stop everything and render the page with the errors
         let nav = await utilities.getNav()
         res.render("./inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name,
         // then 
        }); return }

    next()
}



module.exports = validate
