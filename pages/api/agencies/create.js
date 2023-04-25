import delay from '../../../services/delay';
import mongodb from '../../../services/mongodb';
import generator from '../../../services/generator';
import { Model as AgencyModel } from '../../../schemas/Agency/model';

/* * */
/* CREATE AGENCY */
/* Explanation needed. */
/* * */

export default async function agenciesCreate(req, res) {
  //
  await delay();

  // 0. Refuse request if not GET
  if (req.method != 'GET') {
    await res.setHeader('Allow', ['GET']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 1. Try to connect to mongodb
  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 2. Initiate the new empty agency object
  const newAgency = { agency_id: '' };

  // 3. Create new agency with random, unique 'agency_id'
  try {
    let uniqueAgencyIdIsNotUnique = true;
    while (uniqueAgencyIdIsNotUnique) {
      newAgency.agency_id = generator(2, 'numeric'); // Generate a new code with 2 characters
      uniqueAgencyIdIsNotUnique = await AgencyModel.exists({ agency_id: newAgency.agency_id });
    }
  } catch (err) {
    console.log(err);
    await res.status(409).json({ message: err.message });
    return;
  }

  // 4. Try to save a new document with req.body
  try {
    const createdDocument = await AgencyModel(newAgency).save();
    return await res.status(201).json(createdDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot create this Agency.' });
  }
}
