/* * */

class DBWRITER {
  //

  INSTANCE_NAME = 'Unnamed Instance';

  MAX_BATCH_SIZE = 3000;

  DB_COLLECTION = null;

  CURRENT_BATCH_DATA = [];

  /* * */

  constructor(instanceName, collection, options = {}) {
    if (instanceName) this.INSTANCE_NAME = instanceName;
    if (collection) this.DB_COLLECTION = collection;
    if (options.batch_size) this.MAX_BATCH_SIZE = options.batch_size;
  }

  /* * */

  async write(data) {
    // Check if the batch is full
    if (this.CURRENT_BATCH_DATA.length >= this.MAX_BATCH_SIZE) {
      await this.flush();
    }
    // Add the data to the batch
    if (Array.isArray(data)) {
      this.CURRENT_BATCH_DATA = [...this.CURRENT_BATCH_DATA, ...data];
    } else {
      this.CURRENT_BATCH_DATA.push(data);
    }
    //
  }

  /* * */

  async flush() {
    try {
      //

      console.log(`→ DBWRITER [${this.INSTANCE_NAME}]: Flush Request | Length: ${this.CURRENT_BATCH_DATA.length} | DB Collection: ${this.DB_COLLECTION.collectionName}`);

      if (this.CURRENT_BATCH_DATA.length === 0) return;

      const writeOperations = [];

      for (const dataObj of this.CURRENT_BATCH_DATA) {
        const operation = {
          replaceOne: {
            filter: { code: dataObj.code },
            replacement: dataObj,
            upsert: true,
          },
        };
        writeOperations.push(operation);
      }

      await this.DB_COLLECTION.bulkWrite(writeOperations);

      this.CURRENT_BATCH_DATA = [];

      //
    } catch (error) {
      console.log(`✖︎ Error at DBWRITER.flush(): ${error.message}`);
    }
  }
}

module.exports = DBWRITER;
