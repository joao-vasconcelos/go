/* * */
/* GET DAY TYPE FOR DATE */
/* Return 1, 2 or 3 for a given date */
export default function calculateDateDayType(dateString, isHoliday) {
  // Return 3 immediately if it is a holiday
  if (isHoliday) return 3;
  // Create a dayjs object
  const dateObj = dayjs(dateString, 'YYYYMMDD');
  // Get the weekday using dayjs
  const dayOfWeek = dateObj.day();
  // If it Weekday
  if (dayOfWeek >= 1 && dayOfWeek <= 5) return 1;
  // Saturday
  else if (dayOfWeek === 6) return 2;
  // Sunday
  else return 3;
  //
}
