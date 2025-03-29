const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}


/** REGISTRATION */
/**
 * Registration Data Validation Rules
 * @returns rulls for each of its Form input: account_firstname account_lastname account_email account_password
 */
 validate.registationRules = () => {
 return [
  // firstname is required and must be string
  body("account_firstname")
  .trim()
  .escape()
  .notEmpty()
  .isLength({ min: 1 })
  .withMessage("Please provide a first name."), // on error this message is sent.

  // lastname is required and must be string
  body("account_lastname")
  .trim()
  .escape()
  .notEmpty()
  .isLength({ min: 2 })
  .withMessage("Please provide a last name."),

  // valid email is required and cannot already exist in the DB
  body("account_email")
  .trim()
  .escape()
  .notEmpty()
  .isEmail()
  .normalizeEmail() // refer to validator.js docs
  .withMessage("A valid email is required."),

  // password is required and must be strong password
  body("account_password")
  .trim()
  .notEmpty()
  .isStrongPassword({
    minLength: 12,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  .withMessage("Password does not meet requirements."),

  ]
 }

 /**
 * Check data and return errors OR continue to registration
 * @returns NOTHING : this is to escape the function
 * @next IF the errors list is empty go next() 
 */
 validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)

    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
}





/** LOGIN */
 /**
  * Login Data Validation Rules
  * @returns rulls for each of its Form input:
  */
 validate.loginRules = () => {
   
  let rules = []

  rules[0] =     
   body("account_email")
  .trim()
  .escape()
  .notEmpty()
  .isEmail()
  .normalizeEmail() // refer to validator.js docs
  .withMessage("A valid email is required.")

  rules[1] = 
   body("account_password")
  .trim()
  .notEmpty()
  .isStrongPassword({
    minLength: 12,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  .withMessage("Password does not meet requirements.")

  return rules
 }
 
 
 /**
 * Check data and return errors OR continue logs you in
 * @returns NOTHING : this is to escape the function
 * @next IF the errors list is empty go next() 
 */
 validate.checkLoginData = async (req, res, next) => {

  const { account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
   
    /**
    * IF errs, do NOT go next()  
    */
    if (!errors.isEmpty()) {                              
    let nav = await utilities.getNav()
    res.render("./account/login", {
       errors,
       title: "Account Management",
       nav,
       account_lastname, 
       account_email
    // then 
    });return }

  next()
 }

/**/
  
/** UPDATE */

validate.updateRules = () => {

  let rules = []

  rules[0] = 
  body("account_id")
  .if((value, { req }) => req.body.hasOwnProperty('account_id'))   // https://express-validator.github.io/docs/api/validation-chain/#if
  .trim()
  .escape()
  .isInt()
  .notEmpty()
  .withMessage("There is a problem with the account ID")  

  rules[1] = 
  body("account_firstname")
  .trim()
  .escape()
  .notEmpty()
  .isLength({ min: 1 })
  .withMessage("Please provide a first name.") 

  rules[2] =
  body("account_lastname")
  .trim()
  .escape()
  .notEmpty()
  .isLength({ min: 2 })
  .withMessage("Please provide a last name.")

  rules[3] =     
  body("account_email")
 .trim()
 .escape()
 .notEmpty()
 .isEmail()
 .normalizeEmail() // refer to validator.js docs
 .withMessage("A valid email is required.")

  return rules
}

validate.cheackUpdateData = async (req, res, next) => {

  const { account_id, account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)

    /**
    * IF errs, do NOT go next()  
    */
    if (!errors.isEmpty()) {                              
      let nav = await utilities.getNav()
      res.render("./account/update", {
         errors,
         title: "Edit Account",
         nav,
         account_id,
         account_firstname,
         account_lastname, 
         account_email
      // then 
      });return }
      
  next()
}

module.exports = validate