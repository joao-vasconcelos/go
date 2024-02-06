/* * */

import fs from 'fs';
import Formidable from 'formidable';
import STORAGE from '@/services/STORAGE';
import mongodb from '@/services/mongodb';
import checkAuthentication from '@/services/checkAuthentication';
import { Model as MediaModel } from '@/schemas/Media/model';
import { Default as MediaDefault } from '@/schemas/Media/default';
import { Options as MediaOptions } from '@/schemas/Media/options';

/* * */

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
    externalResolver: true,
  },
};

/* * */

export default async function parseGTFS(req, res) {
  //

  let sessionData;
  let formFields;
  let formFiles;

  // 1.
  // Refuse request if not POST

  if (req.method != 'POST') {
    await res.setHeader('Allow', ['POST']);
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

  //
  // 4. Parse FormData in the request

  try {
    // Create a new Formidable instance
    const form = Formidable({ keepExtensions: true });
    // Parse the FormData request
    [formFields, formFiles] = await form.parse(req);
    //
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: err.message || 'Could not parse form data.' });
  }

  //
  // 5. Validate the form data

  try {
    // Check if title is present
    if (formFields.title.length !== 1) throw new Error('Title is required.');
    // Check if file is present
    if (formFiles.file.length !== 1) throw new Error('File is required.');
    //
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: err.message || 'Could not validate form data.' });
  }

  //
  // 6. Create a new document

  try {
    //

    // Setup a new Media document
    const newDocument = {
      //
      ...MediaDefault,
      //
      created_at: new Date().toISOString(),
      created_by: sessionData.user._id,
      //
      title: formFields.title[0],
      description: formFields.description?.length > 0 ? formFields.description[0] : '',
      //
      file_size: formFiles.file[0].size,
      file_mime_type: formFiles.file[0].mimetype,
      file_extension: STORAGE.getFileExtension(formFiles.file[0].originalFilename),
      //
    };

    // Save the new document to the database
    const createdDocument = await MediaModel(newDocument).save();

    // Get the storage directory for Media files
    const mediaDirectory = STORAGE.getScopeDirPath(MediaOptions.workdir);

    // Save the file to the correct directory
    fs.renameSync(formFiles.file[0].filepath, `${mediaDirectory}/${createdDocument._id}${createdDocument.file_extension}`);

    // Return the response to the caller
    return await res.status(201).json(createdDocument);
    //
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  //
}
