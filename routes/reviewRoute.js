// To Make A New Router                                         Review Rout File !!!
const express = require("express") 
const router = new express.Router() 


const   revController = require("../controllers/revController")
const       utilities = require("../utilities")
const     revValidate = require('../utilities/review-validation')


// Routes to build review page
// posts to add a review  
router.get('/',    utilities.handleErrors(revController.buildReviewView))

router.post(
    '/reviews.ejs',
    revValidate.reviewRules(),
    revValidate.checkReviewData,
    utilities.handleErrors(revController.addReview)
)

module.exports = router