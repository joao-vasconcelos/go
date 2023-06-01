'use client';

import API from '../../../../services/API';
import notify from '../../../../services/notify';
import shapesTxtParser from './shapesTxtParser';
import BulkImport from '../../../../components/BulkImport/BulkImport';
import AuthGate from '../../../../components/AuthGate/AuthGate';

export default function Page() {
  //
  //
  //
  // A. Setup variables

  //
  // B. Handle actions

  const handleUpload = async (shapeData) => {
    try {
      notify(`shape-upload-${shapeData.code}`, 'loading', `A Importar Shape ${shapeData.code}...`);
      await API({ service: 'shapes', operation: 'import', method: 'POST', body: shapeData });
      notify(`shape-upload-${shapeData.code}`, 'success', 'Shape Importada com sucesso!');
    } catch (err) {
      console.log(err);
      notify(`shape-upload-${shapeData.code}`, 'error', err.message || 'Occoreu um erro.');
    }
  };

  //
  // C. Render components

  return (
    <AuthGate scope='shapes' permission='bulk_import'>
      <BulkImport filesParser={shapesTxtParser} dataUploader={handleUpload} />
    </AuthGate>
  );

  //
}
