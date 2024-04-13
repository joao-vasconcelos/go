/* * */

import fs from 'fs';
import Papa from 'papaparse';

/* * */

const NEW_LINE_CHARACTER = '\n';
const DEFAULT_BATCH_SIZE = 1000000;

/* * */

let CURRENT_BATCH_FILE = null;
let CURRENT_BATCH_DATA = [];

/* * */

export async function writeCsvToFileBatch(workdir, filename, data) {
  // Check if the batch workdir is the same of the current operation
  if (CURRENT_BATCH_FILE !== `${workdir}/${filename}`) {
    await flushBatch();
  }
  // Check if the batch is full
  if (CURRENT_BATCH_DATA.length > DEFAULT_BATCH_SIZE) {
    await flushBatch();
  }
  // Set the working dir
  CURRENT_BATCH_FILE = `${workdir}/${filename}`;
  // Add the data to the batch
  if (Array.isArray(data)) CURRENT_BATCH_DATA = [...CURRENT_BATCH_DATA, ...data];
  else CURRENT_BATCH_DATA.push(data);
  //
}

async function flushBatch() {
  return new Promise((resolve, reject) => {
    try {
      console.log('FLUSHING BATCH', CURRENT_BATCH_DATA.length, CURRENT_BATCH_FILE);
      if (!CURRENT_BATCH_FILE) resolve();
      // Setup a variable to keep track if the file exists or not
      let fileAlreadyExists = true;
      // Try to access the file and append data to it
      fs.access(CURRENT_BATCH_FILE, fs.constants.F_OK, async (err) => {
        // If an error is thrown, then the file does not exist
        if (err) fileAlreadyExists = false;
        // Use papaparse to produce the CSV string
        let csvData = Papa.unparse(CURRENT_BATCH_DATA, { skipEmptyLines: 'greedy', newline: NEW_LINE_CHARACTER, header: !fileAlreadyExists });
        // Prepend a new line character to csvData string if it is not the first line on the file
        if (fileAlreadyExists) csvData = NEW_LINE_CHARACTER + csvData;
        // Append the csv string to the file
        fs.appendFile(CURRENT_BATCH_FILE, csvData, (appendErr) => {
          if (appendErr) reject(`Error appending data to file: ${appendErr.message}`);
          else {
            CURRENT_BATCH_DATA = [];
            resolve();
          }
        });
      });
    } catch (error) {
      reject(`Error at flushBatch(): ${error.message}`);
    }
  });
}

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
