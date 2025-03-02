// To Make A New Router                                          Account Rout File !!!  
const express = require("express")
const router = new express.Router() 


const accountController = require("../controllers/accountsController")
const utilities         = require("../utilities/")
const regValidate       = require('../utilities/account-validation')


// Routes to build acount view
// posts to make acount                           hover over function to read 
router.get("/login",          utilities.handleErrors(accountController.buildLogin))
router.get("/register",       utilities.handleErrors(accountController.buildRegister))

router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,                             // i relise that this is saying check and register the data... i think
    accountController.registerAccount
)


module.exports = router