/* * */

import { StopModel } from '@/schemas/Stop/model';
import { StopPropertyHasAbusiveParking, StopPropertyHasBench, StopPropertyHasCover, StopPropertyHasFlatAccess, StopPropertyHasLighting, StopPropertyHasPipRealtime, StopPropertyHasShelter, StopPropertyHasTactileAccess, StopPropertyHasTrashBin, StopPropertyHasWideAccess } from '@/schemas/Stop/options';

/* * */

const INTERMODAL_API_URL = 'https://api.intermodal.pt/v1/regions/1/stops/full';

const INTERMODAL_CARRIS_METROPOLITANA_OPERATOR_ID = 1;

/* * */

export default async function stopsSyncIntermodal() {
	//

	//

	// 1.
	// Retrieve all stops from Intermodal

	const allIntermodalStopsRes = await fetch(INTERMODAL_API_URL);
	const allIntermodalStopsData = await allIntermodalStopsRes.json();

	// 2.
	// Parse the data

	for (const intermodalStopData of allIntermodalStopsData) {
		//

		// 2.1.
		// Skip stops that are not from the desired operator

		const intermodalStopDataOperatorInfo = intermodalStopData.operators.find(item => item.operator_id === INTERMODAL_CARRIS_METROPOLITANA_OPERATOR_ID);
		if (!intermodalStopDataOperatorInfo) continue;

		// 2.2.
		// Check if the stop is from the desired municipality
		// *** Uncomment the municipalities you want to synchronize

		const enabledMunicipalities = [
			'01', // ALCOCHETE
			'02', // ALMADA
			'03', // AMADORA
			'04', // BARREIRO
			'05', // CASCAIS
			'06', // LISBOA
			// '07', // LOURES
			'08', // MAFRA
			'09', // MOITA
			'10', // MONTIJO
			'11', // ODIVELAS
			'12', // OEIRAS
			'13', // PALMELA
			'14', // SEIXAL
			'15', // SESIMBRA
			'16', // SETÚBAL
			'17', // SINTRA
			'18', // VILA FRANCA DE XIRA
			'19', // OUT AML (MARGEM SUL)
			'20', // OUT AML (MARGEM NORTE)
		];

		if (!enabledMunicipalities.includes(intermodalStopDataOperatorInfo.stop_ref.substring(0, 2))) continue;

		// 2.3.
		// Get this stop from the databse and update its location

		const stopData = await StopModel.findOne({ code: intermodalStopDataOperatorInfo.stop_ref, is_locked: false });
		if (!stopData || stopData.is_locked) continue; // Skip if stop is not found or is locked

		// 2.4.
		// Update attributes of stop with data from Intermodal API

		stopData.latitude = intermodalStopData.lat;
		stopData.longitude = intermodalStopData.lon;

		stopData.has_cover = intermodalStopData.has_cover ? StopPropertyHasCover.Yes : StopPropertyHasCover.Unknown;
		stopData.has_shelter = intermodalStopData.has_shelter ? StopPropertyHasShelter.Yes : StopPropertyHasShelter.Unknown;
		stopData.has_bench = intermodalStopData.has_bench ? StopPropertyHasBench.Yes : StopPropertyHasBench.Unknown;
		stopData.has_trash_bin = intermodalStopData.has_trash_can ? StopPropertyHasTrashBin.Yes : StopPropertyHasTrashBin.Unknown;

		if (intermodalStopData.illumination_strength === 0) stopData.has_lighting = StopPropertyHasLighting.Unknown;
		if (intermodalStopData.illumination_strength === 1) stopData.has_lighting = StopPropertyHasLighting.Unavailable;
		if (intermodalStopData.illumination_strength === 2) stopData.has_lighting = StopPropertyHasLighting.Insuficient;
		if (intermodalStopData.illumination_strength === 3) stopData.has_lighting = StopPropertyHasLighting.Moderate;
		if (intermodalStopData.illumination_strength === 4) stopData.has_lighting = StopPropertyHasLighting.Confortable;

		stopData.has_pip_realtime = intermodalStopData.has_waiting_times ? StopPropertyHasPipRealtime.Type1 : StopPropertyHasPipRealtime.Unknown;

		stopData.has_flat_access = intermodalStopData.has_flat_access ? StopPropertyHasFlatAccess.Yes : StopPropertyHasFlatAccess.Unknown;
		stopData.has_wide_access = intermodalStopData.has_wide_access ? StopPropertyHasWideAccess.Yes : StopPropertyHasWideAccess.Unknown;
		stopData.has_tactile_access = intermodalStopData.has_tactile_access ? StopPropertyHasTactileAccess.Yes : StopPropertyHasTactileAccess.Unknown;
		stopData.has_abusive_parking = intermodalStopData.parking_local_access_impairment ? StopPropertyHasAbusiveParking.AbusiveIllegal : StopPropertyHasTactileAccess.Unknown;

		// 2.5.
		// Save the stop

		await stopData.save();

		console.log(`Synced stop ${stopData.code}`);

		//
	}

	//
}
