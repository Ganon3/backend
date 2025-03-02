const accountModel = require("../models/account-model")
const utilities = require("../utilities/")

/**
 * Delivers the login view
 */
 async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}
/**
 * Delivers the register view
 */
 async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}


/**
 * Process Registration:
 * @step_one Run The SQL to add account
 * @step_two an IF stament to render a view based on regResult
 * @regResult The result of step one
 */
async function registerAccount(req, res) {
  
 //STEP_ONE: this actulay runs the sql to make a person
   const { account_firstname, account_lastname, account_email, account_password } = req.body
   const regResult = await accountModel.registerAccount(
     account_firstname,
     account_lastname,
     account_email,
     account_password
  )

  let nav = await utilities.getNav()

 //STEP_TWO: render good or bad
  if (regResult) { // req is good
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })

  } else { // reg is bad
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

  
module.exports = { buildLogin, buildRegister, registerAccount }