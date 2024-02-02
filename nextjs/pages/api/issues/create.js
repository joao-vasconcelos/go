/* * */

import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import generator from '@/services/generator';
import { Default as IssueDefault } from '@/schemas/Issue/default';
import { Model as IssueModel } from '@/schemas/Issue/model';

/* * */

export default async function handler(req, res) {
  //

  let sessionData;

  // 1.
  // Refuse request if not GET

  if (req.method != 'GET') {
    await res.setHeader('Allow', ['GET']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 2.
  // Check for correct Authentication and valid Permissions

  try {
    sessionData = await checkAuthentication({ scope: 'tags', permission: 'create_edit', req, res });
  } catch (err) {
    console.log(err);
    return await res.status(401).json({ message: err.message || 'Could not verify Authentication.' });
  }

  // 3.
  // Connect to MongoDB

  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 4.
  // Save a new document with default values

  try {
    const newDocument = { ...IssueDefault, label: generator({ length: 5 }), created_at: new Date().toISOString(), created_by: sessionData.user._id };
    while (await IssueModel.exists({ label: newDocument.label })) {
      newDocument.label = generator({ length: 5 });
    }
    const createdDocument = await IssueModel(newDocument).save();
    return await res.status(201).json(createdDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot create this Issue.' });
  }

  //
}
