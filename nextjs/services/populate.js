/* * */

export function populate(template, data) {
  //

  // Create a deep copy of the template object
  const copyOfTemplateObject = JSON.parse(JSON.stringify(template));

  // Return the template if there is no data
  if (!data) return copyOfTemplateObject;

  // Recursive helper function to populate the object
  function populateTemplateObject(templateObject, dataObject) {
    //

    // For each key in the template object
    for (const key in templateObject) {
      //

      console.log(key, typeof templateObject[key]);

      //
      if (dataObject?.hasOwnProperty(key)) {
        //

        // If both the template and data are arrays
        if (Array.isArray(templateObject[key]) && Array.isArray(dataObject[key]) && templateObject[key].length === 0) {
          templateObject[key] = dataObject[key]; // Assign array directly from data object

          //
        } else if (typeof templateObject[key] === 'object' /* && typeof data[key] === 'object' /* <-- ATENTION HERE */) {
          // } else if (typeof obj[key] === 'object' && typeof data[key] === 'object' /* <-- ATENTION HERE */) {
          //   populateTemplateObject(templateObject[key], dataObject[key]); // Recursively populate nested objects
          //
        } else {
          templateObject[key] = dataObject[key]; // Assign value from data object
        }

        //
      } else {
        templateObject[key] = null; // Assign null if the key is not found in data object
      }
    }

    return templateObject;
  }

  populateTemplateObject(copyOfTemplateObject, data); // Populate the object with data

  return copyOfTemplateObject;

  //
}

/* * */

export default function populate_new(template, data) {
  //

  // Return the template if there is no data
  if (!data) return template;

  // Create a deep copy of the template object
  const populatedTemplateObject = JSON.parse(JSON.stringify(template));

  // Setup a recursive function to populate the template
  const recursivePopulate = (currentTemplateStep, currentDataStep) => {
    //

    if (typeof currentTemplateStep === 'object' && currentTemplateStep !== null) {
      if (Array.isArray(currentTemplateStep) && Array.isArray(currentDataStep)) {
        // If obj is an array, populate each element recursively
        return currentDataStep?.map((item) => recursivePopulate(currentTemplateStep, item));
      } else if (typeof currentTemplateStep === 'object' && typeof currentDataStep === 'object') {
        // If obj is an object, recursively populate its properties
        const result = {};
        for (const key in currentTemplateStep) {
          result[key] = recursivePopulate(currentTemplateStep[key], currentDataStep[key]);
        }
        return result;
      } else {
        return currentDataStep;
      }
    } else {
      //   console.log(currentDataStep);
      // If obj is not an object or null, use value from source
      return currentDataStep;
    }

    //
  };

  // Initiate the recursive dance
  return recursivePopulate(populatedTemplateObject, data);

  // Return the populated template
  return populatedTemplateObject;

  //
}
