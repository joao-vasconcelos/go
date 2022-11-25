import database from '../../../services/database';
import Model from '../../../models/Customer';
import Schema from '../../../schemas/Customer';

/* * */
/* CREATE STOP */
/* Explanation needed. */
/* * */

export default async function createStop(req, res) {
  //

  // 0. Refuse request if not POST
  if (req.method != 'POST') {
    await res.setHeader('Allow', ['POST']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  // 1. Try to save a new document with req.body
  try {
    req.body = await JSON.parse(req.body);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'JSON parse error.' });
  }

  // 2. Validate req.body against schema
  try {
    req.body = Schema.cast(req.body);
  } catch (err) {
    console.log(err);
    return await res.status(400).json({ message: JSON.parse(err.message)[0].message });
  }

  // 3. Try to connect to the database
  try {
    await database.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Database connection error.' });
  }

  // 4. Check for uniqueness
  try {
    // The only value that needs to, and can be, unique is 'reference'.
    // Reasons: For 'contact_email', there can be two customers with different name but same email,
    // like a company that has several employees and needs to receive the invoices
    // in the same accounting email. For NIF, the same happens: there can be two people
    // that want to share the same NIF, but receive invoices in different emails.
    // This might be expanded in the future, if emails are necessary for account creation.
    if (req.body.reference) {
      const existsReference = await Model.exists({ reference: req.body.reference });
      if (existsReference) throw new Error('A customer with the same reference already exists');
    }
  } catch (err) {
    console.log(err);
    return await res.status(409).json({ message: err.message });
  }

  // 5. Try to save a new document with req.body
  try {
    const newCustomer = await Model(req.body).save();
    return await res.status(201).json(newCustomer);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot create this Customer.' });
  }
}
