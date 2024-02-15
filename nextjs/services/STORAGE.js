/* * */

import fs from 'fs';
import path from 'path';

/* * */

class STORAGE {
  //

  storage_directory_name = 'storage';

  allowed_scopes = { alerts: 'alerts', issues: 'issues', stops: 'stops' };

  getScopeDirPath(scope) {
    // Get the scope path from allowed list
    const scopePath = this.allowed_scopes[scope];
    // Return if there is not a valid scope here
    if (!scopePath) throw new Error(`Storage scope not allowed: "${scope}"`);
    // Build the scoped directory path
    const scopedPath = `${process.env.PWD}/${this.storage_directory_name}/${scopePath}`;
    // Create the directory if it does not exist
    if (!fs.existsSync(scopedPath)) fs.mkdirSync(scopedPath, { recursive: true });
    // Return scoped path
    return scopedPath;
    //
  }

  getFilePath(scope, filename) {
    const scopeDirPath = this.getScopeDirPath(scope);
    return `${scopeDirPath}/${filename}`;
  }

  exists(scope, filename) {
    const scopeDirPath = this.getScopeDirPath(scope);
    return fs.existsSync(`${scopeDirPath}/${filename}`);
  }

  moveFile(scope, filename, originalPath) {
    const originalData = fs.readFileSync(originalPath);
    return this.saveFile(scope, filename, originalData);
  }

  saveFile(scope, filename, data) {
    const scopeDirPath = this.getScopeDirPath(scope);
    fs.writeFileSync(`${scopeDirPath}/${filename}`, data);
  }

  removeFile(scope, filename) {
    const scopeDirPath = this.getScopeDirPath(scope);
    return fs.rmSync(`${scopeDirPath}/${filename}`, { force: true });
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
