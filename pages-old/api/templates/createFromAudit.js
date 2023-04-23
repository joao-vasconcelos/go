import delay from '../../../services/delay';
import mongodb from '../../../services/mongodb';
import { Model as AuditModel } from '../../../schemas/Audit';
import { Model as TemplateModel } from '../../../schemas/Template';

/* * */
/* API > TEMPLATES > CREATE FROM AUDIT */
/* This endpoint returns all templates from MongoDB. */
/* * */

export default async function templatesCreatFromAudit(req, res) {
  //
  await delay();

  // 0. Refuse request if not POST
  if (req.method != 'POST') {
    await res.setHeader('Allow', ['POST']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 1. Try to parse req.body
  try {
    req.body = await JSON.parse(req.body);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'JSON parse error.' });
  }

  // 2. Try to connect to mongodb
  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 3. Copy template schema from given audit
  try {
    const providedAudit = await AuditModel.findById(req.body.audit_id);
    req.body = providedAudit.template;
    delete req.body._id;
    req.body.isActive = false;
    req.body.title = `${req.body.title} (copiado de ${providedAudit.unique_code})`;
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot create new Model based on selected Audit.' });
  }

  // 4. Try to save a new document with req.body
  try {
    const createdDocument = await TemplateModel(req.body).save();
    return await res.status(201).json(createdDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot create Template.' });
  }
}