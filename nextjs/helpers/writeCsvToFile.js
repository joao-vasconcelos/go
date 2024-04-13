/* * */

import fs from 'fs';
import Papa from 'papaparse';

/* * */

const NEW_LINE_CHARACTER = '\n';

/* * */

export default async function writeCsvToFile(workdir, filename, data, papaparseOptions) {
  return new Promise((resolve, reject) => {
    try {
      // If data is not an array, then wrap it in one
      if (!Array.isArray(data)) data = [data];
      // Setup a variable to keep track if the file exists or not
      let fileAlreadyExists = true;
      // Try to access the file and append data to it
      fs.access(`${workdir}/${filename}`, fs.constants.F_OK, async (err) => {
        // If an error is thrown, then the file does not exist
        if (err) fileAlreadyExists = false;
        // Use papaparse to produce the CSV string
        let csvData = Papa.unparse(data, { skipEmptyLines: 'greedy', newline: NEW_LINE_CHARACTER, header: !fileAlreadyExists, ...papaparseOptions });
        // Prepend a new line character to csvData string if it is not the first line on the file
        if (fileAlreadyExists) csvData = NEW_LINE_CHARACTER + csvData;
        // Append the csv string to the file
        fs.appendFile(`${workdir}/${filename}`, csvData, (appendErr) => {
          if (appendErr) reject(`Error appending data to file ${filename}: ${appendErr.message}`);
          else resolve();
        });
      });
    } catch (error) {
      reject(`Error at writeCsvToFile(${workdir}, ${filename}, ${data}, ${papaparseOptions}): ${error.message}`);
    }
  });
}
