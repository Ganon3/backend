const { json } = require("express")
const invModel = require("../models/inventory-model")
const Util = {}


/**
 * Constructs the nav HTML unordered list
 * @returns an HTML view for nav in partials navigation view <%- nav %>
 */
 Util.getNav = async function (req, res, next) {
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
 * Constructs the select HTML for add-vehicle.ejs file THEN:
 * @returns that select tag for add-vehicles view <%- select %>
 */
 Util.getSelectLabel = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let options = '<option value=""> Choose a Classification </option>'
  data.rows.forEach((row) => { options += `<option value=" ${row.classification_id} "> ${row.classification_name} </option>`})
  const select = `<select name="classification_id" required> ${options} </select>` 
  return select
}

/**
 * Build the classification view HTML
 * @param data must be a list of Jasons
 * @returns an HTML timplet for classification view <%- grid %>
 */
 Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      // grid += vehicle.inv_id + vehicle.inv_thumbnail
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
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



/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util