// To Make A New Router                                         Inventroy Rout File !!!
const express = require("express") 
const router = new express.Router() 


const   invController = require("../controllers/invController")
const       utilities = require("../utilities/")
const   classValidate = require('../utilities/add-class-validation')
const vehicelValidate = require('../utilities/add-vehicle-validation')


// Routes to build inventory
// posts to make inventory                                                    hover over functions for info
router.get("/type/:classificationId",               utilities.handleErrors(invController.buildByClassificationId))
router.get("/detail/:vehicleId",                    utilities.handleErrors(invController.BuildDetailsFromInventroyById))
router.get("/",               utilities.checkLogin, utilities.handleErrors(invController.buildManagementView))
router.get("/add-classification",                   utilities.handleErrors(invController.buildAddClassificationView))
router.get("/add-vehicle",                          utilities.handleErrors(invController.buildAddVehicleView))
router.get("/getInventory/:classification_id",      utilities.handleErrors(invController.getInventoryJSON))
router.get("/edit/:inv_id",                         utilities.handleErrors(invController.buildEditView))
router.get("/delete/:inv_id",                       utilities.handleErrors(invController.buildDeletView))

router.post(
    "/add-classification",
    classValidate.classificationRules(),
    classValidate.checkclassData,
    invController.addclassification // this is next()
)
router.post(
    "/add-vehicle",
    vehicelValidate.vehicleRules(),
    vehicelValidate.checkVehicleData,
    invController.addvehicle
)
router.post(
    "/update/",
    vehicelValidate.vehicleRules(),
    vehicelValidate.editVehicleData, 
    invController.updateInventory
)
router.post(
    "/delete/",
    invController.deletevehicle
)

module.exports = router