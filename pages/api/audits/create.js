import delay from '../../../services/delay';
import mongodb from '../../../services/mongodb';
import generator from '../../../services/generator';
import { Model as AuditModel } from '../../../schemas/Audit';
import { Model as TemplateModel } from '../../../schemas/Template';

/* * */
/* CREATE AUDIT */
/* Explanation needed. */
/* * */

export default async function auditsCreate(req, res) {
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

  // 3. Check for uniqueness
  try {
    // The values that need to be unique are ['unique_code'].
    let uniqueCodeIsNotUnique = true;
    while (uniqueCodeIsNotUnique) {
      req.body.unique_code = generator(6, 'alphanumeric'); // Generate a new code with 6 characters
      uniqueCodeIsNotUnique = await AuditModel.exists({ unique_code: req.body.unique_code });
    }
  } catch (err) {
    console.log(err);
    await res.status(409).json({ message: err.message });
    return;
  }

  // 4. Pre-set properties based on the associated template schema
  try {
    const associatedTemplate = await TemplateModel.findById(req.body.template._id);
    req.body.template = associatedTemplate;
    req.body.properties = {};
    for (const section of associatedTemplate.sections) {
      req.body.properties[section.key] = {};
      for (const field of section.fields) {
        req.body.properties[section.key][field.key] = '';
      }
    }
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot configure this Audit with selected Template.' });
  }

  // 5. Try to save a new document with req.body
  try {
    const createdDocument = await AuditModel(req.body).save();
    return await res.status(201).json(createdDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot create this Audit.' });
  }
}
