/* * */

import fs from 'fs';
import path from 'path';

/* * */

class STORAGE {
  //

  storage_directory_name = 'storage';

  constructor() {
    // Build the base storage directory path
    this.base_path = `${process.env.PWD}/${this.storage_directory_name}`;
    // Create the directory if it does not exist
    if (!fs.existsSync(this.base_path)) fs.mkdirSync(this.base_path, { recursive: true });
    //
  }

  getScopeDirPath(scope) {
    // Build the scoped directory path
    const scopedPath = `${this.base_path}/${scope}`;
    // Create the directory if it does not exist
    if (!fs.existsSync(scopedPath)) fs.mkdirSync(scopedPath, { recursive: true });
    // Return scoped path
    return scopedPath;
    //
  }

  getFilePath(scope, filename) {
    return `${this.base_path}/${scope}/${filename}`;
  }

  exists(scope, filename) {
    // Build the scoped directory path
    const scopedPath = `${this.base_path}/${scope}/${filename}`;
    // Check if the file exists
    return fs.existsSync(scopedPath);
    //
  }

  getFileExtension(filepath, includeDot = true) {
    if (includeDot) return path.extname(filepath);
    else return path.extname(filepath).replace('.', '');
  }

  //
}

/* * */

const storage = new STORAGE();

/* * */

export default storage;
