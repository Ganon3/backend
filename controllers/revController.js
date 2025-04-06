const revModel = require("../models/reviews-model.js")
const utilities = require("../utilities/")


/// next
const revCont = {}

 /* THIS IS VIEW BUILD */
/**
 * THIS builds the review page
 */
 revCont.buildReviewView = async function(req, res) {
    const nav = await utilities.getNav()
    const comments = await utilities.buildCommentsUL()
    // req.flash("notice", "This is a flash message.")
    res.render("review/reviews.ejs", {
        title: "Reviews", 
        errors: null,
        nav,
        comments
    })   
}

/* THIS IS DATA WORK */

/**
 * THIS is to add a review 
 * @result IF quiry good say good ELSE say bad
 */
 revCont.addReview = async function (req, res) {

    let     nav = await utilities.getNav()
    let comments = await utilities.buildCommentsUL()

    const { account_id, comment_text, comment_rate } = req.body
    console.log(req.body)
    const result = await revModel.addReview( account_id, comment_text, comment_rate)
    console.log(result)

    if (result) {
      req.flash("notice", `Your opinion has been shaired`)
      res.render("./review/reviews.ejs", {
          title: "Reviews", 
          errors: null,
          nav,
          comments
      })   
    } else {
      req.flash("notice", `Something whent wrong`)
      res.render("./review/reviews.ejs", {
          title: "Reviews", 
          errors: null,
          nav,
          comments,
          comment_text
      })   
    }
}

module.exports = revCont