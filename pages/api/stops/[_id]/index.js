import { requireAuth } from '@clerk/nextjs/api';
import database from '../../../../services/database';
import Model from '../../../../models/Customer';

/* * */
/* GET CUSTOMER BY ID */
/* Explanation needed. */
/* * */

export default requireAuth(async (req, res) => {
  //

  // 0. Refuse request if not GET
  if (req.method != 'GET') {
    await res.setHeader('Allow', ['GET']);
    await res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    return;
  }

  // 1. Try to connect to the database
  try {
    await database.connect();
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Database connection error.' });
    return;
  }

  // 2. Try to fetch the correct Customer from the database
  try {
    const foundCustomer = await Model.findOne({ _id: req.query._id });
    if (!foundCustomer)
      return await res.status(404).json({ message: `Customer with _id: ${req.query._id} not found.` });
    return await res.status(200).json(foundCustomer);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot fetch this Customer.' });
  }
});
