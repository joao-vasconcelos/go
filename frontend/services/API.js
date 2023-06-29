/* * * * * */
/* FETCH CHEF POINT API */
/* * */

export default async function API(request) {
  //
  // Build the endpoint string
  let endpoint = '/api';
  if (request.service) endpoint += `/${request.service}`;
  if (request.resourceId) endpoint += `/${request.resourceId}`;
  if (request.operation) endpoint += `/${request.operation}`;

  // Build the request options
  const options = {
    method: request.method,
  };
  // If request has body, then add it to the options
  if (request.body) options.body = JSON.stringify(request.body);

  // Fetch the API with the given values
  const response = await fetch(endpoint, options);

  let parsedResponse;
  // Parse the response to JSON or BLOB
  if (!request.parseType || request.parseType === 'json') parsedResponse = await response.json();
  else if (request.parseType === 'blob') parsedResponse = await response.blob();

  // Throw an error if the response is not OK
  if (!response.ok) throw new Error(parsedResponse.message);
  // If everything is OK return the parsedResponse
  else return parsedResponse;
}
