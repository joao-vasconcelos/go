/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import generator from '@/services/generator';
import { ArchiveDefault } from '@/schemas/Archive/default';
import { ArchiveModel } from '@/schemas/Archive/model';

/* * */

export default async function handler(req, res) {
  //

  // 1.
  // Setup variables

  let sessionData;

  // 2.
  // Get session data

  try {
    sessionData = await getSession(req, res);
  } catch (error) {
    console.log(error);
    return await res.status(400).json({ message: error.message || 'Could not get Session data. Are you logged in?' });
  }

  // 3.
  // Prepare endpoint

  try {
    await prepareApiEndpoint({ request: req, method: 'GET', session: sessionData, permissions: [{ scope: 'archives', action: 'create' }] });
  } catch (error) {
    console.log(error);
    return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
  }

  // 4.
  // Save a new document with default values

  try {
    const newDocument = { ...ArchiveDefault, code: generator({ length: 5 }) };
    while (await ArchiveModel.exists({ code: newDocument.code })) {
      newDocument.code = generator({ length: 5 });
    }
    const createdDocument = await ArchiveModel(newDocument).save();
    return await res.status(201).json(createdDocument);
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: 'Cannot create this Archive.' });
  }

  //
}
