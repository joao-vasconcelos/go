/* * */

export const availableLocales = ['pt-PT'];

/* * */

export const availableFormats = {
	number: {
		kilometers: {
			style: 'unit',
			unit: 'kilometer',
			unitDisplay: 'short',
			maximumFractionDigits: 2,
		},
		currency_euro: {
			currencySign: 'standard',
			style: 'currency',
			currency: 'EUR',
		},
		percentage: {
			style: 'unit',
			unit: 'percent',
			maximumFractionDigits: 2,
		},
	},
	dateTime: {
		timestamp: {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		},
	},
};