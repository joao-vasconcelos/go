/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { AlertModel } from '@/schemas/Alert/model';
import { MunicipalityModel } from '@/schemas/Municipality/model';
import { LineModel } from '@/schemas/Line/model';
import { StopModel } from '@/schemas/Stop/model';

/* * */

export default async function handler(req, res) {
	//

	throw new Error('Feature is disabled.');

	// 1.
	// Setup variables

	let sessionData;

	// 2.
	// Get session data

	try {
		sessionData = await getSession(req, res);
	} catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not get Session data. Are you logged in?' });
	}

	// 3.
	// Prepare endpoint

	try {
		await prepareApiEndpoint({ request: req, method: 'GET', session: sessionData, permissions: [{ scope: 'configs', action: 'admin' }] });
	} catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	// 4.
	// Connect to mongodb

	try {
		//

		// Fetch all Stops from API v2
		const allAlertsResponse = await fetch('https://www.carrismetropolitana.pt/?api=alerts');
		const allAlertsData = await allAlertsResponse.json();

		for (const entity of allAlertsData.entity) {
			//

			const alertData = entity.alert;

			//
			// MUNICIPALITIES
			const informedMunicipalityIds = new Set;
			const informedMunicipalityPrefixes = alertData.informed_entity.filter((item) => Object.keys(item)[0] === 'municipality_id');
			for (const municipalityEntity of informedMunicipalityPrefixes) {
				const municipalityDocument = await MunicipalityModel.findOne({ prefix: municipalityEntity.municipality_id });
				if (municipalityDocument) informedMunicipalityIds.add(municipalityDocument._id.toString());
			}

			//
			// LINES
			const informedLineIds = new Set;
			const informedRouteCodes = alertData.informed_entity.filter((item) => Object.keys(item)[0] === 'route_id');
			for (const routeEntity of informedRouteCodes) {
				const lineDocument = await LineModel.findOne({ code: routeEntity.route_id.substring(0, 4) });
				if (lineDocument) informedLineIds.add(lineDocument._id.toString());
			}

			//
			// STOPS
			const informedStopIds = new Set;
			const informedStopCodes = alertData.informed_entity.filter((item) => Object.keys(item)[0] === 'stop_id');
			for (const stopEntity of informedStopCodes) {
				const stopDocument = await StopModel.findOne({ code: stopEntity.stop_id });
				if (stopDocument) informedStopIds.add(stopDocument._id.toString());
			}

			// Format stop to match GO schema
			const formattedAlert = {
				// General
				code: entity.id,
				published: true,
				title: alertData.header_text[0].translation.text,
				active_period_start: alertData.active_period.start < 0 ? null : new Date(alertData.active_period.start * 1000),
				active_period_end: alertData.active_period.end < 0 ? null : new Date(alertData.active_period.end * 1000),
				municipalities: Array.from(informedMunicipalityIds),
				lines: Array.from(informedLineIds),
				stops: Array.from(informedStopIds),
				cause: alertData.cause,
				effect: alertData.effect,
				description: alertData.description_text[0].translation.text,
				images: [],
				url: alertData.url,
				created_by: undefined,
			};

			await AlertModel.findOneAndUpdate({ code: formattedAlert.code }, formattedAlert, { new: true, upsert: true });

			console.log(`Updated Alert ${formattedAlert.code}.`);
		}
	} catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Import Error' });
	}

	console.log('Done. Sending response to client...');
	return await res.status(200).json('Import complete.');

	//
}