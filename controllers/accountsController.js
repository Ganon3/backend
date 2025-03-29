const accountModel = require("../models/account-model")
const utilities = require("../utilities/")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
require("dotenv").config()


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
 * Dilivers the account managment view
 */
 async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

/**
 * Dilivers account update view
 */
async function buildAccountEdit(req, res, next) {
  const account_id        = res.locals.accountData.account_id
  const account_firstname = res.locals.accountData.account_firstname
  const account_lastname  = res.locals.accountData.account_lastname
  const account_email     = res.locals.accountData.account_email
    let nav = await utilities.getNav()
  
  res.render("account/update", {
    title: "Edit Account",
    nav,
    errors: null,
    account_id,
    account_firstname,
    account_lastname,
    account_email
  })
}


/** LOGIN PROCESS */
/**
 * Process LOGIN: 
 * @step_one REQ the login data
 * @step_two If the login data is not good give status 400 and reutrn
 * @step_three TRY IF the login data matches then login ELSE retry login
 */
 async function accountLogin(req, res) {
  
  // step one
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  let nav = await utilities.getNav()
    
  // step two
    if (!accountData) { 
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
     // then    
    }); return 
  }

  // step three
  try {

    if (await bcrypt.compare(account_password, accountData.account_password)) 
     {
       delete accountData.account_password
       const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
       if (process.env.NODE_ENV === 'development') 
        {
          res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })               // one for us 
        } else {
          res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 }) // one for user
        }
       return res.redirect("/account/")
     }
     else 
     {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }

  } catch (error) {
    throw new Error('Access Forbidden')
  }
}


/** REGISTRATION PROCESS */
/**
 * Process Registration:
 * @step_one Run The SQL to add account
 * @step_two an IF stament to render a view based on regResult
 * @regResult The result of step one
 */
 async function registerAccount(req, res) {
  
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

 //STEP_ONE: this actulay runs the sql to make a person
   const regResult = await accountModel.registerAccount(
     account_firstname,
     account_lastname,
     account_email,
     hashedPassword
  )

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


async function accountUpdate (req, res) {
  let nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email } = req.body
 
  const regResult = await accountModel.accountUpdate(
    account_id,
    account_firstname,
    account_lastname,
    account_email,
 )

  if (regResult) { // req is good
    req.flash(
      "notice",
      `Update was succesfull`
    )
    res.status(201).render("account/update", {
      title: "Login",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email
    })

  } else { // reg is bad
    req.flash("notice", "The Update has faild")
    res.status(501).render("account/update", {
      title: "Registration",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    })
  }


} 


module.exports = { buildLogin, buildRegister, buildAccountManagement, registerAccount, accountLogin, buildAccountEdit, accountUpdate }