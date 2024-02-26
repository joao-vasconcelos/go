/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import fs from 'fs';
import AdmZip from 'adm-zip';
import { ExportDefault } from '@/schemas/Export/default';
import { ExportModel } from '@/schemas/Export/model';
import { AgencyModel } from '@/schemas/Agency/model';
import { ExportOptions } from '@/schemas/Export/options';
import exportGtfsV29 from '@/scripts/exports/gtfs.v29';
import exportNetexV1 from '@/scripts/exports/netex.v1';
import SMTP from '@/services/SMTP';
import util from 'util';

/* * */

export default async function handler(req, res) {
  //

  // 1.
  // Setup variables

  let sessionData;
  let agencyData;
  let exportSummary;

  // 2.
  // Parse request body into JSON

  try {
    req.body = await JSON.parse(req.body);
  } catch (err) {
    console.log('error1', err);
    return await res.status(500).json({ message: 'JSON parse error.' });
  }

  // 3.
  // Get session data

  try {
    sessionData = await getSession(req, res);
  } catch (err) {
    console.log('error2', err);
    return await res.status(400).json({ message: err.message || 'Could not get Session data. Are you logged in?' });
  }

  // 4.
  // Prepare endpoint

  try {
    await prepareApiEndpoint({
      request: req,
      method: 'POST',
      session: sessionData,
      permissions: [
        {
          scope: 'exports',
          action: 'create',
          fields: [
            { key: 'agencies', values: [req.body.agency_id] },
            { key: 'export_types', values: [req.body.export_type] },
          ],
        },
      ],
    });
  } catch (err) {
    console.log('error3', err);
    return await res.status(400).json({ message: err.message || 'Could not prepare endpoint.' });
  }

  // 5.
  // Ensure latest schema modifications
  // in the schema are applied in the database.

  try {
    await ExportModel.syncIndexes();
  } catch (err) {
    console.log('error4', err);
    return await res.status(500).json({ message: 'Cannot sync indexes.' });
  }

  // 6.
  // Fetch Agency information for the current request.

  try {
    agencyData = await AgencyModel.findOne({ _id: { $eq: req.body.agency_id } });
    if (!agencyData) return await res.status(404).json({ message: 'Could not find requested Agency.' });
  } catch (err) {
    console.log('error5', err);
    return await res.status(500).json({ message: 'Error fetching Agency data.' });
  }

  // 7.
  // Create a new Export summary document.
  // This will be used to keep track of progress
  // and allows the client to download the resulting file at a later date.

  try {
    //
    // 7.1.
    // Create the Export document
    // This will generate a new _id for the operation.
    exportSummary = new ExportModel(ExportDefault);

    // 7.2.
    // Check if the requested export type exists in the options.
    // Otherwise cancel the current export and return 403 to the client
    if (ExportOptions.export_type.includes(req.body.export_type)) exportSummary.type = req.body.export_type;
    else return await res.status(403).json({ message: 'Unknown requested export type.' });

    // 7.3.
    // Associate this export to the use who requested it
    exportSummary.exported_by = sessionData.user._id;
    exportSummary.notify_user = req.body.notify_user ? true : false;

    // 7.4.
    // Define the filename format for the resulting archive
    switch (exportSummary.type) {
      // 7.4.1.
      // For v29 the name consists of the agency code, the version and the export date.
      case 'gtfs_v29':
        exportSummary.filename = `GTFS_${agencyData.code}_REF_v29_${today()}.zip`;
        break;
      // 7.4.2.
      // For v30 the name consists of the agency code, the version and the export date.
      case 'netex_v1':
        exportSummary.filename = `NETEX_${agencyData.code}_v1_${today()}.zip`;
        break;
    }

    // 7.5.
    // Save the path to the resulting file
    exportSummary.workdir = getWorkdir(exportSummary._id);

    // 7.6.
    // Save the export document
    await exportSummary.save();

    // 7.7.
    // Send the summary information to the client
    // and close the connection.
    await res.status(201).json(exportSummary);

    //
  } catch (err) {
    console.log('error6', err);
    return await res.status(500).json({ message: 'Could not create Export summary.' });
  }

  // 8.
  // Even though the server has already sent a response to the client,
  // start building the export file and keep track of progress.
  // From here on, errors must be tracked with the database
  // to keep the client informed about the operation status

  try {
    //
    // 8.1.
    // Update progress to indicate the two main tasks at hand
    await update(exportSummary, { progress_current: 0, progress_total: 2 });

    // 8.2.
    // Initiate the export options object with data from the client
    const exportOptions = {
      lines_included: req.body.lines_included || [],
      lines_excluded: req.body.lines_excluded || [],
      feed_start_date: req.body.feed_start_date,
      feed_end_date: req.body.feed_end_date,
      clip_calendars: req.body.clip_calendars ? true : false,
      calendars_clip_start_date: req.body.calendars_clip_start_date,
      calendars_clip_end_date: req.body.calendars_clip_end_date,
      numeric_calendar_codes: req.body.numeric_calendar_codes ? true : false,
      stop_sequence_start: req.body.stop_sequence_start,
    };

    // 8.3.
    // Initiate the main export operation
    switch (exportSummary.type) {
      // 8.3.1.
      // Build GTFS v29
      case 'gtfs_v29':
        await exportGtfsV29(exportSummary, agencyData, exportOptions);
        await update(exportSummary, { progress_current: 1, progress_total: 2 });
        break;
      // 8.3.2.
      // Build NETEX v1
      case 'netex_v1':
        await exportNetexV1(exportSummary, agencyData, exportOptions);
        await update(exportSummary, { progress_current: 1, progress_total: 2 });
        break;
    }

    // 8.4.
    // Zip the workdir folder that contains the generated files.
    // Name the resulting archive with the _id of this Export.
    const outputZip = new AdmZip();
    outputZip.addLocalFolder(exportSummary.workdir);
    outputZip.writeZip(`${exportSummary.workdir}/${exportSummary._id}.zip`);
    await update(exportSummary, { progress_current: 2, progress_total: 2 });

    // 8.5.
    // Update progress to indicate the requested operation is complete
    await update(exportSummary, { status: 'COMPLETED' });

    // 8.6.
    // Send an email to the user using the email address of the user who requested the export.
    if (exportSummary.notify_user && sessionData.user?.email) {
      await SMTP.sendMail({
        from: process.env.EMAIL_FROM,
        to: sessionData.user.email,
        subject: '✅ Exportação Concluída',
        html: `Por favor verifique o ficheiro em anexo. A exportação também está disponível no GO durante as próximas 4 horas. <pre>${exportSummary}</pre>`,
        attachments: [{ filename: exportSummary.filename, content: outputZip.toBuffer(), contentType: 'application/zip' }],
      });
    }

    //
  } catch (err) {
    console.log('error7', err.message);
    console.dir(err.message);
    await update(exportSummary, { status: 'ERROR' });
    if (exportSummary.notify_user && sessionData.user?.email) {
      await SMTP.sendMail({
        from: process.env.EMAIL_FROM,
        to: sessionData.user.email,
        subject: '❤️‍🩹 Ocorreu um erro na Exportação',
        html: `Infelizmente ocorreu um erro na exportação. A mensagem de erro foi: <pre>${err.message}</pre> As opções de exportação foram: <pre>${exportSummary}</pre>`,
      });
    }
  }

  //
}

//
//
//
//

/* * */
/* UPDATE PROGRESS */
/* Fetch the database for the given agency_id. */
async function update(exportDocument, updates) {
  await ExportModel.updateOne({ _id: exportDocument._id }, updates);
}

//
//
//
//

/* * */
/* PROVIDE TEMP DIRECTORY PATH */
/* Return the path for the temporary directory based on current environment. */
function getWorkdir(exportId) {
  // Use the 'tmp' folder as the working directory
  const workdir = `${process.env.PWD}/exports/${exportId}`;
  // Out of an abundance of caution, delete the directory and all its contents if it already exists
  if (fs.existsSync(workdir)) fs.rmSync(workdir, { recursive: true, force: true });
  // Create a fresh empty directory in the given path
  fs.mkdirSync(workdir, { recursive: true });
  // Return workdir to the caller
  return workdir;
  //
}

//
//
//
//

/* * */
/* POST TODAY AS STRING */
/* Output the current date and time in the format YYYYMMDDHHMM. */
/* For example, if the current date is July 3, 2023, at 9:30 AM, the output will be 202307030930. */
function today() {
  var currentDate = new Date();
  var year = currentDate.getFullYear();
  var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  var day = currentDate.getDate().toString().padStart(2, '0');
  var hours = currentDate.getHours().toString().padStart(2, '0');
  var minutes = currentDate.getMinutes().toString().padStart(2, '0');

  return year + month + day + hours + minutes;
}
