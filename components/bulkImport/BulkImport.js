'use client';

import useBulkImportController from './useBulkImportController';
import BulkImportFileSelect from './BulkImportFileSelect';
import BulkImportTable from './BulkImportTable';

export default function BulkImport({ filesParser, dataUploader }) {
  //

  //
  // A. Setup variables

  const bulkImportController = useBulkImportController(dataUploader);

  //
  // B. Handle actions

  const handleOnParse = (parsedData) => {
    bulkImportController.onReceiveData(parsedData);
  };

  //
  // C. Render components

  return !bulkImportController.allRows.length ? <BulkImportFileSelect filesParser={filesParser} onParse={handleOnParse} /> : <BulkImportTable controller={bulkImportController} />;
}
