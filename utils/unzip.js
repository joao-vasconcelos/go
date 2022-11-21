var yauzl = require('yauzl');

export default function unzip(zippedFilePath, callback) {
  yauzl.open(zippedFilePath, { lazyEntries: true }, function (err, zipfile) {
    if (err) throw err;
    zipfile.readEntry();
    zipfile.on('entry', function (entry) {
      if (/\/$/.test(entry.fileName)) {
        // Directory file names end with '/'.
        // Note that entires for directories themselves are optional.
        // An entry's fileName implicitly requires its parent directories to exist.
        zipfile.readEntry();
      } else {
        // file entry
        zipfile.openReadStream(entry, function (err, readStream) {
          if (err) throw err;
          readStream.on('end', function () {
            zipfile.readEntry();
          });
          return readStream;
        });
      }
    });
  });
}
