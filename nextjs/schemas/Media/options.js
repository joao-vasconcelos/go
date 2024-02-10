/* * */

import { MIME_TYPES } from '@mantine/dropzone';

/* * */

export const MediaOptions = {
  //

  /*
   * ALLOWED MIME TYPES
   */

  allowed_file_mime_types: [
    // IMAGES
    MIME_TYPES.png,
    MIME_TYPES.jpeg,
    // VIDEOS
    MIME_TYPES.mp4,
    // DOCUMENTS
    MIME_TYPES.csv,
    MIME_TYPES.pdf,
    MIME_TYPES.docx,
    MIME_TYPES.pptx,
    MIME_TYPES.xlsx,
    // ARCHIVES
    MIME_TYPES.zip,
  ],

  //
};
