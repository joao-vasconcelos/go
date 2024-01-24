/* * */

import { readFileSync } from 'fs';
import { createTunnel } from 'tunnel-ssh';
import { MongoClient, ObjectId } from 'mongodb';

/* * */

class REALTIMEDB {
  //

  constructor() {
    this.tunnelOptions = {
      autoClose: true,
    };
    this.serverOptions = {
      port: process.env.REALTIMEDB_TUNNEL_LOCAL_PORT,
    };
    this.sshOptions = {
      host: process.env.REALTIMEDB_SSH_HOST,
      port: process.env.REALTIMEDB_SSH_PORT,
      username: process.env.REALTIMEDB_SSH_USERNAME,
      privateKey: readFileSync(process.env.REALTIMEDB_SSH_KEY_PATH),
    };
    this.forwardOptions = {
      srcAddr: process.env.REALTIMEDB_TUNNEL_LOCAL_HOST,
      srcPort: process.env.REALTIMEDB_TUNNEL_LOCAL_PORT,
      dstAddr: process.env.REALTIMEDB_TUNNEL_REMOTE_HOST,
      dstPort: process.env.REALTIMEDB_TUNNEL_REMOTE_PORT,
    };
  }

  async connect() {
    try {
      // Establish SSH tunnel
      const [server, conn] = await createTunnel(this.tunnelOptions, this.serverOptions, this.sshOptions, this.forwardOptions);

      // MongoDB connection
      this.client = new MongoClient(process.env.REALTIMEDB_MONGODB_URI, {
        minPoolSize: 2,
        maxPoolSize: 200,
        // serverSelectionTimeoutMS: 5000,
        family: 4,
        // directConnection: true,
      });

      await this.client.connect(); // Wait for MongoDB connection
      this.CoreManagement = this.client.db('CoreManagement');
      this.VehicleEvents = this.CoreManagement.collection('VehicleEvents');
    } catch (error) {
      console.error('Error initializing REALTIMEDB:', error);
    }
  }
  toObjectId(string) {
    return new ObjectId(string);
  }
}

const realtimeDB = new REALTIMEDB();

export default realtimeDB;
