/* * * * * */
/* CODE GENERATOR */
/* * */

export default function generateRandomString(length) {
  //

  const allowedCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  let result = '';

  for (let i = 0; i < length; i++) {
    result += allowedCharacters.charAt(Math.floor(Math.random() * allowedCharacters.length));
  }

  return result;
}
