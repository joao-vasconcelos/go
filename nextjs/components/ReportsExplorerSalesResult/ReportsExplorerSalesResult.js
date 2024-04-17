'use client';

/* * */

import { useTranslations } from 'next-intl';
import { useReportsExplorerSalesContext } from '@/contexts/ReportsExplorerSalesContext';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import ReportsExplorerSalesResultError from '@/components/ReportsExplorerSalesResultError/ReportsExplorerSalesResultError';
import ReportsExplorerSalesResultLoading from '@/components/ReportsExplorerSalesResultLoading/ReportsExplorerSalesResultLoading';
import ReportsExplorerSalesResultSummary from '@/components/ReportsExplorerSalesResultSummary/ReportsExplorerSalesResultSummary';

/* * */

export default function ReportsExplorerSalesResult() {
  //

  //
  // A. Setup variables

  const t = useTranslations('ReportsExplorerSalesResult');
  const reportsExplorerSalesContext = useReportsExplorerSalesContext();

  //
  // B. Render components

  if (reportsExplorerSalesContext.request.is_error) {
    return <ReportsExplorerSalesResultError />;
  } else if (reportsExplorerSalesContext.request.is_loading) {
    return <ReportsExplorerSalesResultLoading />;
  } else if (reportsExplorerSalesContext.request.result) {
    return <ReportsExplorerSalesResultSummary />;
  } else {
    return <NoDataLabel text={t('no_data')} fill />;
  }

  //
}
