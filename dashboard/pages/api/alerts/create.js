import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import { AlertDefault } from '@/schemas/Alert/default';
import { AlertModel } from '@/schemas/Alert/model';
import { Client } from 'minio';

/* * */
/* CREATE ALERT */
/* Explanation needed. */
/* * */

export default async function handler(req, res) {
  //
  await delay();

  // 0.
  // Refuse request if not GET

  if (req.method != 'GET') {
    await res.setHeader('Allow', ['GET']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 1.
  // Define "semi-global"-scoped variables to be used later on in the function

  let session;

  // 2.
  // Check for correct Authentication and valid Permissions

  try {
    session = await checkAuthentication({ scope: 'alerts', permission: 'create_edit', req, res });
  } catch (err) {
    console.log(err);
    return await res.status(401).json({ message: err.message || 'Could not verify Authentication.' });
  }

  //   TEST

  const minioClient = new Client({
    endPoint: 'play.min.io',
    port: 9000,
    useSSL: true,
    accessKey: 'Q3AM3UQ867SPQQA43P2F',
    secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG',
  });

  // File that needs to be uploaded.
  var file = process.env.PWD + '/test.png';

  // Make a bucket called europetrip.
  //   minioClient.makeBucket('test-cm', 'us-east-1', function (err) {
  //     if (err) return console.log(err);

  //     console.log('Bucket created successfully in "us-east-1".');
  //   });

  var metaData = {
    'Content-Type': 'application/octet-stream',
    'X-Amz-Meta-Testing': 1234,
    example: 5678,
  };
  // Using fPutObject API upload your file to the bucket europetrip.
  minioClient.fPutObject('test-cm', 'test.png', file, metaData, function (err, etag) {
    if (err) return console.log(err);
    console.log('File uploaded successfully.');
  });

  //   TEST

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
    const createdDocument = await AlertModel({ ...AlertDefault, created_by: session.user._id }).save();
    return await res.status(201).json(createdDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot create this Alert.' });
  }
}
