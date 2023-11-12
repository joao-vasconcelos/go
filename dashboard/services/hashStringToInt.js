/* * */

const crypto = require('crypto');

/* * */

export default function hashStringToInt(string, modulo = 1000) {
  const hash = crypto.createHash('sha256').update(string).digest('hex');
  const hashInt = BigInt(`0x${hash}`);
  return Number(hashInt % BigInt(modulo));
}
