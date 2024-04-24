/* * */

import mongoose from 'mongoose';

/* * */

async function connect() {
  await mongoose
    .set('strictQuery', false)
    .connect(process.env.GODB_MONGODB_URI)
    // .then(() => console.log('Connected.'))
    .catch((error) => {
      console.log('Connection to GODB failed.');
      console.log('At database.js > mongoose.connect()');
      console.log(error);
      process.exit();
    });
}

async function disconnect() {
  await mongoose
    .disconnect()
    // .then(() => console.log('Disconnected from GODB.'))
    .catch((error) => {
      console.log('Failed closing connection to GODB.');
      console.log('At database.js > mongoose.disconnect()');
      console.log(error);
    });
}

/* * */

const godb = {
  connect,
  disconnect,
};

/* * */

export default godb;
