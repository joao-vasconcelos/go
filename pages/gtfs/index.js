import PageContainer from '../../components/PageContainer';
import { useState } from 'react';
import { Group, Text, useMantineTheme } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons';
import { Dropzone, CSV_MIME_TYPE } from '@mantine/dropzone';
import Image from 'next/image';

export default function BaseDemo(props) {
  //

  const [fileData, setFileData] = useState(null);
  // const [createObjectURL, setCreateObjectURL] = useState(null);

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setFileData(file);
    }
  };

  const uploadToServer = async (event) => {
    const body = new FormData();
    body.append('file', fileData);
    const response = await fetch('/api/hello', {
      method: 'POST',
      body,
    });
    console.log(response);
  };

  //

  return (
    <PageContainer title={['GTFS Publisher']}>
      <div>
        <div>
          <h4>Select Image</h4>
          <input type='file' name='myImage' onChange={uploadToClient} />
          <button className='btn btn-primary' type='submit' onClick={uploadToServer}>
            Send to server
          </button>
        </div>
      </div>
    </PageContainer>
  );
}
