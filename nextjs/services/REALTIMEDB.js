/* * */

import { readFileSync } from 'fs';
import { createTunnel } from 'tunnel-ssh';
import { MongoClient } from 'mongodb';

/* * */

class REALTIMEDB {
  //

  constructor() {
    //
    this.sshTunnelConnecting = false;
    this.sshTunnelConnectionInstance = null;
    //
    this.mongoClientConnecting = false;
    this.mongoClientConnectionInstance = null;
    //
  }

  /* * *
   * CONNECT
   * This function sets up a MongoDB client instance with the necessary databases and collections.
   */

  async connect() {
    try {
      console.log('REALTIMEDB: New connection request...');

      //
      // Establish SSH tunnel

      await this.setupSshTunnel();

      //
      // If another connection request is already in progress, wait for it to complete

      if (this.mongoClientConnecting) {
        console.log('REALTIMEDB: Waiting for MongoDB Client connection...');
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
        readPreference: 'secondaryPreferred',
      };

      //
      // Create the client instance

      let mongoClientInstance;

      //
      // Check if there is already an active MongoDB Client connection

      if (this.mongoClientConnectionInstance) {
        mongoClientInstance = this.mongoClientConnectionInstance;
      } else if (global._mongoClientConnectionInstance) {
        mongoClientInstance = global._mongoClientConnectionInstance;
      } else {
        mongoClientInstance = await MongoClient.connect(process.env.REALTIMEDB_MONGODB_URI, mongoClientOptions);
      }

      //
      // Setup databases

      const coreManagementDatabase = mongoClientInstance.db('CoreManagement');
      const salesManagementDatabase = mongoClientInstance.db('SalesManagement');

      //
      // Setup collections

      this.VehicleEvents = coreManagementDatabase.collection('VehicleEvents');
      this.SalesEntity = salesManagementDatabase.collection('salesEntity');

      //
      // Save the instance in memory

      if (process.env.NODE_ENV === 'development') global._mongoClientConnectionInstance = mongoClientInstance;
      else this.mongoClientConnectionInstance = mongoClientInstance;

      //
      // Clear the flag

      this.mongoClientConnecting = false;

      //
    } catch (error) {
      console.error('REALTIMEDB: Error creating MongoDB Client instance:', error);
      this.mongoClientConnecting = false;
    }

    //
  }

  /* * *
   * SETUP SSH TUNNEL CONNECTION
   * This function sets up an instance of the SSH Tunnel necessary to connect to MongoDB.
   */

  async setupSshTunnel() {
    //

    //
    // If another setup request is already in progress, wait for it to complete

    if (this.sshTunnelConnecting) {
      console.log('REALTIMEDB: Waiting for SSH Tunnel connection...');
      await this.waitForSshTunnelConnection();
      return;
    }

    //
    // Check if there is already an active SSH connection

    if (this.sshTunnelConnectionInstance || global._sshTunnelConnectionInstance) {
      console.log('REALTIMEDB: SSH Tunnel already connected. Skipping...');
      return;
    }

    //
    // Try to setup a new SSH Tunnel

    try {
      //
      console.log('REALTIMEDB: Starting SSH Tunnel connection...');

      //
      // Setup the flag to prevent double connection

      this.sshTunnelConnecting = true;

      //
      // Setup the SHH Tunnel connection options

      const tunnelOptions = {
        autoClose: true,
      };

      const serverOptions = {
        port: process.env.REALTIMEDB_TUNNEL_LOCAL_PORT,
      };

      const sshOptions = {
        host: process.env.REALTIMEDB_SSH_HOST,
        port: process.env.REALTIMEDB_SSH_PORT,
        username: process.env.REALTIMEDB_SSH_USERNAME,
        privateKey: readFileSync(process.env.REALTIMEDB_SSH_KEY_PATH),
      };

      const forwardOptions = {
        srcAddr: process.env.REALTIMEDB_TUNNEL_LOCAL_HOST,
        srcPort: process.env.REALTIMEDB_TUNNEL_LOCAL_PORT,
        dstAddr: process.env.REALTIMEDB_TUNNEL_REMOTE_HOST,
        dstPort: process.env.REALTIMEDB_TUNNEL_REMOTE_PORT,
      };

      //
      // Create the SHH Tunnel connection

      const [server, client] = await createTunnel(tunnelOptions, serverOptions, sshOptions, forwardOptions);

      console.log(`REALTIMEDB: Created SSH Tunnel instance on host port ${server.address().port}`);

      if (process.env.NODE_ENV === 'development') global._sshTunnelConnectionInstance = server;
      else this.sshTunnelConnectionInstance = server;

      this.sshTunnelConnecting = false;

      //
    } catch (error) {
      console.error('REALTIMEDB: Error creating SSH Tunnel instance:', error);
      this.sshTunnelConnecting = false;
      reject(error);
    }

    //
  }

  /* * *
   * WAIT FOR AUTHENTICATION
   * Implements a mechanism that waits until authentication is complete
   */

  async waitForSshTunnelConnection() {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (!this.sshTunnelConnecting) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
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

const realtimedb = new REALTIMEDB();

/* * */

export default realtimedb;
