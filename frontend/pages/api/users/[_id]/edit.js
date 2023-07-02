import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import { Validation as UserValidation } from '@/schemas/User/validation';
import { Model as UserModel } from '@/schemas/User/model';

/* * */
/* EDIT USER */
/* Explanation needed. */
/* * */

export default async function handler(req, res) {
  //
  await delay();

  // 0.
  // Refuse request if not PUT

  if (req.method != 'PUT') {
    await res.setHeader('Allow', ['PUT']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 1.
  // Check for correct Authentication and valid Permissions

  try {
    await checkAuthentication({ scope: 'users', permission: 'create_edit', req, res });
  } catch (err) {
    console.log(err);
    return await res.status(401).json({ message: err.message || 'Could not verify Authentication.' });
  }

  // 2.
  // Parse request body into JSON

  try {
    req.body = await JSON.parse(req.body);
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'JSON parse error.' });
    return;
  }

  // 3.
  // Validate req.body against schema

  try {
    req.body = UserValidation.cast(req.body);
  } catch (err) {
    console.log(err);
    return await res.status(400).json({ message: JSON.parse(err.message)[0].message });
  }

  // 4.
  // Connect to MongoDB

  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 5.
  // Check for uniqueness

  try {
    // The values that need to be unique are ['email'].
    const foundDocumentWithEmail = await UserModel.exists({ email: { $eq: req.body.email } });
    if (foundDocumentWithEmail && foundDocumentWithEmail._id != req.query._id) {
      throw new Error('A User with the same email already exists.');
    }
  } catch (err) {
    console.log(err);
    return await res.status(409).json({ message: err.message });
  }

  // 6.
  // Reset & Ensure permissions

  try {
    // Agencies
    if (!req.body.permissions.agencies.view) {
      req.body.permissions.agencies.create_edit = false;
      req.body.permissions.agencies.delete = false;
    }
    // Export
    if (!req.body.permissions.export.view) {
      req.body.permissions.export.gtfs_v18 = false;
      req.body.permissions.export.gtfs_v29 = false;
      req.body.permissions.export.agencies = [];
    }
    // Users
    if (!req.body.permissions.users.view) {
      req.body.permissions.users.create_edit = false;
      req.body.permissions.users.delete = false;
    }
  } catch (err) {
    console.log(err);
    return await res.status(409).json({ message: err.message });
  }

  // 7.
  // Update the correct document

  try {
    const editedDocument = await UserModel.findOneAndUpdate({ _id: { $eq: req.query._id } }, req.body, { new: true });
    if (!editedDocument) return await res.status(404).json({ message: `User with _id: ${req.query._id} not found.` });
    return await res.status(200).json(editedDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot update this User.' });
  }
}
