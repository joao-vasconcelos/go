const LineModel = require('../schemas/Line');

/* * */
/* CREATE LINE */
/* Explanation needed. */
/* * */

module.exports = async function updateLines() {
  //

  // SET AGENCY FOR EACH LINE;
  // 2. Try to save a new document with req.body
  //   try {
  //     const allLines = await LineModel.find();
  //     for (const line of allLines) {
  //       //   let agencyId;
  //       //   if (line.code.startsWith('1')) agencyId = '644976034212abfd6e160d1a';
  //       //   else if (line.code.startsWith('2')) agencyId = '645d7ee04ef63aec14fbf1eb';
  //       //   else if (line.code.startsWith('3')) agencyId = '645d7f114ef63aec14fbf217';
  //       //   else if (line.code.startsWith('4')) agencyId = '645d7f204ef63aec14fbf22a';
  //       //   const result = await LineModel.findOneAndUpdate({ code: line.code }, { $unset: { agencies: '' }, $set: { agency: agencyId } }, { new: true });
  //       line.name = line.long_name;
  //       line.transport_type = '3';
  //       line.circular = false;
  //       line.school = false;
  //       await line.save();
  //       //   const result = await LineModel.findOneAndReplace({ code: line.code }, line, { new: true });
  //       console.log('Updated Line', line.code); //, 'with agency_id', agencyId, 'result', result);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     return await res.status(500).json({ message: 'Cannot update all Lines.' });
  //   }

  // 2. Try to save a new document with req.body
  // Get all lines from API
  const allLinesRes = await fetch('https://schedules-test.carrismetropolitana.pt/api/lines/');
  const allLinesApi = await allLinesRes.json();

  for (const lineApi of allLinesApi) {
    await LineModel.findOneAndUpdate({ code: lineApi.code }, { name: lineApi.long_name }, { new: true });
    console.log('Updated Line', lineApi.code);
  }

  //
};
