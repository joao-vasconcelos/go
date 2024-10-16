'use client';

/* * */

import StopsExplorerNewStopWizard from '@/components/StopsExplorerNewStopWizard/StopsExplorerNewStopWizard';
import { StopOptions } from '@/schemas/Stop/options';
import API from '@/services/API';
import * as turf from '@turf/turf';
import { useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

/* * */

// 1.
// SETUP INITIAL STATE

const initialWizardState = {
	current_step: 0,
	is_error: false,
	is_loading: false,
	//
	is_open: false,
	//
	max_step: 3, // Zero-based + the Completed step
	//
	step_0_complete: false,
	step_1_complete: false,
};

const initialNewStopState = {
	// Step 0
	latitude: null,
	locality: '',
	longitude: null,
	municipality: null,
	// Step 1
	name: '',
	short_name: '',
	tts_name: '',
	//
};

/* * */

// 2.
// CREATE CONTEXTS

const StopsExplorerNewStopWizardContext = createContext(null);

/* * */

// 3.
// SETUP CUSTOM HOOKS

export function useStopsExplorerNewStopWizardContext() {
	return useContext(StopsExplorerNewStopWizardContext);
}

/* * */

// 4.
// SETUP PROVIDER

export function StopsExplorerNewStopWizardContextProvider({ children }) {
	//

	//
	// A. Setup state

	const router = useRouter();
	const [wizardState, setWizardState] = useState(initialWizardState);
	const [newStopState, setNewStopState] = useState(initialNewStopState);
	const [newStopId, setNewStopId] = useState(null);

	//
	// B. Fetch data

	const { data: allMunicipalitiesData } = useSWR('/api/municipalities');

	//
	// C. Auto actions

	useEffect(() => {
		// Check validity of data for Step 0
		const newStopHasValidLatitude = newStopState.latitude ? true : false;
		const newStopHasValidLongitude = newStopState.longitude ? true : false;
		const newStopHasValidMunicipality = newStopState.municipality ? true : false;
		// Save validity check
		if (newStopHasValidLatitude && newStopHasValidLongitude && newStopHasValidMunicipality) setWizardState(prev => ({ ...prev, step_0_complete: true }));
		else setWizardState(prev => ({ ...prev, step_0_complete: false }));
		//
	}, [newStopState.latitude, newStopState.longitude, newStopState.municipality]);

	useEffect(() => {
		// Check validity of data for Step 1
		const newStopHasValidName = newStopState.name.length >= StopOptions.min_stop_name_length && newStopState.name.length <= StopOptions.max_stop_name_length ? true : false;
		const newStopHasValidShortName = newStopState.short_name.length <= StopOptions.max_stop_short_name_length ? true : false;
		// Save validity check
		if (newStopHasValidName && newStopHasValidShortName) setWizardState(prev => ({ ...prev, step_1_complete: true }));
		else setWizardState(prev => ({ ...prev, step_1_complete: false }));
		//
	}, [newStopState.name, newStopState.short_name.length]);

	//
	// C. Setup actions

	const openWizard = useCallback(() => {
		setNewStopState(initialNewStopState);
		setWizardState(prev => ({ ...prev, is_open: true }));
	}, []);

	const closeWizard = useCallback(() => {
		setNewStopState(initialNewStopState);
		setWizardState(initialWizardState);
		setNewStopId(null);
	}, []);

	const returnWizardToPreviousStep = useCallback(() => {
		setWizardState((prev) => {
			if (prev.current_step <= 0) return { ...prev, current_step: 0 };
			else return { ...prev, current_step: prev.current_step - 1 };
		});
	}, []);

	const advanceWizardToNextStep = useCallback(() => {
		setWizardState((prev) => {
			if (prev.current_step >= prev.max_step) return { ...prev, current_step: prev.max_step };
			else return { ...prev, current_step: prev.current_step + 1 };
		});
	}, []);

	const setNewStopCoordinates = useCallback(
		(latitude, longitude) => {
			if (!allMunicipalitiesData) return;
			// Round coordinates to 6 decimal digits
			const sixDigitsLatitude = Math.round(latitude * 1000000) / 1000000;
			const sixDigitsLongitude = Math.round(longitude * 1000000) / 1000000;
			// Discover to which municipality this stop belongs to
			let municipalityDataForThisStop;
			for (const municipalityData of allMunicipalitiesData) {
				// Skip if no geometry is set for this municipality
				if (!municipalityData.geojson?.geometry?.coordinates.length) continue;
				// Check if this stop is inside this municipality boundary
				const isStopInThisMunicipality = turf.booleanPointInPolygon([sixDigitsLongitude, sixDigitsLatitude], municipalityData.geojson);
				// If it is, add this municipality id to the stop
				if (isStopInThisMunicipality) {
					municipalityDataForThisStop = municipalityData;
					break;
				}
				//
			}
			// Set new stop info
			setNewStopState(prev => ({ ...prev, latitude: sixDigitsLatitude, longitude: sixDigitsLongitude, municipality: municipalityDataForThisStop }));
		},
		[allMunicipalitiesData],
	);

	const setNewStopName = useCallback((name) => {
		// Remove double spaces
		const parsedStopName = name.replace(/\s\s+/g, ' ');
		// Copy the name first
		let shortenedStopName = parsedStopName;
		// Shorten the stop name
		StopOptions.name_abbreviations
			.filter(abbreviation => abbreviation.enabled)
			.forEach((abbreviation) => {
				shortenedStopName = shortenedStopName.replace(abbreviation.phrase, abbreviation.replacement);
			});
		// Set new stop info
		setNewStopState(prev => ({ ...prev, name: parsedStopName, short_name: shortenedStopName }));
	}, []);

	const setNewStopLocality = useCallback((locality) => {
		// Validate stop name
		let parsedStopLocality = locality;
		// Remove double spaces
		parsedStopLocality = parsedStopLocality.replace(/\s\s+/g, ' ');
		// Set new stop info
		setNewStopState(prev => ({ ...prev, locality: parsedStopLocality }));
	}, []);

	const confirmNewStopCreation = useCallback(async () => {
		try {
			setWizardState(prev => ({ ...prev, is_loading: true }));
			const response = await API({ body: newStopState, method: 'POST', operation: 'create', service: 'stops' });
			setWizardState(prev => ({ ...prev, is_loading: false }));
			setNewStopId(response._id);
			router.push(`/stops/${response._id}`);
			advanceWizardToNextStep();
		}
		catch (error) {
			console.log(error);
			setWizardState(prev => ({ ...prev, is_error: error.message, is_loading: false }));
		}
	}, [advanceWizardToNextStep, newStopState, router]);

	const goToNewStop = useCallback(() => {
		closeWizard();
	}, [closeWizard]);

	//
	// E. Setup context object

	const contextObject = useMemo(
		() => ({
			advanceWizardToNextStep: advanceWizardToNextStep,
			closeWizard: closeWizard,
			confirmNewStopCreation: confirmNewStopCreation,
			goToNewStop: goToNewStop,
			//
			newStop: newStopState,
			//
			newStopId: newStopId,
			openWizard: openWizard,
			returnWizardToPreviousStep: returnWizardToPreviousStep,
			setNewStopCoordinates: setNewStopCoordinates,
			setNewStopLocality: setNewStopLocality,
			setNewStopName: setNewStopName,
			//
			wizard: wizardState,
		}),
		[wizardState, openWizard, closeWizard, returnWizardToPreviousStep, advanceWizardToNextStep, goToNewStop, confirmNewStopCreation, newStopState, setNewStopCoordinates, setNewStopName, setNewStopLocality, newStopId],
	);

	//
	// D. Return provider

	return (
		<StopsExplorerNewStopWizardContext.Provider value={contextObject}>
			<StopsExplorerNewStopWizard />
			{children}
		</StopsExplorerNewStopWizardContext.Provider>
	);

	//
}
