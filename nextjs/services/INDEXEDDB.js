'use client';

/* * */

class INDEXEDDB {
  //

  connection = null;
  connectionVersion = null;

  databaseName = 'ReportsExplorerRealtime';

  objectStores = {
    vehicleEvents: {
      name: 'vehicleEvents',
      options: { keyPath: '_id' },
      indexes: [
        { name: 'millis', keyPath: 'millis', options: { unique: false } },
        { name: 'line_id', keyPath: 'line_id', options: { unique: false } },
        { name: 'route_id', keyPath: 'route_id', options: { unique: false } },
        { name: 'pattern_id', keyPath: 'pattern_id', options: { unique: false } },
        { name: 'trip_id', keyPath: 'trip_id', options: { unique: false } },
        { name: 'stop_id', keyPath: 'stop_id', options: { unique: false } },
        { name: 'vehicle_id', keyPath: 'vehicle_id', options: { unique: false } },
        { name: 'driver_id', keyPath: 'driver_id', options: { unique: false } },
        { name: 'operator_event_id', keyPath: 'operator_event_id', options: { unique: false } },
        { name: 'operation_plan_id', keyPath: 'operation_plan_id', options: { unique: false } },
      ],
    },
  };

  constructor() {
    this.connectionVersion = Date.now();
  }

  async init() {
    return new Promise((resolve, reject) => {
      //

      // Create a new database connection request
      const openDatabaseConnectionRequest = indexedDB.open(this.databaseName, this.connectionVersion);

      // If the connection request version changes (which happens when spawning a new instance)
      openDatabaseConnectionRequest.onupgradeneeded = () => {
        // Save the database connection to scope
        this.connection = openDatabaseConnectionRequest.result;
        // Delete all existing object stores in the database
        for (const existingObjectStoreName of this.connection.objectStoreNames) {
          this.connection.deleteObjectStore(existingObjectStoreName);
        }
        // Create new object stores
        for (const newObjectStoreData of Object.values(this.objectStores)) {
          const newObjectStore = this.connection.createObjectStore(newObjectStoreData.name, newObjectStoreData.options);
          for (const newObjectStoreIndexes of newObjectStoreData.indexes) {
            newObjectStore.createIndex(newObjectStoreIndexes.name, newObjectStoreIndexes.keyPath, newObjectStoreIndexes.options);
          }
        }
      };

      // If the connection request is successful
      openDatabaseConnectionRequest.onsuccess = () => {
        this.connection = openDatabaseConnectionRequest.result;
        this.connectionVersion = openDatabaseConnectionRequest.result.version;
        resolve(true);
      };

      // If the connection request got an error
      openDatabaseConnectionRequest.onerror = (error) => {
        console.log('Could not connect to INDEXEDDB:', error);
        reject(false);
      };

      //
    });
  }

  async addRowTo(objectStoreData, newRowData) {
    if (!this.connection) await this.init();
    return new Promise((resolve, reject) => {
      if (!this.connection) resolve(false);
      const transactionRequest = this.connection.transaction(objectStoreData.name, 'readwrite');
      const objectStore = transactionRequest.objectStore(objectStoreData.name);
      const objectStoreOperationRequest = objectStore.add(newRowData);
      objectStoreOperationRequest.onsuccess = () => resolve(objectStoreOperationRequest.result);
      objectStoreOperationRequest.onerror = () => reject(objectStoreOperationRequest.error);
    });
  }

  async getAllRowsFrom(objectStoreData) {
    if (!this.connection) await this.init();
    return new Promise((resolve, reject) => {
      const transactionRequest = this.connection.transaction(objectStoreData.name, 'readonly');
      const objectStore = transactionRequest.objectStore(objectStoreData.name);
      const objectStoreOperationRequest = objectStore.getAll();
      objectStoreOperationRequest.onsuccess = () => resolve(objectStoreOperationRequest.result);
      objectStoreOperationRequest.onerror = () => reject(objectStoreOperationRequest.error);
    });
  }

  async countAllRowsFrom(objectStoreData) {
    if (!this.connection) await this.init();
    return new Promise((resolve, reject) => {
      const transactionRequest = this.connection.transaction(objectStoreData.name, 'readonly');
      const objectStore = transactionRequest.objectStore(objectStoreData.name);
      const objectStoreOperationRequest = objectStore.count();
      objectStoreOperationRequest.onsuccess = () => resolve(objectStoreOperationRequest.result);
      objectStoreOperationRequest.onerror = () => reject(objectStoreOperationRequest.error);
    });
  }

  async clearAllRowsFrom(objectStoreData) {
    if (!this.connection) await this.init();
    return new Promise((resolve, reject) => {
      const transactionRequest = this.connection.transaction(objectStoreData.name, 'readwrite');
      const objectStore = transactionRequest.objectStore(objectStoreData.name);
      const objectStoreOperationRequest = objectStore.clear();
      objectStoreOperationRequest.onsuccess = () => resolve(objectStoreOperationRequest.result);
      objectStoreOperationRequest.onerror = () => reject(objectStoreOperationRequest.error);
    });
  }

  async iterateOnIndexFrom(objectStoreData, indexName, callback = () => {}) {
    console.log('this.connection', this.connection);
    if (!this.connection) await this.init();
    return new Promise((resolve, reject) => {
      const transactionRequest = this.connection.transaction(objectStoreData.name, 'readwrite');
      const objectStore = transactionRequest.objectStore(objectStoreData.name);
      const objectStoreIndex = objectStore.index(indexName);
      const objectStoreOperationRequest = objectStoreIndex.openCursor();
      objectStoreOperationRequest.onsuccess = function () {
        const indexCursor = objectStoreOperationRequest.result;
        if (indexCursor) {
          const indexKey = indexCursor.key;
          const value = indexCursor.value;
          const primaryKey = indexCursor.primaryKey;
          callback(indexKey, primaryKey, value);
          indexCursor.continue();
        } else {
          resolve(true);
          console.log('Entries all displayed.');
        }
      };
      objectStoreOperationRequest.onerror = () => reject(objectStoreOperationRequest.error);
    });
  }

  //   async iterateOnValuesFrom(objectStoreData, indexName, callback = () => {}) {
  //     if (!this.connection) await this.init();
  //     return new Promise((resolve, reject) => {
  //       const transactionRequest = this.connection.transaction(objectStoreData.name, 'readwrite');
  //       const objectStore = transactionRequest.objectStore(objectStoreData.name);
  //       const objectStoreIndex = objectStore.index(indexName);
  //       const objectStoreOperationRequest = objectStoreIndex.openCursor();
  //       objectStoreOperationRequest.onsuccess = function () {
  //         const indexCursor = objectStoreOperationRequest.result;
  //         if (!indexCursor) return resolve(true);
  //         const indexKey = indexCursor.key;
  //         const value = indexCursor.value;
  //         const primaryKey = indexCursor.primaryKey;
  //         callback(indexKey, primaryKey, value);
  //         indexCursor.continue();
  //       };
  //     });
  //   }

  //
}

/* * */

const indexeddb = new INDEXEDDB();

/* * */

export default indexeddb;
