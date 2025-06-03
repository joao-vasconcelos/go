/* * */

import { AgencyModel } from '@/schemas/Agency/model';
import { ExportModel } from '@/schemas/Export/model';
import CSVWRITER from '@/services/CSVWRITER';
import { rides } from '@tmlmobilidade/interfaces';
import { Ride } from '@tmlmobilidade/types';

/* * */

async function update(exportDocument, updates) {
	try {
		await ExportModel.updateOne({ _id: exportDocument._id }, updates);
	}
	catch (error) {
		console.log(`Error at update(${exportDocument}, ${updates})`, error);
		throw new Error(`Error at update(${exportDocument}, ${updates})`);
	}
}

/* * */

interface RideReport {
	'_id': string
	'agency_id': string
	'AT_LEAST_ONE_EVENT_ON_FIRST_STOP-grade': (NonNullable<Ride['analysis']>['AT_LEAST_ONE_EVENT_ON_FIRST_STOP']['grade']) | null
	'AT_LEAST_ONE_EVENT_ON_FIRST_STOP-message': (NonNullable<Ride['analysis']>['AT_LEAST_ONE_EVENT_ON_FIRST_STOP']['message']) | null
	'AT_LEAST_ONE_EVENT_ON_FIRST_STOP-reason': (NonNullable<Ride['analysis']>['AT_LEAST_ONE_EVENT_ON_FIRST_STOP']['reason']) | null
	'AT_LEAST_ONE_EVENT_ON_FIRST_STOP-unit': (NonNullable<Ride['analysis']>['AT_LEAST_ONE_EVENT_ON_FIRST_STOP']['unit']) | null
	'AT_LEAST_ONE_EVENT_ON_FIRST_STOP-value': (NonNullable<Ride['analysis']>['AT_LEAST_ONE_EVENT_ON_FIRST_STOP']['value']) | null
	'AT_MOST_TWO_DRIVER_IDS-grade': (NonNullable<Ride['analysis']>['AT_MOST_TWO_DRIVER_IDS']['grade']) | null
	'AT_MOST_TWO_DRIVER_IDS-message': (NonNullable<Ride['analysis']>['AT_MOST_TWO_DRIVER_IDS']['message']) | null
	'AT_MOST_TWO_DRIVER_IDS-reason': (NonNullable<Ride['analysis']>['AT_MOST_TWO_DRIVER_IDS']['reason']) | null
	'AT_MOST_TWO_DRIVER_IDS-unit': (NonNullable<Ride['analysis']>['AT_MOST_TWO_DRIVER_IDS']['unit']) | null
	'AT_MOST_TWO_DRIVER_IDS-value': (NonNullable<Ride['analysis']>['AT_MOST_TWO_DRIVER_IDS']['value']) | null
	'AT_MOST_TWO_VEHICLE_IDS-grade': (NonNullable<Ride['analysis']>['AT_MOST_TWO_VEHICLE_IDS']['grade']) | null
	'AT_MOST_TWO_VEHICLE_IDS-message': (NonNullable<Ride['analysis']>['AT_MOST_TWO_VEHICLE_IDS']['message']) | null
	'AT_MOST_TWO_VEHICLE_IDS-reason': (NonNullable<Ride['analysis']>['AT_MOST_TWO_VEHICLE_IDS']['reason']) | null
	'AT_MOST_TWO_VEHICLE_IDS-unit': (NonNullable<Ride['analysis']>['AT_MOST_TWO_VEHICLE_IDS']['unit']) | null
	'AT_MOST_TWO_VEHICLE_IDS-value': (NonNullable<Ride['analysis']>['AT_MOST_TWO_VEHICLE_IDS']['value']) | null
	'AVG_INTERVAL_VEHICLE_EVENTS-grade': (NonNullable<Ride['analysis']>['AVG_INTERVAL_VEHICLE_EVENTS']['grade']) | null
	'AVG_INTERVAL_VEHICLE_EVENTS-message': (NonNullable<Ride['analysis']>['AVG_INTERVAL_VEHICLE_EVENTS']['message']) | null
	'AVG_INTERVAL_VEHICLE_EVENTS-reason': (NonNullable<Ride['analysis']>['AVG_INTERVAL_VEHICLE_EVENTS']['reason']) | null
	'AVG_INTERVAL_VEHICLE_EVENTS-unit': (NonNullable<Ride['analysis']>['AVG_INTERVAL_VEHICLE_EVENTS']['unit']) | null
	'AVG_INTERVAL_VEHICLE_EVENTS-value': (NonNullable<Ride['analysis']>['AVG_INTERVAL_VEHICLE_EVENTS']['value']) | null
	'driver_ids': string
	'end_time_observed': null | number
	'end_time_scheduled': null | number
	'EXCESSIVE_VEHICLE_EVENT_DELAY-grade': (NonNullable<Ride['analysis']>['EXCESSIVE_VEHICLE_EVENT_DELAY']['grade']) | null
	'EXCESSIVE_VEHICLE_EVENT_DELAY-message': (NonNullable<Ride['analysis']>['EXCESSIVE_VEHICLE_EVENT_DELAY']['message']) | null
	'EXCESSIVE_VEHICLE_EVENT_DELAY-reason': (NonNullable<Ride['analysis']>['EXCESSIVE_VEHICLE_EVENT_DELAY']['reason']) | null
	'EXCESSIVE_VEHICLE_EVENT_DELAY-unit': (NonNullable<Ride['analysis']>['EXCESSIVE_VEHICLE_EVENT_DELAY']['unit']) | null
	'EXCESSIVE_VEHICLE_EVENT_DELAY-value': (NonNullable<Ride['analysis']>['EXCESSIVE_VEHICLE_EVENT_DELAY']['value']) | null
	'extension_observed': null | number
	'extension_scheduled': number
	'headsign': string
	'HIGHEST_VEHICLE_EVENT_DELAY-grade': (NonNullable<Ride['analysis']>['HIGHEST_VEHICLE_EVENT_DELAY']['grade']) | null
	'HIGHEST_VEHICLE_EVENT_DELAY-message': (NonNullable<Ride['analysis']>['HIGHEST_VEHICLE_EVENT_DELAY']['message']) | null
	'HIGHEST_VEHICLE_EVENT_DELAY-reason': (NonNullable<Ride['analysis']>['HIGHEST_VEHICLE_EVENT_DELAY']['reason']) | null
	'HIGHEST_VEHICLE_EVENT_DELAY-unit': (NonNullable<Ride['analysis']>['HIGHEST_VEHICLE_EVENT_DELAY']['unit']) | null
	'HIGHEST_VEHICLE_EVENT_DELAY-value': (NonNullable<Ride['analysis']>['HIGHEST_VEHICLE_EVENT_DELAY']['value']) | null
	'LESS_THAN_TEN_VEHICLE_EVENTS-grade': (NonNullable<Ride['analysis']>['LESS_THAN_TEN_VEHICLE_EVENTS']['grade']) | null
	'LESS_THAN_TEN_VEHICLE_EVENTS-message': (NonNullable<Ride['analysis']>['LESS_THAN_TEN_VEHICLE_EVENTS']['message']) | null
	'LESS_THAN_TEN_VEHICLE_EVENTS-reason': (NonNullable<Ride['analysis']>['LESS_THAN_TEN_VEHICLE_EVENTS']['reason']) | null
	'LESS_THAN_TEN_VEHICLE_EVENTS-unit': (NonNullable<Ride['analysis']>['LESS_THAN_TEN_VEHICLE_EVENTS']['unit']) | null
	'LESS_THAN_TEN_VEHICLE_EVENTS-value': (NonNullable<Ride['analysis']>['LESS_THAN_TEN_VEHICLE_EVENTS']['value']) | null
	'line_id': string
	'MATCHING_LOCATION_TRANSACTIONS-grade': (NonNullable<Ride['analysis']>['MATCHING_LOCATION_TRANSACTIONS']['grade']) | null
	'MATCHING_LOCATION_TRANSACTIONS-message': (NonNullable<Ride['analysis']>['MATCHING_LOCATION_TRANSACTIONS']['message']) | null
	'MATCHING_LOCATION_TRANSACTIONS-reason': (NonNullable<Ride['analysis']>['MATCHING_LOCATION_TRANSACTIONS']['reason']) | null
	'MATCHING_LOCATION_TRANSACTIONS-unit': (NonNullable<Ride['analysis']>['MATCHING_LOCATION_TRANSACTIONS']['unit']) | null
	'MATCHING_LOCATION_TRANSACTIONS-value': (NonNullable<Ride['analysis']>['MATCHING_LOCATION_TRANSACTIONS']['value']) | null
	'ONTIME_START-grade': (NonNullable<Ride['analysis']>['ONTIME_START']['grade']) | null
	'ONTIME_START-message': (NonNullable<Ride['analysis']>['ONTIME_START']['message']) | null
	'ONTIME_START-reason': (NonNullable<Ride['analysis']>['ONTIME_START']['reason']) | null
	'ONTIME_START-unit': (NonNullable<Ride['analysis']>['ONTIME_START']['unit']) | null
	'ONTIME_START-value': (NonNullable<Ride['analysis']>['ONTIME_START']['value']) | null
	'operational_date': string
	'passengers_estimated': null | number
	'pattern_id': string
	'plan_id': string
	'route_id': string
	'seen_first_at': null | number
	'seen_last_at': null | number
	'SIMPLE_ONE_VALIDATION_TRANSACTION-grade': (NonNullable<Ride['analysis']>['SIMPLE_ONE_VALIDATION_TRANSACTION']['grade']) | null
	'SIMPLE_ONE_VALIDATION_TRANSACTION-message': (NonNullable<Ride['analysis']>['SIMPLE_ONE_VALIDATION_TRANSACTION']['message']) | null
	'SIMPLE_ONE_VALIDATION_TRANSACTION-reason': (NonNullable<Ride['analysis']>['SIMPLE_ONE_VALIDATION_TRANSACTION']['reason']) | null
	'SIMPLE_ONE_VALIDATION_TRANSACTION-unit': (NonNullable<Ride['analysis']>['SIMPLE_ONE_VALIDATION_TRANSACTION']['unit']) | null
	'SIMPLE_ONE_VALIDATION_TRANSACTION-value': (NonNullable<Ride['analysis']>['SIMPLE_ONE_VALIDATION_TRANSACTION']['value']) | null
	'SIMPLE_ONE_VEHICLE_EVENT_OR_VALIDATION_TRANSACTION-grade': (NonNullable<Ride['analysis']>['SIMPLE_ONE_VEHICLE_EVENT_OR_VALIDATION_TRANSACTION']['grade']) | null
	'SIMPLE_ONE_VEHICLE_EVENT_OR_VALIDATION_TRANSACTION-message': (NonNullable<Ride['analysis']>['SIMPLE_ONE_VEHICLE_EVENT_OR_VALIDATION_TRANSACTION']['message']) | null
	'SIMPLE_ONE_VEHICLE_EVENT_OR_VALIDATION_TRANSACTION-reason': (NonNullable<Ride['analysis']>['SIMPLE_ONE_VEHICLE_EVENT_OR_VALIDATION_TRANSACTION']['reason']) | null
	'SIMPLE_ONE_VEHICLE_EVENT_OR_VALIDATION_TRANSACTION-unit': (NonNullable<Ride['analysis']>['SIMPLE_ONE_VEHICLE_EVENT_OR_VALIDATION_TRANSACTION']['unit']) | null
	'SIMPLE_ONE_VEHICLE_EVENT_OR_VALIDATION_TRANSACTION-value': (NonNullable<Ride['analysis']>['SIMPLE_ONE_VEHICLE_EVENT_OR_VALIDATION_TRANSACTION']['value']) | null
	'SIMPLE_THREE_VEHICLE_EVENTS-grade': (NonNullable<Ride['analysis']>['SIMPLE_THREE_VEHICLE_EVENTS']['grade']) | null
	'SIMPLE_THREE_VEHICLE_EVENTS-message': (NonNullable<Ride['analysis']>['SIMPLE_THREE_VEHICLE_EVENTS']['message']) | null
	'SIMPLE_THREE_VEHICLE_EVENTS-reason': (NonNullable<Ride['analysis']>['SIMPLE_THREE_VEHICLE_EVENTS']['reason']) | null
	'SIMPLE_THREE_VEHICLE_EVENTS-unit': (NonNullable<Ride['analysis']>['SIMPLE_THREE_VEHICLE_EVENTS']['unit']) | null
	'SIMPLE_THREE_VEHICLE_EVENTS-value': (NonNullable<Ride['analysis']>['SIMPLE_THREE_VEHICLE_EVENTS']['value']) | null
	'start_time_observed': null | number
	'start_time_scheduled': null | number
	'status': string
	// 'TRANSACTION_SEQUENTIALITY-grade': (NonNullable<Ride['analysis']>['TRANSACTION_SEQUENTIALITY']['grade']) | null
	// 'TRANSACTION_SEQUENTIALITY-message': (NonNullable<Ride['analysis']>['TRANSACTION_SEQUENTIALITY']['message']) | null
	// 'TRANSACTION_SEQUENTIALITY-reason': (NonNullable<Ride['analysis']>['TRANSACTION_SEQUENTIALITY']['reason']) | null
	// 'TRANSACTION_SEQUENTIALITY-unit': (NonNullable<Ride['analysis']>['TRANSACTION_SEQUENTIALITY']['unit']) | null
	// 'TRANSACTION_SEQUENTIALITY-value': (NonNullable<Ride['analysis']>['TRANSACTION_SEQUENTIALITY']['value']) | null
	'trip_id': string
	'validations_count': null | number
	'vehicle_ids': string
}

/* * */

const slaReport_20250501: RideReport = {
	'_id': '',
	'agency_id': '',
	'AT_LEAST_ONE_EVENT_ON_FIRST_STOP-grade': 'fail',
	'AT_LEAST_ONE_EVENT_ON_FIRST_STOP-message': '',
	'AT_LEAST_ONE_EVENT_ON_FIRST_STOP-reason': '',
	'AT_LEAST_ONE_EVENT_ON_FIRST_STOP-unit': '',
	'AT_LEAST_ONE_EVENT_ON_FIRST_STOP-value': 0,
	'AT_MOST_TWO_DRIVER_IDS-grade': 'fail',
	'AT_MOST_TWO_DRIVER_IDS-message': '',
	'AT_MOST_TWO_DRIVER_IDS-reason': '',
	'AT_MOST_TWO_DRIVER_IDS-unit': '',
	'AT_MOST_TWO_DRIVER_IDS-value': 0,
	'AT_MOST_TWO_VEHICLE_IDS-grade': 'fail',
	'AT_MOST_TWO_VEHICLE_IDS-message': '',
	'AT_MOST_TWO_VEHICLE_IDS-reason': '',
	'AT_MOST_TWO_VEHICLE_IDS-unit': '',
	'AT_MOST_TWO_VEHICLE_IDS-value': 0,
	'AVG_INTERVAL_VEHICLE_EVENTS-grade': 'fail',
	'AVG_INTERVAL_VEHICLE_EVENTS-message': '',
	'AVG_INTERVAL_VEHICLE_EVENTS-reason': '',
	'AVG_INTERVAL_VEHICLE_EVENTS-unit': '',
	'AVG_INTERVAL_VEHICLE_EVENTS-value': 0,
	'driver_ids': '',
	'end_time_observed': 0,
	'end_time_scheduled': 0,
	'EXCESSIVE_VEHICLE_EVENT_DELAY-grade': 'fail',
	'EXCESSIVE_VEHICLE_EVENT_DELAY-message': '',
	'EXCESSIVE_VEHICLE_EVENT_DELAY-reason': '',
	'EXCESSIVE_VEHICLE_EVENT_DELAY-unit': '',
	'EXCESSIVE_VEHICLE_EVENT_DELAY-value': 0,
	'extension_observed': 0,
	'extension_scheduled': 0,
	'headsign': '',
	'HIGHEST_VEHICLE_EVENT_DELAY-grade': 'fail',
	'HIGHEST_VEHICLE_EVENT_DELAY-message': '',
	'HIGHEST_VEHICLE_EVENT_DELAY-reason': '',
	'HIGHEST_VEHICLE_EVENT_DELAY-unit': '',
	'HIGHEST_VEHICLE_EVENT_DELAY-value': 0,
	'LESS_THAN_TEN_VEHICLE_EVENTS-grade': 'fail',
	'LESS_THAN_TEN_VEHICLE_EVENTS-message': '',
	'LESS_THAN_TEN_VEHICLE_EVENTS-reason': '',
	'LESS_THAN_TEN_VEHICLE_EVENTS-unit': '',
	'LESS_THAN_TEN_VEHICLE_EVENTS-value': 0,
	'line_id': '',
	'MATCHING_LOCATION_TRANSACTIONS-grade': 'fail',
	'MATCHING_LOCATION_TRANSACTIONS-message': '',
	'MATCHING_LOCATION_TRANSACTIONS-reason': '',
	'MATCHING_LOCATION_TRANSACTIONS-unit': '',
	'MATCHING_LOCATION_TRANSACTIONS-value': 0,
	'ONTIME_START-grade': 'fail',
	'ONTIME_START-message': '',
	'ONTIME_START-reason': '',
	'ONTIME_START-unit': '',
	'ONTIME_START-value': 0,
	'operational_date': '',
	'passengers_estimated': 0,
	'pattern_id': '',
	'plan_id': '',
	'route_id': '',
	'seen_first_at': 0,
	'seen_last_at': 0,
	'SIMPLE_ONE_VALIDATION_TRANSACTION-grade': 'fail',
	'SIMPLE_ONE_VALIDATION_TRANSACTION-message': '',
	'SIMPLE_ONE_VALIDATION_TRANSACTION-reason': '',
	'SIMPLE_ONE_VALIDATION_TRANSACTION-unit': '',
	'SIMPLE_ONE_VALIDATION_TRANSACTION-value': 0,
	'SIMPLE_ONE_VEHICLE_EVENT_OR_VALIDATION_TRANSACTION-grade': 'fail',
	'SIMPLE_ONE_VEHICLE_EVENT_OR_VALIDATION_TRANSACTION-message': '',
	'SIMPLE_ONE_VEHICLE_EVENT_OR_VALIDATION_TRANSACTION-reason': '',
	'SIMPLE_ONE_VEHICLE_EVENT_OR_VALIDATION_TRANSACTION-unit': '',
	'SIMPLE_ONE_VEHICLE_EVENT_OR_VALIDATION_TRANSACTION-value': 0,
	'SIMPLE_THREE_VEHICLE_EVENTS-grade': 'fail',
	'SIMPLE_THREE_VEHICLE_EVENTS-message': '',
	'SIMPLE_THREE_VEHICLE_EVENTS-reason': '',
	'SIMPLE_THREE_VEHICLE_EVENTS-unit': '',
	'SIMPLE_THREE_VEHICLE_EVENTS-value': 0,
	'start_time_observed': 0,
	'start_time_scheduled': 0,
	'status': '',
	'trip_id': '',
	'validations_count': 0,
	'vehicle_ids': '',
};

/* * */

export default async function reportsSlaExportDefault(progress, exportOptions) {
	//

	const agencyData = await AgencyModel.findOne({ _id: { $eq: exportOptions.agency_id } });

	console.log(`* * *`);
	console.log(`* SLA Default v1 : NEW EXPORT`);
	console.log(`* AgencyData:`, agencyData);
	console.log(`* ExportOptions:`, exportOptions);
	console.log(`* * *`);

	// 0.
	// Update progress
	await update(progress, { progress_current: 1, progress_total: 2 });

	// 1.
	// Get all stops from the database

	const ridesCollection = await rides.getCollection();
	const allRidesStream = ridesCollection.find({ agency_id: agencyData.code, operational_date: { $gte: exportOptions.start_date, $lte: exportOptions.end_date } }).stream();

	const defaultCsvWriter = new CSVWRITER('reports.sla.dump-default', { batch_size: 10000 });

	const outputFileName = `SLA_${agencyData.code}_${exportOptions.start_date}_${exportOptions.end_date}.csv`;

	// 3.
	// Parse each stop and format it according to the GTFS-TML specification

	for await (const rideData of allRidesStream) {
		//

		const rideParsed: RideReport = {
			'_id': rideData._id,
			'agency_id': rideData.agency_id,
			'AT_LEAST_ONE_EVENT_ON_FIRST_STOP-grade': rideData.analysis?.AT_LEAST_ONE_EVENT_ON_FIRST_STOP?.grade ?? null,
			'AT_LEAST_ONE_EVENT_ON_FIRST_STOP-message': rideData.analysis?.AT_LEAST_ONE_EVENT_ON_FIRST_STOP?.message ?? null,
			'AT_LEAST_ONE_EVENT_ON_FIRST_STOP-reason': rideData.analysis?.AT_LEAST_ONE_EVENT_ON_FIRST_STOP?.reason ?? null,
			'AT_LEAST_ONE_EVENT_ON_FIRST_STOP-unit': rideData.analysis?.AT_LEAST_ONE_EVENT_ON_FIRST_STOP?.unit ?? null,
			'AT_LEAST_ONE_EVENT_ON_FIRST_STOP-value': rideData.analysis?.AT_LEAST_ONE_EVENT_ON_FIRST_STOP?.value ?? null,
			'AT_MOST_TWO_DRIVER_IDS-grade': rideData.analysis?.AT_MOST_TWO_DRIVER_IDS?.grade ?? null,
			'AT_MOST_TWO_DRIVER_IDS-message': rideData.analysis?.AT_MOST_TWO_DRIVER_IDS?.message ?? null,
			'AT_MOST_TWO_DRIVER_IDS-reason': rideData.analysis?.AT_MOST_TWO_DRIVER_IDS?.reason ?? null,
			'AT_MOST_TWO_DRIVER_IDS-unit': rideData.analysis?.AT_MOST_TWO_DRIVER_IDS?.unit ?? null,
			'AT_MOST_TWO_DRIVER_IDS-value': rideData.analysis?.AT_MOST_TWO_DRIVER_IDS?.value ?? null,
			'AT_MOST_TWO_VEHICLE_IDS-grade': rideData.analysis?.AT_MOST_TWO_VEHICLE_IDS?.grade ?? null,
			'AT_MOST_TWO_VEHICLE_IDS-message': rideData.analysis?.AT_MOST_TWO_VEHICLE_IDS?.message ?? null,
			'AT_MOST_TWO_VEHICLE_IDS-reason': rideData.analysis?.AT_MOST_TWO_VEHICLE_IDS?.reason ?? null,
			'AT_MOST_TWO_VEHICLE_IDS-unit': rideData.analysis?.AT_MOST_TWO_VEHICLE_IDS?.unit ?? null,
			'AT_MOST_TWO_VEHICLE_IDS-value': rideData.analysis?.AT_MOST_TWO_VEHICLE_IDS?.value ?? null,
			'AVG_INTERVAL_VEHICLE_EVENTS-grade': rideData.analysis?.AVG_INTERVAL_VEHICLE_EVENTS?.grade ?? null,
			'AVG_INTERVAL_VEHICLE_EVENTS-message': rideData.analysis?.AVG_INTERVAL_VEHICLE_EVENTS?.message ?? null,
			'AVG_INTERVAL_VEHICLE_EVENTS-reason': rideData.analysis?.AVG_INTERVAL_VEHICLE_EVENTS?.reason ?? null,
			'AVG_INTERVAL_VEHICLE_EVENTS-unit': rideData.analysis?.AVG_INTERVAL_VEHICLE_EVENTS?.unit ?? null,
			'AVG_INTERVAL_VEHICLE_EVENTS-value': rideData.analysis?.AVG_INTERVAL_VEHICLE_EVENTS?.value ?? null,
			'driver_ids': rideData.driver_ids?.join('-'),
			'end_time_observed': rideData.end_time_observed,
			'end_time_scheduled': rideData.end_time_scheduled,
			'EXCESSIVE_VEHICLE_EVENT_DELAY-grade': rideData.analysis?.EXCESSIVE_VEHICLE_EVENT_DELAY?.grade ?? null,
			'EXCESSIVE_VEHICLE_EVENT_DELAY-message': rideData.analysis?.EXCESSIVE_VEHICLE_EVENT_DELAY?.message ?? null,
			'EXCESSIVE_VEHICLE_EVENT_DELAY-reason': rideData.analysis?.EXCESSIVE_VEHICLE_EVENT_DELAY?.reason ?? null,
			'EXCESSIVE_VEHICLE_EVENT_DELAY-unit': rideData.analysis?.EXCESSIVE_VEHICLE_EVENT_DELAY?.unit ?? null,
			'EXCESSIVE_VEHICLE_EVENT_DELAY-value': rideData.analysis?.EXCESSIVE_VEHICLE_EVENT_DELAY?.value ?? null,
			'extension_observed': rideData.extension_observed,
			'extension_scheduled': rideData.extension_scheduled,
			'headsign': rideData.headsign,
			'HIGHEST_VEHICLE_EVENT_DELAY-grade': rideData.analysis?.HIGHEST_VEHICLE_EVENT_DELAY?.grade ?? null,
			'HIGHEST_VEHICLE_EVENT_DELAY-message': rideData.analysis?.HIGHEST_VEHICLE_EVENT_DELAY?.message ?? null,
			'HIGHEST_VEHICLE_EVENT_DELAY-reason': rideData.analysis?.HIGHEST_VEHICLE_EVENT_DELAY?.reason ?? null,
			'HIGHEST_VEHICLE_EVENT_DELAY-unit': rideData.analysis?.HIGHEST_VEHICLE_EVENT_DELAY?.unit ?? null,
			'HIGHEST_VEHICLE_EVENT_DELAY-value': rideData.analysis?.HIGHEST_VEHICLE_EVENT_DELAY?.value ?? null,
			'LESS_THAN_TEN_VEHICLE_EVENTS-grade': rideData.analysis?.LESS_THAN_TEN_VEHICLE_EVENTS?.grade ?? null,
			'LESS_THAN_TEN_VEHICLE_EVENTS-message': rideData.analysis?.LESS_THAN_TEN_VEHICLE_EVENTS?.message ?? null,
			'LESS_THAN_TEN_VEHICLE_EVENTS-reason': rideData.analysis?.LESS_THAN_TEN_VEHICLE_EVENTS?.reason ?? null,
			'LESS_THAN_TEN_VEHICLE_EVENTS-unit': rideData.analysis?.LESS_THAN_TEN_VEHICLE_EVENTS?.unit ?? null,
			'LESS_THAN_TEN_VEHICLE_EVENTS-value': rideData.analysis?.LESS_THAN_TEN_VEHICLE_EVENTS?.value ?? null,
			'line_id': rideData.line_id,
			'MATCHING_LOCATION_TRANSACTIONS-grade': rideData.analysis?.MATCHING_LOCATION_TRANSACTIONS?.grade ?? null,
			'MATCHING_LOCATION_TRANSACTIONS-message': rideData.analysis?.MATCHING_LOCATION_TRANSACTIONS?.message ?? null,
			'MATCHING_LOCATION_TRANSACTIONS-reason': rideData.analysis?.MATCHING_LOCATION_TRANSACTIONS?.reason ?? null,
			'MATCHING_LOCATION_TRANSACTIONS-unit': rideData.analysis?.MATCHING_LOCATION_TRANSACTIONS?.unit ?? null,
			'MATCHING_LOCATION_TRANSACTIONS-value': rideData.analysis?.MATCHING_LOCATION_TRANSACTIONS?.value ?? null,
			'ONTIME_START-grade': rideData.analysis?.ONTIME_START?.grade ?? null,
			'ONTIME_START-message': rideData.analysis?.ONTIME_START?.message ?? null,
			'ONTIME_START-reason': rideData.analysis?.ONTIME_START?.reason ?? null,
			'ONTIME_START-unit': rideData.analysis?.ONTIME_START?.unit ?? null,
			'ONTIME_START-value': rideData.analysis?.ONTIME_START?.value ?? null,
			'operational_date': rideData.operational_date,
			'passengers_estimated': rideData.passengers_estimated,
			'pattern_id': rideData.pattern_id,
			'plan_id': rideData.plan_id,
			'route_id': rideData.route_id,
			'seen_first_at': rideData.seen_first_at,
			'seen_last_at': rideData.seen_last_at,
			'SIMPLE_ONE_VALIDATION_TRANSACTION-grade': rideData.analysis?.SIMPLE_ONE_VALIDATION_TRANSACTION?.grade ?? null,
			'SIMPLE_ONE_VALIDATION_TRANSACTION-message': rideData.analysis?.SIMPLE_ONE_VALIDATION_TRANSACTION?.message ?? null,
			'SIMPLE_ONE_VALIDATION_TRANSACTION-reason': rideData.analysis?.SIMPLE_ONE_VALIDATION_TRANSACTION?.reason ?? null,
			'SIMPLE_ONE_VALIDATION_TRANSACTION-unit': rideData.analysis?.SIMPLE_ONE_VALIDATION_TRANSACTION?.unit ?? null,
			'SIMPLE_ONE_VALIDATION_TRANSACTION-value': rideData.analysis?.SIMPLE_ONE_VALIDATION_TRANSACTION?.value ?? null,
			'SIMPLE_ONE_VEHICLE_EVENT_OR_VALIDATION_TRANSACTION-grade': rideData.analysis?.SIMPLE_ONE_VEHICLE_EVENT_OR_VALIDATION_TRANSACTION?.grade ?? null,
			'SIMPLE_ONE_VEHICLE_EVENT_OR_VALIDATION_TRANSACTION-message': rideData.analysis?.SIMPLE_ONE_VEHICLE_EVENT_OR_VALIDATION_TRANSACTION?.message ?? null,
			'SIMPLE_ONE_VEHICLE_EVENT_OR_VALIDATION_TRANSACTION-reason': rideData.analysis?.SIMPLE_ONE_VEHICLE_EVENT_OR_VALIDATION_TRANSACTION?.reason ?? null,
			'SIMPLE_ONE_VEHICLE_EVENT_OR_VALIDATION_TRANSACTION-unit': rideData.analysis?.SIMPLE_ONE_VEHICLE_EVENT_OR_VALIDATION_TRANSACTION?.unit ?? null,
			'SIMPLE_ONE_VEHICLE_EVENT_OR_VALIDATION_TRANSACTION-value': rideData.analysis?.SIMPLE_ONE_VEHICLE_EVENT_OR_VALIDATION_TRANSACTION?.value ?? null,
			'SIMPLE_THREE_VEHICLE_EVENTS-grade': rideData.analysis?.SIMPLE_THREE_VEHICLE_EVENTS?.grade ?? null,
			'SIMPLE_THREE_VEHICLE_EVENTS-message': rideData.analysis?.SIMPLE_THREE_VEHICLE_EVENTS?.message ?? null,
			'SIMPLE_THREE_VEHICLE_EVENTS-reason': rideData.analysis?.SIMPLE_THREE_VEHICLE_EVENTS?.reason ?? null,
			'SIMPLE_THREE_VEHICLE_EVENTS-unit': rideData.analysis?.SIMPLE_THREE_VEHICLE_EVENTS?.unit ?? null,
			'SIMPLE_THREE_VEHICLE_EVENTS-value': rideData.analysis?.SIMPLE_THREE_VEHICLE_EVENTS?.value ?? null,
			'start_time_observed': rideData.start_time_observed,
			'start_time_scheduled': rideData.start_time_scheduled,
			'status': rideData.system_status,
			// 'TRANSACTION_SEQUENTIALITY-grade': rideData.analysis?.TRANSACTION_SEQUENTIALITY?.grade ?? null,
			// 'TRANSACTION_SEQUENTIALITY-message': rideData.analysis?.TRANSACTION_SEQUENTIALITY?.message ?? null,
			// 'TRANSACTION_SEQUENTIALITY-reason': rideData.analysis?.TRANSACTION_SEQUENTIALITY?.reason ?? null,
			// 'TRANSACTION_SEQUENTIALITY-unit': rideData.analysis?.TRANSACTION_SEQUENTIALITY?.unit ?? null,
			// 'TRANSACTION_SEQUENTIALITY-value': rideData.analysis?.TRANSACTION_SEQUENTIALITY?.value ?? null,
			'trip_id': rideData.trip_id,
			'validations_count': rideData.apex_validations_qty,
			'vehicle_ids': rideData.vehicle_ids?.join('-'),
		};

		await defaultCsvWriter.write(progress.workdir, outputFileName, rideParsed);

		//
	}

	await defaultCsvWriter.flush();

	// 0.
	// Update progress
	await update(progress, { progress_current: 2, progress_total: 2 });

	//
}
