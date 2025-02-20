const accountModel = require("../models/account-model")
const utilities = require("../utilities/")


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    let loginbox = await utilities.buildLoginPage()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
      loginbox
    })
}

/* ****************************************
*  Deliver Register view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  let registerbox = await utilities.buildRegisterPage()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    registerbox
  })
}


/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    let loginbox = await utilities.buildLoginPage()
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      loginbox
    })
  } else {
    let registerbox = await utilities.buildRegisterPage()
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      registerbox
    })
  }
}

  
module.exports = { buildLogin, buildRegister, registerAccount }