/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
//


/* ***********************
 * Require Statements
 *************************/

 const express = require("express")                     // express is the tool that cunects everything like train system I THINK
 const session = require("express-session")             // this makes a new seesion for exspress
 
 const expressLayouts = require("express-ejs-layouts")  // this sets up the train tracks so to speek for the session
 const env = require("dotenv").config()                 // this is local host info for the session
 const bodyParser = require("body-parser")              // this alows req.body to be turned into a usable JSON i think for this session
 const cookieParser = require("cookie-parser")          // this alows the session to read cockies

 const app = express()                                  // app is the name of this session
 
 // these are all routs/traintracks that the exspress train grabs (loding info up on it as it moves through)
 const           pool = require('./database/')
 const         static = require("./routes/static")
 const baseController = require("./controllers/baseController")
 const inventoryRoute = require("./routes/inventoryRoute")
 const   accountRoute = require("./routes/accountRoute")
 const      utilities = require("./utilities/")

/**/


/* ***********************
 * Middleware
 * ************************/

 app.use(session({
   store: new (require('connect-pg-simple')(session))({
     createTableIfMissing: true,
     pool,
   }),
   secret: process.env.SESSION_SECRET,
   resave: true,
   saveUninitialized: true,
   name: 'sessionId',
 }))
 
 // Express Messages Middleware
 app.use(require('connect-flash')())
 app.use(function(req, res, next){
   res.locals.messages = require('express-messages')(req, res)
   next()
 })
 
 app.use(bodyParser.json()) 
 app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
 app.use(cookieParser())

/**/

/* ***********************
 * View Engine and Templates
 *************************/
 app.set("view engine", "ejs")
 app.use(expressLayouts)
 app.set("layout", "./layouts/layout") // not at views root

/**/ 

/* ***********************
 * Routes
 *************************/
 app.use(static);
 app.get("/", utilities.handleErrors(baseController.buildHome))
 app.use("/inv", inventoryRoute) // Inventory routes
 app.use("/account", accountRoute)
 app.use("/error", async (req, res) => {res.status(500).send('500 error: something bad')})
 
 app.use(async (req, res, next) => {  // File Not Found Route - must be last route in list
   next({status: 404, message: 'Sorry, we appear to have lost that page.'})
 })

/**/

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
//  app.use(async (err, req, res, next) => {
   
//    console.error(`Error at: "${req.originalUrl}": ${err.message}`)
//    if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}

//    let nav = await utilities.getNav()
//    res.render("errors/error", {
//      title: err.status || 'Server Error',
//      message,
//      nav
//    })
//  })

/**/




/* ***********************
 * Local Server Information
 * Values from .env (environment) file                                  local host stuff
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

