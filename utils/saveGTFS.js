/* * * * * */
/* SAVE GTFS */
/* * */

/* * */
/* IMPORTS */
import { parse } from 'csv-parse';
import { PrismaClient } from '@prisma/client';

async function agency(fileEntry) {
  //
  // Initialize a variable to save the parsed file contents
  const fileContents = [];

  fileEntry
    // Pipe the file into CSV Parser
    .pipe(parse({ columns: true, delimiter: ',', from_line: 1 }))
    // On each parsed row of data,
    .on('data', function (row) {
      // save the row contents to the variable
      fileContents.push(row);
    })
    // When reaching the end of the file,
    .on('end', async function () {
      // initialize a new connection to the database
      const prisma = new PrismaClient();
      try {
        await prisma.agency.createMany({
          data: fileContents,
        });
      } catch (error) {
        console.error(error);
        await prisma.$disconnect();
      }
    })
    .on('error', function (error) {
      console.error(error);
    });
}

async function stopTimes(fileEntry) {}

const saveGTFS = {
  agency,
  stopTimes,
};

export default saveGTFS;
