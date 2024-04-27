/* * */

const { MongoClient } = require('mongodb');

/* * */

const MAX_CONNECTION_RETRIES = 1;

/* * */

class SLAMANAGERDB {
  //

  constructor() {
    //
    this.mongoClientConnecting = false;
    this.mongoClientConnectionRetries = 0;
    this.mongoClientConnectionInstance = null;
    //
  }

  /* * *
   * CONNECT
   * This function sets up a MongoDB client instance with the necessary databases and collections.
   */

  async connect() {
    try {
      console.log('→ SLAMANAGERDB: New connection request...');

      //
      // If another connection request is already in progress, wait for it to complete

      if (this.mongoClientConnecting) {
        console.log('→ SLAMANAGERDB: Waiting for MongoDB Client connection...');
        await this.waitForMongoClientConnection();
        return;
      }

      //
      // Setup the flag to prevent double connection

      this.mongoClientConnecting = true;

      //
      // Setup MongoDB connection options

      const mongoClientOptions = {
        minPoolSize: 2,
        maxPoolSize: 200,
        directConnection: true,
        // readPreference: 'secondaryPreferred',
        connectTimeoutMS: 5000,
        serverSelectionTimeoutMS: 5000,
      };

      //
      // Create the client instance

      let mongoClientInstance;

      //
      // Check if there is already an active MongoDB Client connection

      if (this.mongoClientConnectionInstance && this.mongoClientConnectionInstance.topology && this.mongoClientConnectionInstance.topology.isConnected()) {
        mongoClientInstance = this.mongoClientConnectionInstance;
      } else if (global._mongoClientConnectionInstance && global._mongoClientConnectionInstance.topology && global._mongoClientConnectionInstance.topology.isConnected()) {
        mongoClientInstance = global._mongoClientConnectionInstance;
      } else {
        mongoClientInstance = await MongoClient.connect(process.env.SLAMANAGERDB_MONGODB_URI, mongoClientOptions);
      }

      //
      // Setup databases

      const productionDatabase = mongoClientInstance.db('production');

      //
      // Setup collections

      this.UniqueTrip = productionDatabase.collection('UniqueTrip');
      this.UniqueShape = productionDatabase.collection('UniqueShape');
      this.TripAnalysis = productionDatabase.collection('TripAnalysis');

      //
      // Setup indexes

      this.UniqueTrip.createIndex({ code: 1 }, { unique: true });
      this.UniqueTrip.createIndex({ agency_id: 1 });
      this.UniqueTrip.createIndex({ line_id: 1 });
      this.UniqueTrip.createIndex({ route_id: 1 });
      this.UniqueTrip.createIndex({ pattern_id: 1 });
      this.UniqueTrip.createIndex({ service_id: 1 });
      this.UniqueTrip.createIndex({ trip_id: 1 });

      this.UniqueShape.createIndex({ code: 1 }, { unique: true });
      this.UniqueShape.createIndex({ agency_id: 1 });
      this.UniqueShape.createIndex({ shape_id: 1 });

      this.TripAnalysis.createIndex({ code: 1 }, { unique: true });
      this.TripAnalysis.createIndex({ status: 1 });
      this.TripAnalysis.createIndex({ operational_day: 1 });
      this.TripAnalysis.createIndex({ agency_id: 1 });
      this.TripAnalysis.createIndex({ plan_id: 1 });
      this.TripAnalysis.createIndex({ trip_id: 1 });
      this.TripAnalysis.createIndex({ operational_day: 1, trip_id: 1 });

      //
      // Save the instance in memory

      if (process.env.NODE_ENV === 'development') global._mongoClientConnectionInstance = mongoClientInstance;
      else this.mongoClientConnectionInstance = mongoClientInstance;

      //
      // Reset flags

      this.mongoClientConnecting = false;
      this.mongoClientConnectionRetries = 0;

      //
    } catch (error) {
      this.mongoClientConnectionRetries++;
      if (this.mongoClientConnectionRetries < MAX_CONNECTION_RETRIES) {
        console.error(`✖︎ SLAMANAGERDB: Error creating MongoDB Client instance ["${error.message}"]. Retrying (${this.mongoClientConnectionRetries}/${MAX_CONNECTION_RETRIES})...`);
        await this.reset();
        await this.connect();
      } else {
        console.error('✖︎ SLAMANAGERDB: Error creating MongoDB Client instance:', error);
        await this.reset();
      }
    }

    //
  }

  /* * *
   * RESET CONNECTIONS
   * Resets all connections and flags
   */

  async reset() {
    this.mongoClientConnecting = false;
    this.mongoClientConnectionInstance = null;
    global._mongoClientConnectionInstance = null;
    console.log('→ SLAMANAGERDB: Reset connection.');
  }

  async waitForMongoClientConnection() {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (!this.mongoClientConnecting) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  //
}

/* * */

module.exports = new SLAMANAGERDB();
