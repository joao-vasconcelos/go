/* * */

import fs from 'fs';
import path from 'path';
import generator from './generator';

/* * */

class STORAGE {
  //

  storage_directory_name = 'storage';

  allowed_scopes = { alerts: 'alerts', issues: 'issues', stops: 'stops', exports: 'exports', archives: 'archives', reports: 'reports' };

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

  setupWorkdir(scope, id = generator({ length: 12 })) {
    // Get the scope dir path
    const scopedPath = STORAGE.getScopeDirPath(scope);
    // Setup the working directory for the given scope and id
    const workdir = `${scopedPath}/${id}`;
    // Out of an abundance of caution, delete the directory and all its contents if it already exists
    if (fs.existsSync(workdir)) fs.rmSync(workdir, { recursive: true, force: true });
    // Create a fresh empty directory in the given path
    fs.mkdirSync(workdir, { recursive: true });
    // Return workdir to the caller
    return workdir;
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
