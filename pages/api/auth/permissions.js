import delay from '../../../utils/delay';

/* * */
/* LIST ALL PERMISSIONS */
/* This endpoint return all bus stops from the mongodb. */
/* * */

export default async function permissionsList(req, res) {
  //
  await delay();

  // 0. Refuse request if not GET
  if (req.method != 'GET') {
    await res.setHeader('Allow', ['GET']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 2. Try to list all documents
  try {
    return await res.status(200).send([
      { value: 'stops_view', label: 'View Stops', group: 'Stops' },
      { value: 'stops_create', label: 'Create Stops', group: 'Stops' },
      { value: 'stops_edit', label: 'Edit Stops', group: 'Stops' },
      { value: 'stops_delete', label: 'Delete Stops', group: 'Stops' },

      { value: 'audits_view', label: 'View Audits', group: 'Audits' },
      { value: 'audits_create', label: 'Create Audits', group: 'Audits' },
      { value: 'audits_edit', label: 'Edit Audits', group: 'Audits' },
      { value: 'audits_delete', label: 'Delete Audits', group: 'Audits' },

      { value: 'surveys_view', label: 'View Surveys', group: 'Surveys' },
      { value: 'surveys_create', label: 'Create Surveys', group: 'Surveys' },
      { value: 'surveys_edit', label: 'Edit Surveys', group: 'Surveys' },
      { value: 'surveys_delete', label: 'Delete Surveys', group: 'Surveys' },

      { value: 'users_view', label: 'View Users', group: 'Users' },
      { value: 'users_create', label: 'Create Users', group: 'Users' },
      { value: 'users_edit', label: 'Edit Users', group: 'Users' },
      { value: 'users_delete', label: 'Delete Users', group: 'Users' },
    ]);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot list Permissions.' });
  }
}
