const { json } = require("express")
const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
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

/* **************************************
* Build the classification view HTML
* ************************************ */
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

Util.buildVehicleDetailPage = async function (data) {
  // return `<p> ${data.inv_id} ${data.inv_make} ${data.inv_model} 
  // ${data.inv_year} ${data.inv_description} ${data.inv_image} 
  // ${data.inv_price} ${data.inv_miles} ${data.inv_color}</p>`

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
            </section>
          
         `
}

// login
// login
Util.buildLoginPage = async function() {
  return `
  <section class="formSection id="section_login">
    <form>
    <fieldset>
        <legend>login</legend>
        <label> Email <input id="email" type="email" name="account_email" placeholder="someone@gmail.com" required> </label>
        <label> Password <input id="password" type="password" name="account_password" placeholder="password" required pattern="^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\\s).{12,}$"> </label>
        <label> <p>Passwords must be minimum of 12 characters and include 1 capital letter 1 number and 1 special charicter </p></label>
        <label> <button id="showHide" onclick="showHidePassword()"> Show Password </button></label>
        <label> <button type="submit">login</button></label>
    </fieldset>
     <p id="noAcount"> No account? <a href="/account/register"> Sign-up </a></p>
    </form>
        <script type="text/javascript">
        function showHidePassword() {

            const passInput = document.getElementById("password");
            const button = document.getElementById("showHide");
            event.preventDefault();

            if (passInput.getAttribute("type") == "password") {
                
                passInput.setAttribute("type","text");
                button.innerHTML = "Hide Password";

            } else {

                passInput.setAttribute("type","password");
                button.innerHTML = "Show Password";
            }
        }
    </script>
  </section>
  `
}



// register
// register
Util.buildRegisterPage = async function() {
  return `
<section class="formSection id="section_register">
    <form id="registerForm" action="/account/register" method="post">
    <p>ALL FIELDS ARE REQUIRED</p>
    <fieldset>
        <legend>Sign Up</legend>
        <label> First Name <input id="fname" type="text" name="account_firstname" required> </label>
        <label> Last Name <input id="lname" type="text" name="account_lastname" required> </label>
        <label> Email <input id="email" type="email" name="account_email" placeholder="someone@gmail.com" required> </label>
        <label> Password <input id="password" type="password" name="account_password" placeholder="password" required pattern="^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\\s).{12,}$"> </label>
        <label><p>Passwords must be minimum of 12 characters and include 1 capital letter 1 number and 1 special charicter </p></label>
        <label><button id="showHide" onclick="showHidePassword()"> Show Password </button></label>
        <label><button type="submit">Register</button></label>
    </fieldset>
    </form>

    <script type="text/javascript">
        function showHidePassword() {

            const passInput = document.getElementById("password");
            const button = document.getElementById("showHide");
            event.preventDefault();

            if (passInput.getAttribute("type") == "password") {
                
                passInput.setAttribute("type","text");
                button.innerHTML = "Hide Password";

            } else {

                passInput.setAttribute("type","password");
                button.innerHTML = "Show Password";
            }
        }
    </script>
</section>
  `
}
  

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util