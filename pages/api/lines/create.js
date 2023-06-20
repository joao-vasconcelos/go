import delay from '../../../services/delay';
import mongodb from '../../../services/mongodb';
import { Default as LineDefault } from '../../../schemas/Line/default';
import { Model as LineModel } from '../../../schemas/Line/model';

/* * */
/* CREATE LINE */
/* Explanation needed. */
/* * */

export default async function linesCreate(req, res) {
  //
  await delay();

  // 0. Refuse request if not GET
  if (req.method != 'GET') {
    await res.setHeader('Allow', ['GET']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 1. Try to connect to mongodb
  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 2. Try to save a new document with req.body
  try {
    const allLines = await LineModel.find();
    for (const line of allLines) {
      //   let agencyId;
      //   if (line.code.startsWith('1')) agencyId = '644976034212abfd6e160d1a';
      //   else if (line.code.startsWith('2')) agencyId = '645d7ee04ef63aec14fbf1eb';
      //   else if (line.code.startsWith('3')) agencyId = '645d7f114ef63aec14fbf217';
      //   else if (line.code.startsWith('4')) agencyId = '645d7f204ef63aec14fbf22a';
      //   const result = await LineModel.findOneAndUpdate({ code: line.code }, { $unset: { agencies: '' }, $set: { agency: agencyId } }, { new: true });
      line.name = line.long_name;
      line.transport_type = '3';
      line.circular = false;
      line.school = false;
      await line.save();
      //   const result = await LineModel.findOneAndReplace({ code: line.code }, line, { new: true });
      console.log('Updated Line', line.code); //, 'with agency_id', agencyId, 'result', result);
    }
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot update all Lines.' });
  }

  // 2. Try to save a new document with req.body
  try {
    const createdDocument = await LineModel(LineDefault).save();
    return await res.status(201).json(createdDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot create this Line.' });
  }
}
