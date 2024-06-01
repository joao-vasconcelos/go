/* * */

import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import { useReportsExplorerSlaContext } from '@/contexts/ReportsExplorerSlaContext';
import { DataTable } from 'mantine-datatable';
import { useRouter } from 'next/navigation';

/* * */

const PAGE_SIZES = [10, 15, 20];

/* * */

export default function ReportsExplorerSlaList() {
	//

	//
	// A. Setup variables

	const router = useRouter();
	const reportsExplorerSlaContext = useReportsExplorerSlaContext();

	//
	// B. Render components

	const handleRowClick = ({ record }) => {
		router.push(`/reports/sla/${record.code}`);
	};

	//
	// B. Render components

	return (
		<DataTable
			emptyState={<NoDataLabel />}
			fetching={reportsExplorerSlaContext.form.is_loading}
			idAccessor="code"
			onPageChange={reportsExplorerSlaContext.handleTablePageChange}
			onRowClick={handleRowClick}
			page={reportsExplorerSlaContext.form.table_current_page}
			records={reportsExplorerSlaContext.form.list_data}
			recordsPerPage={10}
			recordsPerPageOptions={PAGE_SIZES}
			totalRecords={reportsExplorerSlaContext.form.list_data.length}
			columns={[
				{ accessor: 'archive_id' },
				{ accessor: 'agency_id' },
				{ accessor: 'operational_day' },
				{ accessor: 'pattern_id' },
				{ accessor: 'status' },
				{ accessor: 'trip_id' },
			]}
			highlightOnHover
			striped
			textSelectionDisabled
		/>
	);

	//
}
