const { json } = require("express")
const invModel = require("../models/inventory-model")
const accModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}


/**
 * Constructs the nav HTML unordered list
 * @returns an HTML view for nav in partials navigation view <%- nav %>
 */
 Util.getNav = async function () {
  let data = await invModel.getClassifications()
  let list = "<ul id='theeNav'>"
  list += '<li class="theeLi"><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/**
 * Constructs the vehicle class select HTML string bassed on argumnet
 * @param {(number|null)} classNum - null or number - null by default
 * @return null: a select tag with all class options 
 * @return number: a select tag with one class option
 */
 Util.getSelectLabel = async function (classNum = null) {
  
  let data = await invModel.getClassifications()
  if (classNum == null) 
  {
    let options = '<option value=""> Choose a Classification </option>'
    data.rows.forEach((row) => { options += `<option value=" ${row.classification_id} "> ${row.classification_name} </option>` })
    const select = `<select id="classificationList" name="classification_id" required> ${options} </select>`
    return select
  } 
  else 
  {
    let options = ""
    data.rows.forEach((row) => { if (row.classification_id = classNum) {options = `<option value=" ${row.classification_id} "> ${row.classification_name} </option>`} })
    const select = `<select id="classificationList" name="classification_id" required> ${options} </select>`
    return select
  }
}

/**
 * Build the classification view HTML
 * @param data must be a list of Jasons
 * @returns an HTML timplet for classification view <%- grid %>
 */
 Util.buildClassificationGrid = async function (data) {
  let grid
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += '<li>'
      // grid += vehicle.inv_id + vehicle.inv_thumbnail
      grid += '<a href="../../inv/detail/' + vehicle.inv_id
        + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + 'details"><img src="' + vehicle.inv_thumbnail
        + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + ' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$'
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


/**
 * Builds Vehicle Detail Page
 * @param {json} data must be a json not a list of jsons
 * @returns a HTML templit used to build details view <%- detailsPage %>
 */
 Util.buildVehicleDetailPage = async function (data) {
  return `
    <section id="discription_section">
        <div id="discription_left">
            <img src="${data.inv_image}" alt=" A ${data.inv_color} ${data.inv_make} ${data.inv_model}">
        </div>
        <div id="discription_right">
            <h2> ${data.inv_make} ${data.inv_model} description</h2>
            <p> Price: ${data.inv_price} </p>
            <p> Description: ${data.inv_description} </p>
            <p> Color: ${data.inv_color}</p>
            <p> Miles: ${data.inv_miles}</p>
        </div>
    </section>`
}

/** 
 * THIS gets all comments or a count number of comments 
 * @param {number|null} count IF count is null get all ELSE get count
 * @returns an issue IF comments < count ELSE return HTML ul li list
 */
 Util.buildCommentsUL = async function (count = null) {
  let data = await accModel.getCommentsByRateing()
  let lis = "<h2>DMC Delorean <a id='reviewlink' href='/review'> Reviews </a></h2>"

  if (count === null) 
  {
    data.rows.forEach((commentData) => 
    {lis += `<li> "${commentData.comment_text}" (${commentData.comment_rate}/5) </li>`})
  }
  else
  {
    if ((data.rows).length < count){return `<ul class="CommentUL"> <li> there are not enuph commnets to0 make ${count} lis </li> </ul>`}
    for( let i=0 ; i<count ; i++ ) 
    {lis += `<li> "${data.rows[i].comment_text}" (${data.rows[i].comment_rate}/5) </li>`}
  }
  
  let ul = `<ul class="CommentUL"> ${lis} </ul>`
  return ul  
}




/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
}

/**
 * Check Login IF good go next
 * @returns ELSE give notes and redirect to login
 */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/**
 * Logs the indevidual out by clearing jwt cooki IF good ElSE redirect to login
 */
 Util.logout = (req, res, next) => {
  if (res.locals.loggedin) {

    res.clearCookie('jwt');
    req.flash("notice", "You are loged out")
    res.redirect("/")
  
  } else {

    req.flash("notice", "You are not loged in")
    res.redirect("/account/login")
  }
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util