'use client';

import { useState } from 'react';
import { SimpleGrid, Textarea, Button, Alert } from '@mantine/core';
import { parseShapesCsv } from '../shapesTxtParser';
import { TbInfoCircleFilled } from 'react-icons/tb';

//

export default function ImportShapeFromText({ onImport }) {
  //

  const [importError, setImportError] = useState();
  const [shapeText, setShapeText] = useState('');

  const handleShapeImport = async () => {
    try {
      const parsedShapes = await parseShapesCsv(shapeText); // Use the helper function to transform the CSV text into an array of JSON objects
      onImport(parsedShapes[0].points); // Pass only the first result to the caller
    } catch (err) {
      setImportError(err.message);
    }
  };

  const handleShapeDelete = () => {
    setImportError('');
    setShapeText('');
  };

  return (
    <>
      <SimpleGrid cols={1}>
        {shapeText.length > 0 && (
          <Alert icon={<TbInfoCircleFilled size='20px' />} title='Atenção' color='blue'>
            A importação de novos pontos substitui os atualmente guardados na shape. Utilize esta função para atualizar a shape sem ser necessário re-associar shapes aos patterns.
          </Alert>
        )}
        <Textarea label='Importar Shape' value={shapeText} autosize minRows={3} maxRows={10} onChange={({ target }) => setShapeText(target.value)} error={importError} />
      </SimpleGrid>
      <SimpleGrid cols={2}>
        <Button onClick={handleShapeImport} disabled={!shapeText.length}>
          Iniciar Importação
        </Button>
        <Button variant='light' color='gray' onClick={handleShapeDelete} disabled={!shapeText.length}>
          Limpar
        </Button>
      </SimpleGrid>
    </>
  );
}
