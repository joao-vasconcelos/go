/* * * * * */
/* SAVE GTFS */
/* * */

/* * */
/* IMPORTS */
import { parse } from 'csv-parse';
import { PrismaClient } from '@prisma/client';

async function agency(fileEntry) {
  //
  // Initialize a common

  fileEntry
    .pipe(parse({ columns: true, delimiter: ',', from_line: 1 }))
    .on('data', function (row) {
      rowsOfData.push(row);
      console.log(row);
    })
    .on('end', async function () {
      console.log('finished');
      const prisma = new PrismaClient();
      try {
        const agency = await prisma.agency.createMany({
          data: rowsOfData,
        });
        console.log(agency);
        res.status(200).json({ data: { url: '/uploaded-file-url' }, error: null });
      } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        res.status(500).json({ data: null, error: error.message });
      }
    })
    .on('error', function (error) {
      console.error(error);
      res.status(error.httpCode || 400).json({ data: null, error: error.message });
    });
}

async function stopTimes(fileEntry) {}

const saveGTFS = {
  agency,
  stopTimes,
};

export default saveGTFS;
