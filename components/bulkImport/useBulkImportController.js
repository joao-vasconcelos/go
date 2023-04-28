import { useCallback, useEffect, useReducer, useRef } from 'react';

const api = {
  uploadFile({ timeout = 3000 }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, timeout);
    });
  },
};

// Constants
const LOADED = 'LOADED';
const INIT = 'INIT';
const UPLOADING = 'UPLOADING';
const SHAPES_UPLOADED = 'SHAPES_UPLOADED';
const UPLOAD_ERROR = 'UPLOAD_ERROR';

const initialState = {
  allRows: [],
  pendingRows: [],
  currentlyUploadingRow: null,
  isUploading: false,
  uploadedRows: [],
  currentStatus: 'idle',
};

const reducer = (state, action) => {
  switch (action.type) {
    //
    case 'load':
      return {
        ...state,
        currentStatus: LOADED,
        allRows: action.allRows,
      };

    //
    //
    //

    case 'upload-bulk-init':
      return {
        ...state,
        currentStatus: INIT,
        pendingRows: action.pendingRows,
      };

    case 'upload-single-init':
      return {
        ...state,
        pendingRows: [...state.pendingRows, action.row],
      };

    //
    //
    //

    case 'upload-next':
      return {
        ...state,
        currentStatus: UPLOADING,
        currentlyUploadingRow: action.nextRow,
      };

    //
    //
    //

    case 'upload-done':
      return {
        ...state,
        currentlyUploadingRow: null,
        pendingRows: state.pendingRows.slice(1),
        uploadedRows: [...state.uploadedRows, state.currentlyUploadingRow],
      };

    //
    //
    //

    case 'set-upload-error':
      return { ...state, uploadError: action.error, currentStatus: UPLOAD_ERROR };

    //
    //
    //

    case 'reset':
      return initialState;

    default:
      return state;
    //
  }
};

const useBulkImportController = (dataUploader) => {
  //

  const [state, dispatch] = useReducer(reducer, initialState);

  //
  const onReceiveData = (parsedData) => {
    const parsedRows = parsedData.map((item, index) => {
      return { row_id: `row-${index}`, item: item };
    });
    dispatch({ type: 'load', allRows: parsedRows });
  };

  //
  const onUploadBulkInit = (checkedRowsIndexes) => {
    const pendingRows = state.allRows.filter((row) => checkedRowsIndexes.includes(row.row_id));
    dispatch({ type: 'upload-bulk-init', pendingRows: pendingRows });
  };

  //
  const onUploadSingleInit = (row) => {
    dispatch({ type: 'upload-single-init', row: row });
  };

  //
  const onReset = () => {
    dispatch({ type: 'reset' });
  };

  //
  // Sets the currentlyUploadingRow shape when it detects that its ready to go
  useEffect(() => {
    if (state.pendingRows.length && state.currentlyUploadingRow == null) {
      dispatch({ type: 'upload-next', nextRow: state.pendingRows[0] });
    }
  }, [state.currentlyUploadingRow, state.pendingRows]);

  //
  // Processes the next pendingRows thumbnail when ready
  useEffect(() => {
    async function fetchData() {
      if (state.pendingRows.length && state.currentlyUploadingRow) {
        try {
          await dataUploader(state.currentlyUploadingRow.item);
          dispatch({ type: 'upload-done' });
        } catch (error) {
          console.error(error);
          dispatch({ type: 'set-upload-error', error });
        }
      }
    }
    fetchData();
  }, [dataUploader, state.currentlyUploadingRow, state.pendingRows]);
  useEffect(() => {}, [state.currentlyUploadingRow, state.pendingRows]);

  return {
    ...state,
    onReceiveData,
    onUploadBulkInit,
    onUploadSingleInit,
    onReset,
  };
};

export default useBulkImportController;
