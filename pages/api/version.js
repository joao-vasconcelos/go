import pjson from '../../package.json';

/* * */
/* GET LATEST APP VERSION */
/* Explanation needed. */
/* * */

export default async function appVersion(req, res) {
  return new Promise((resolve, reject) => {
    res.statusCode = 200;
    res.send({ latest: pjson.version });
    resolve();
  });
}
