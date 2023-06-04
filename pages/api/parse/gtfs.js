import delay from '../../../services/delay';
import mongodb from '../../../services/mongodb';
import AdmZip from 'adm-zip';
import formidable from 'formidable';
import { Model as AgencyModel } from '../../../schemas/Agency/model';

/* * */
/* PARSE GTFS ARCHIVE */
/* This endpoint receives a GTFS archive and parses its contents into JSON. */
/* * */

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

// export const config = {
//   api: {
//     externalResolver: true,
//   },
// };

export default async function parseGTFS(req, res) {
  //
  await delay();

  // 0. Refuse request if not POST
  if (req.method != 'POST') {
    await res.setHeader('Allow', ['POST']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  const form = new formidable.IncomingForm({ multiples: true });
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    console.log(err);
    if (err) {
      return res.status(400).json({ message: err });
    }

    console.log('fields', fields);
    console.log('files', files);

    var zip = new AdmZip(files.file.filepath);
    // zip.addFile(files.file);
    var zipEntries = zip.getEntries(); // an array of ZipEntry records

    zipEntries.forEach(function (zipEntry) {
      console.log('zipEntry.toString()', zipEntry.toString()); // outputs zip entries information
      console.log('zipEntry.entryName', zipEntry.entryName); // outputs zip entries information
      if (zipEntry.entryName == 'my_file.txt') {
        console.log(zipEntry.getData().toString('utf8'));
      }
    });

    return res.json(files);
  });

  return;

  // reading archives
  var zip = new AdmZip();
  zip.addFile(req.body);
  var zipEntries = zip.getEntries(); // an array of ZipEntry records

  zipEntries.forEach(function (zipEntry) {
    console.log('zipEntry.toString()', zipEntry.toString()); // outputs zip entries information
    console.log('zipEntry.entryName', zipEntry.entryName); // outputs zip entries information
    if (zipEntry.entryName == 'my_file.txt') {
      console.log(zipEntry.getData().toString('utf8'));
    }
  });

  return await res.status(200).json({ message: 'MongoDB connection error.' });

  // 1. Try to connect to mongodb
  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 2. Try to list all documents
  try {
    const allDocuments = await AgencyModel.find({});
    return await res.status(200).send(allDocuments);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot list Agencies.' });
  }
}
