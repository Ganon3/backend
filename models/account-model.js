const pool = require("../database/")

/**
 * Register new account:
 * @returns Something good if query whent well or an ERR if not
 */
 async function registerAccount (
  account_firstname, 
  account_lastname, 
  account_email, 
  account_password
  )   {
  try {
    
    const sql = 
   `INSERT INTO account (account_firstname, 
    account_lastname, account_email, 
    account_password, account_type) 
    VALUES ($1, $2, $3, $4, 'Client') 
    RETURNING *`

    const DATA = 
    [ account_firstname, account_lastname, 
    account_email, account_password ]
    
    return await pool.query(sql, DATA)

  } catch (error) 
  { return error.message }
}

/**
 * Edit old Account:
 * @returns Something good if query whent well or an ERR if not
 */
async function accountUpdate (
  account_id,
  account_firstname, 
  account_lastname, 
  account_email, 
  )   {
  try {
    
    const sql = 
  ` UPDATE public.account SET 
    account_firstname = $1,
    account_lastname = $2,
    account_email = $3
    WHERE account_id = $4
    RETURNING *
    `

    const DATA = 
    [ account_firstname, account_lastname, account_email, account_id ]
    
    return await pool.query(sql, DATA)

  } catch (error) 
  { console.error("Error in accountUpdate:", error); return error.message }
}


/**
 * @returns account data using email address
 */
 async function 
 getAccountByEmail (account_email) {

  try {
  const result = 
  await pool.query(

     `SELECT account_id, account_firstname, 
      account_lastname, account_email, 
      account_type, account_password 
      FROM account WHERE account_email = $1` ,

      [account_email]
    
    )
    return result.rows[0]
  } catch (error) 
  { return new Error("No matching email found") }
}

module.exports = { registerAccount , getAccountByEmail, accountUpdate}