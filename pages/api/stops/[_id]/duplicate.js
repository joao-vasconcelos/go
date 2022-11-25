import { requireAuth } from '@clerk/nextjs/api';
import database from '../../../../services/database';
import Model from '../../../../models/Stop';

/* * */
/* DUPLICATE CUSTOMER */
/* Explanation needed. */
/* * */

export default requireAuth(async (req, res) => {
  //

  // 0. Refuse request if not GET
  if (req.method != 'GET') {
    await res.setHeader('Allow', ['GET']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  // 1. Try to connect to the database
  try {
    await database.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Database connection error.' });
  }

  // 2. Try to fetch the correct Customer from the database
  //    and create a new copy of it without the unique fields.
  try {
    const foundCustomer = await Model.findOne({ _id: req.query._id }).lean();
    if (!foundCustomer)
      return await res.status(404).json({ message: `Customer with _id: ${req.query._id} not found.` });
    // Delete properties that must be unique to each Customer
    delete foundCustomer._id;
    delete foundCustomer.reference;
    // Save as a new document
    const duplicatedCustomer = await new Model(foundCustomer).save();
    return await res.status(201).json(duplicatedCustomer);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot duplicate this Customer.' });
  }
});
