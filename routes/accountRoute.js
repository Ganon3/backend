// To Make A New Router                                          Account Rout File !!!  
const express = require("express")
const router = new express.Router() 


const accountController = require("../controllers/accountsController")
const utilities         = require("../utilities/")
const regValidate       = require('../utilities/account-validation')


// Routes to build acount view
// posts to make or loginto an acount                         hover over function to read 
router.get("/login",                          utilities.handleErrors(accountController.buildLogin))
router.get("/register",                       utilities.handleErrors(accountController.buildRegister))
router.get("/",         utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))
router.get("/update",   utilities.checkLogin, utilities.handleErrors(accountController.buildAccountEdit))

router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,                             // i relise that this is saying check and register the data... i think
    accountController.registerAccount
)
router.post( 
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)
router.post(
    "/update",
    regValidate.updateRules(),
    regValidate.cheackUpdateData,
)


module.exports = router