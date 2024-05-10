/* * */

import { DataTable } from 'mantine-datatable';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import { useReportsExplorerSlaContext } from '@/contexts/ReportsExplorerSlaContext';
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
			striped
			highlightOnHover
			textSelectionDisabled
			page={reportsExplorerSlaContext.form.table_current_page}
			onPageChange={reportsExplorerSlaContext.handleTablePageChange}
			fetching={reportsExplorerSlaContext.form.is_loading}
			totalRecords={reportsExplorerSlaContext.form.list_data.length}
			recordsPerPage={10}
			recordsPerPageOptions={PAGE_SIZES}
			columns={[
				{ accessor: 'archive_id' },
				{ accessor: 'agency_id' },
				{ accessor: 'operational_day' },
				{ accessor: 'pattern_id' },
				{ accessor: 'status' },
				{ accessor: 'trip_id' },
				{ accessor: 'analysis' },
			]}
			records={reportsExplorerSlaContext.form.list_data}
			emptyState={<NoDataLabel/>}
			onRowClick={handleRowClick}
			idAccessor="code"
		/>
	);

	//
}