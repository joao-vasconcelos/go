export default function parseDate(date, returnType = 'string') {
  //
  if (!date) return null;

  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  //
  const dateString = `${year}${month}${day}`;
  //
  if (returnType === 'int') return parseInt(dateString);
  else return dateString;
  //
}
