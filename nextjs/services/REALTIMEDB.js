/* * */

import { readFileSync } from 'fs';
import { createTunnel } from 'tunnel-ssh';
import { MongoClient, ObjectId } from 'mongodb';

/* * */

class REALTIMEDB {
  //

  isTunnelConnected = false;

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

  async setupSshTunnel() {
    try {
      // Check if tunnel is already connected
      if (this.isTunnelConnected) return;
      // Setup the tunnel connection
      const [server, conn] = await createTunnel(this.tunnelOptions, this.serverOptions, this.sshOptions, this.forwardOptions);
      this.tunnelConnection = conn;
      this.tunnelServer = server;
      // Change the flag if the connection closes
      server.on('close', this.closeSshTunnel);
      server.on('drop', this.closeSshTunnel);
      server.on('error', this.closeSshTunnel);
      conn.on('close', this.closeSshTunnel);
      conn.on('end', this.closeSshTunnel);
      conn.on('error', this.closeSshTunnel);
      //
      conn.on('ready', () => (this.isTunnelConnected = true));
      //
    } catch (error) {
      this.closeSshTunnel();
      console.error('Error connecting to REALTIMEDB (SSH Tunnel):', error);
    }
  }

  async closeSshTunnel() {
    try {
      this.isTunnelConnected = false;
      if (this.tunnelConnection) this.tunnelConnection.end();
      //
    } catch (error) {
      console.error('Error disconnecting from REALTIMEDB (SSH Tunnel):', error);
    }
  }

  async connect() {
    try {
      // Establish SSH tunnel
      await this.setupSshTunnel();
      // Setup MongoDB connection
      this.client = new MongoClient(process.env.REALTIMEDB_MONGODB_URI, {
        minPoolSize: 2,
        maxPoolSize: 200,
        directConnection: true,
      });
      // Connect to MongoDB client
      await this.client.connect();
      // Setup databases
      this.CoreManagement = this.client.db('CoreManagement');
      this.SiitIntegrator = this.client.db('SiitIntegrator');
      // Setup collections
      this.VehicleEvents = this.CoreManagement.collection('VehicleEvents');
      this.validationTransactionEntity = this.SiitIntegrator.collection('validationTransactionEntity');
      //
    } catch (error) {
      console.error('Error connecting to REALTIMEDB (MongoDB):', error);
    }
  }

  toObjectId(string) {
    return new ObjectId(string);
  }

  //
}

/* * */

const realtimedb = new REALTIMEDB();

/* * */

export default realtimedb;
