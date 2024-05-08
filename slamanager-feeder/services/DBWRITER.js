/* * */

class DBWRITER {
	//

	INSTANCE_NAME = 'Unnamed Instance';

	MAX_BATCH_SIZE = 3000;

	DB_COLLECTION = null;

	CURRENT_BATCH_DATA = [];

	/* * */

	constructor(instanceName, collection, options = {}) {
		if (instanceName) this.INSTANCE_NAME = instanceName;
		if (collection) this.DB_COLLECTION = collection;
		if (options.batch_size) this.MAX_BATCH_SIZE = options.batch_size;
	}

	/* * */

	async write(data, options = {}) {
		// Check if the batch is full
		if (this.CURRENT_BATCH_DATA.length >= this.MAX_BATCH_SIZE) {
			await this.flush();
		}
		// Add the data to the batch
		if (Array.isArray(data)) {
			const combinedDataWithOptions = data.map((item) => ({ data: item, options: options }));
			this.CURRENT_BATCH_DATA = [...this.CURRENT_BATCH_DATA, ...combinedDataWithOptions];
		} else {
			this.CURRENT_BATCH_DATA.push({ data: data, options: options });
		}
		//
	}

	/* * */

	async flush() {
		try {
			//

			console.log(`→ DBWRITER [${this.INSTANCE_NAME}]: Flush Request | Length: ${this.CURRENT_BATCH_DATA.length} | DB Collection: ${this.DB_COLLECTION.collectionName}`);

			if (this.CURRENT_BATCH_DATA.length === 0) return;

			const writeOperations = this.CURRENT_BATCH_DATA.map((item) => {
				switch (item.options?.write_mode) {
				default:
				case 'replace':
					return {
						replaceOne: {
							filter: item.options.filter,
							replacement: item.data,
							upsert: true,
						},
					};
				case 'update':
					return {
						updateOne: {
							filter: item.options.filter,
							update: item.data,
							upsert: true,
						},
					};
				}
			});

			await this.DB_COLLECTION.bulkWrite(writeOperations);

			this.CURRENT_BATCH_DATA = [];

			//
		} catch (error) {
			console.log(`✖︎ Error at DBWRITER.flush(): ${error.message}`);
		}
	}
}

module.exports = DBWRITER;