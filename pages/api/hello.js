// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// import importGTFSFromURL from '../../utils/importGtfs';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import unzipper from 'unzipper';

export default async function handler(req, res) {
  //

  // 0. Refuse request if not POST
  if (req.method != 'POST') {
    await res.setHeader('Allow', ['POST']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const rowsOfData = [];

  // 1. Get file data from HTTP Form
  const form = new IncomingForm();
  form.parse(req, async (err, fields, files) => {
    //
    // If [files] is not empty and has filepath set
    if (files.file && files.file.filepath) {
      //
      // Create a readStream from the set filepath
      fs.createReadStream(files.file.filepath)
        .pipe(unzipper.Parse()) // Unzip the file
        .on('entry', function (entry) {
          // This function is called for each unzipped entry,
          // that can be a file or directory.
          if (entry.type === 'File') {
            // Perform action based on filename
            console.log(entry.path);
            switch (entry.path) {
              case 'agency.txt':
                entry.pipe(fs.createWriteStream('output/path'));

              default:
                break;
            }
          } else {
            entry.autodrain(); // Release contents to free memory
          }
        });

      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //

      // yauzl.open(files.file.filepath, { lazyEntries: true }, function (err, zipfile) {
      //   if (err) throw err;
      //   zipfile.readEntry();
      //   zipfile.on('entry', function (entry) {
      //     if (/\/$/.test(entry.fileName)) {
      //       // Directory file names end with '/'.
      //       // Note that entires for directories themselves are optional.
      //       // An entry's fileName implicitly requires its parent directories to exist.
      //       zipfile.readEntry();
      //     } else {
      //       // file entry
      //       zipfile.openReadStream(entry, function (err, readStream) {
      //         if (err) throw err;
      //         readStream.on('end', function () {
      //           zipfile.readEntry();
      //         });
      //         readStream
      //           .pipe(parse({ columns: true, delimiter: ',', from_line: 1 }))
      //           .on('data', function (row) {
      //             rowsOfData.push(row);
      //             console.log(row);
      //           })
      //           .on('end', async function () {
      //             console.log('finished');
      //             const prisma = new PrismaClient();
      //             try {
      //               const agency = await prisma.agency.createMany({
      //                 data: rowsOfData,
      //               });
      //               console.log(agency);
      //               res.status(200).json({ data: { url: '/uploaded-file-url' }, error: null });
      //             } catch (error) {
      //               console.error(error);
      //               await prisma.$disconnect();
      //               res.status(500).json({ data: null, error: error.message });
      //             }
      //           })
      //           .on('error', function (error) {
      //             console.error(error);
      //             res.status(error.httpCode || 400).json({ data: null, error: error.message });
      //           });
      //       });
      //     }
      //   });
      // });

      // fs.createReadStream(files.file.filepath)
      // .pipe(parse({ columns: true, delimiter: ',', from_line: 1 }))
      // .on('data', function (row) {
      //   rowsOfData.push(row);
      //   console.log(row);
      // })
      // .on('end', async function () {
      //   console.log('finished');
      //   const prisma = new PrismaClient();
      //   try {
      //     const agency = await prisma.agency.createMany({
      //       data: rowsOfData,
      //     });
      //     console.log(agency);
      //     res.status(200).json({ data: { url: '/uploaded-file-url' }, error: null });
      //   } catch (error) {
      //     console.error(error);
      //     await prisma.$disconnect();
      //     res.status(500).json({ data: null, error: error.message });
      //   }
      // })
      // .on('error', function (error) {
      //   console.error(error);
      //   res.status(error.httpCode || 400).json({ data: null, error: error.message });
      // });
    } else {
      res.status(400).json({ data: null, error: 'No files received.' });
    }
  });
}

// Disable NextJS default req.body parser
// More info: https://stackoverflow.com/a/68988768
export const config = {
  api: {
    bodyParser: false,
  },
};
