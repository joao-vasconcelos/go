/* * */

export const availableLocales = ['pt-PT'];

/* * */

export const availableFormats = {
	dateTime: {
		timestamp: {
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			month: 'long',
			year: 'numeric',
		},
	},
	number: {
		currency_euro: {
			currency: 'EUR',
			currencySign: 'standard',
			style: 'currency',
		},
		kilometers: {
			maximumFractionDigits: 2,
			style: 'unit',
			unit: 'kilometer',
			unitDisplay: 'short',
		},
		percentage: {
			maximumFractionDigits: 2,
			style: 'unit',
			unit: 'percent',
		},
	},
};
