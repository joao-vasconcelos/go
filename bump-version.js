/* * */

const fs = require('fs');

/* * */

const now = new Date();
const year = now.getFullYear();
const month = padNumber(now.getMonth() + 1);
const day = padNumber(now.getDate());
const hours = padNumber(now.getHours());
const minutes = padNumber(now.getMinutes());

const newVersion = `${year}.${month}.${day}-${hours}${minutes}`;

fs.writeFileSync('./nextjs/package.json', JSON.stringify({ ...require('./nextjs/package.json'), version: newVersion }, null, 2));
fs.writeFileSync('./slamanager-feeder/package.json', JSON.stringify({ ...require('./slamanager-feeder/package.json'), version: newVersion }, null, 2));
fs.writeFileSync('./slamanager-monitor/package.json', JSON.stringify({ ...require('./slamanager-monitor/package.json'), version: newVersion }, null, 2));
fs.writeFileSync('./slamanager-queuer/package.json', JSON.stringify({ ...require('./slamanager-queuer/package.json'), version: newVersion }, null, 2));

/* * */

function padNumber(number) {
  return number.toString().padStart(2, '0');
}
