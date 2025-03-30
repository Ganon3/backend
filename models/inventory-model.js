const pool = require("../database/")

// GET SQL --------
// GET SQL ---\/---

/**
 * Get all classification data
 * @returns a thing that needs to be .rows to become a list []
 */
 async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/**
 * Get all inventory items and classification_name by classification_id
 * @returns a list [] of vehicles JSON of the same class
 */
 async function 
 getInventoryByClassificationId
             (classification_id) { 
  try { 
  const data = 
  await pool.query (

   `SELECT * FROM public.inventory AS i 
    JOIN public.classification AS c 
    ON i.classification_id = c.classification_id 
    WHERE i.classification_id = $1`,

    [classification_id]

  )
  return data.rows 
  } catch (error) 
  { console.error("getclassificationsbyid error " + error) }
}

/**
 * Get all inventory items and classification_name by classification_id
 * @returns one list [] with one item in it
 */
async function 
getDetailsFromInventroyById
                 (vehicleId) {
  try {
  const data = 
  await pool.query (

   `SELECT * FROM public.inventory
    WHERE inv_id = $1`, 
    
    [vehicleId]
  
  )
  return data.rows
  } catch (error) 
  { console.error("getDetailsFromInventroyById " + error) }
}


// ADD SQL --------
// ADD SQL ---\/---

/**
 * ADD the classification info in the peramiter to class data
 * @returns an error if something when rong OR something good if things whent well
 */
 async function 
 addclassification (classification) {

  try {
  return await 
  pool.query (

   `INSERT INTO public.classification 
    (classification_name) VALUES ($1)
    RETURNING *`,

    [classification]

  )
  } catch (error) 
  { return error.message}
}

/**
 * ADD the vehicle info in the peramiter to the vehicle data
 * @returns an error if something when rong OR something good if things whent well
 */
 async function addvehicle ( 
  classification_id, inv_make, 
  inv_model, inv_description, 
  inv_image, inv_thumbnail,
  inv_price, inv_year, inv_miles, 
  inv_color
  )   { 
  try {
  return await 
  pool.query (

  ` INSERT INTO public.inventory
    (classification_id, inv_make, 
    inv_model, inv_description, 
    inv_image, inv_thumbnail,
    inv_price, inv_year, inv_miles, 
    inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *`,

    [ classification_id, inv_make, 
      inv_model, inv_description, 
      inv_image, inv_thumbnail,
      inv_price, inv_year, inv_miles, 
      inv_color ]

  )
  } catch (error) 
  { return error.message}
}

/**
 * Update Inventory Data
 * @returns data.rows[0]
 */
 async function 
 updateInventory (
  inv_id, inv_make, inv_model,
  inv_description, inv_image,
  inv_thumbnail, inv_price,
  inv_year, inv_miles, inv_color,
  classification_id
  )   {
  try {

    const sql = "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      
      inv_make, inv_model,
      inv_description, inv_image,
      inv_thumbnail, inv_price,
      inv_year, inv_miles, inv_color,
      classification_id, inv_id
    ])

    return data.rows[0]
  } catch (error) 
  { console.error("model error: " + error) }
}


/**
 * DELETS inventory with the inputed inv_id
 * @returns a confirmation
 */
 async function 
 deleteVehicle (inv_id) {

  try {
  return await
  pool.query(
    
    'DELETE FROM inventory WHERE inv_id = $1',

    [inv_id]
    
  )
  } catch (error) 
  { new Error("Delete Inventory Error") }
}

module.exports = {getClassifications, getInventoryByClassificationId, getDetailsFromInventroyById, addclassification, addvehicle, updateInventory, deleteVehicle}