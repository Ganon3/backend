const utilities = require(".")
const { body, validationResult } = require("express-validator")


/// NEXT
const validate = {}

/**
 * THIS makes rules for making a review: account_id comment_text comment_rate
 * @returns 
 */
 validate.reviewRules = () => {

    const rules = []
  
    rules[0] = 
    body("account_id")
    .trim()
    .escape()
    .notEmpty() 
    .isNumeric()                           
    .withMessage("The account has an issue")     

    rules[1] = 
    body("comment_text")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("You must leave a comment first")

    rules[2] = 
    body("comment_rate")
    .trim()
    .escape()
    .notEmpty()
    .isNumeric()
    .withMessage("There was a problem with the rate input")

    return rules
}

/**
 * THIS cheacks the data for errors
 * @returns IF errors then dont go next return from function
 */
 validate.checkReviewData = async (req, res, next) => {
    
    const { account_id, comment_text, comment_rate } = req.body

    let errors = []
    errors = validationResult(req)

        if (!errors.isEmpty()) {
        let nav      = await utilities.getNav()
        let comments = await utilities.buildCommentsUL()
        res.render("./review/reviews", {
            title: "Reviews",
            nav,
            errors,
            comments,
            account_id, 
            comment_text, 
            comment_rate
          //then  
        }); return
        }
    next()
}


module.exports = validate