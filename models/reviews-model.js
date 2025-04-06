const pool = require("../database/")



// GET SQL --------
// GET SQL ---\/---



// ADD SQL --------
// ADD SQL ---\/---

/**
 * THIS adds a review 
 * @returns a result for cheacking the quiry
 */
 async function 
 addReview ( account_id, comment_text, comment_rate ) {

  try {
  return await
  pool.query(

   `INSERT INTO public.comment (account_id, comment_text, comment_rate)
    VALUES ($1, $2, $3) RETURNING *`,

   [account_id, comment_text, comment_rate]

  )  
  } catch (error) 
  { console.error("model error: " + error) }
}





/* ----------- >>>>
   EXPORTS
*/ module.exports = { addReview }