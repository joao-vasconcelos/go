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
	if (request.body && request.bodyType === 'raw') options.body = request.body;
	else if (request.body) options.body = JSON.stringify(request.body);

	// Fetch the API with the given values
	const response = await fetch(endpoint, options);

	// Throw an error if the response is not OK
	if (!response.ok) {
		// Parse the error message from JSON
		const jsonErrorMessage = await response.json();
		// Throw the error to be caught by the caller component
		throw new Error(jsonErrorMessage.message);
	}

	// Parse the response to JSON, BLOB or RAW
	if (!request.parseType || request.parseType === 'json') return await response.json();
	else if (request.parseType === 'blob') return await response.blob();
	else if (request.parseType === 'raw') return response;
	else throw new Error(`Unknown API parseType for ${endpoint}`);

	//
}
