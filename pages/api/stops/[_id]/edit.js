import { requireAuth } from '@clerk/nextjs/api';
import database from '../../../../services/database';
import Model from '../../../../models/Customer';
import Schema from '../../../../schemas/Customer';

/* * */
/* EDIT CUSTOMER */
/* Explanation needed. */
/* * */

export default requireAuth(async (req, res) => {
  //

  // 0. Refuse request if not PUT
  if (req.method != 'PUT') {
    await res.setHeader('Allow', ['PUT']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  // 1. Parse request body into JSON
  try {
    req.body = await JSON.parse(req.body);
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'JSON parse error.' });
    return;
  }

  // 2. Validate req.body against schema
  try {
    req.body = Schema.cast(req.body);
    console.log(req.body);
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
      const foundReference = await Model.findOne({ reference: req.body.reference });
      if (foundReference && foundReference._id != req.query._id)
        throw new Error('A customer with the same reference already exists');
    }
  } catch (err) {
    console.log(err);
    return await res.status(409).json({ message: err.message });
  }

  // 2. Try to update the correct customer
  try {
    const editedCustomer = await Model.findOneAndReplace({ _id: req.query._id }, req.body, { new: true }); // Return the edited document
    if (!editedCustomer)
      return await res.status(404).json({ message: `Customer with _id: ${req.query._id} not found.` });
    return await res.status(200).json(editedCustomer);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot update this customer.' });
  }
});
