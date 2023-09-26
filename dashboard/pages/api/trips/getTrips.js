import delay from '@/services/delay';
import PCGIAPI from '@/services/PCGIAPI';
import checkAuthentication from '@/services/checkAuthentication';

/* * */
/* LIST ALL TYPOLOGY */
/* This endpoint returns all typologies. */
/* * */

export default async function handler(req, res) {
  //
  await delay();

  // 0.
  // Refuse request if not GET

  if (req.method != 'GET') {
    await res.setHeader('Allow', ['GET']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 1.
  // Check for correct Authentication and valid Permissions

  try {
    await checkAuthentication({ scope: 'typologies', permission: 'view', req, res });
  } catch (err) {
    console.log(err);
    return await res.status(401).json({ message: err.message || 'Could not verify Authentication.' });
  }

  // 3.
  // List all documents

  try {
    const allTrips = await PCGIAPI.request('opcoremanager/dayTrips/trips-rt');
    return await res.status(200).send(allTrips);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot list Trips.' });
  }
}
