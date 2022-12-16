import pjson from '../../package.json';

/* * */
/* GET LATEST APP VERSION */
/* Explanation needed. */
/* * */

export default async function appVersion(req, res) {
  return new Promise((resolve, reject) => {
    res.status(200).send({ latest: pjson.version });
    resolve();
  });
}
