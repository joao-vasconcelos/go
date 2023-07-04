export default function populate(defaultObj, dataObj) {
  //

  // Create a deep copy of the default object
  const newObj = JSON.parse(JSON.stringify(defaultObj));

  // Return default if there is no data
  if (!dataObj) return newObj;

  // Recursive helper function to populate the object
  function populateObject(obj, data) {
    for (const key in obj) {
      if (data.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object' && typeof data[key] === 'object') {
          populateObject(obj[key], data[key]); // Recursively populate nested objects
        } else {
          obj[key] = data[key]; // Assign value from data object
        }
      }
    }
  }

  populateObject(newObj, dataObj); // Populate the object with data

  return newObj;

  //
}
