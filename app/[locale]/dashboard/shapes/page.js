'use client';

import API from '../../../../services/API';
import notify from '../../../../services/notify';
import shapesTxtParser from './shapesTxtParser';
import BulkImport from '../../../../components/bulkImport/BulkImport';

export default function Page() {
  //

  //
  // A. Handle actions

  const handleUploadShapes = async (shapeData) => {
    try {
      notify(`shape-upload-${shapeData.shape_code}`, 'loading', `A Importar Shape ${shapeData.shape_code}...`);
      await API({ service: 'shapes', operation: 'import', method: 'POST', body: shapeData });
      notify(`shape-upload-${shapeData.shape_code}`, 'success', 'Shape Importada com sucesso!');
    } catch (err) {
      console.log(err);
      notify(`shape-upload-${shapeData.shape_code}`, 'error', err.message || 'Occoreu um erro.');
    }
  };

  //
  // B. Render components

  return <BulkImport filesParser={shapesTxtParser} dataUploader={handleUploadShapes} />;

  //
}
