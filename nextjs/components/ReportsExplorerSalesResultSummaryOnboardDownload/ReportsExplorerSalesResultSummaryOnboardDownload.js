'use client';

/* * */

import { useTranslations } from 'next-intl';
import { Button, SimpleGrid, Table } from '@mantine/core';
import StatCard from '@/components/StatCard/StatCard';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import { useReportsExplorerSalesContext } from '@/contexts/ReportsExplorerSalesContext';
import { useState } from 'react';
import API from '@/services/API';

/* * */

export default function ReportsExplorerSalesResultSummaryOnboardDownload() {
  //

  //
  // A. Setup variables

  const t = useTranslations('ReportsExplorerSalesResultSummaryOnboardDownload');
  const reportsExplorerSalesContext = useReportsExplorerSalesContext();
  const [isLoading, setIsLoading] = useState(false);

  //
  // C. Handle actions

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      const responseBlob = await API({ service: 'reports/sales/onboard', operation: 'detail', method: 'POST', body: reportsExplorerSalesContext.getRequestBodyFormatted(), parseType: 'blob' });
      const objectURL = URL.createObjectURL(responseBlob);
      const zipDownload = document.createElement('a');
      zipDownload.href = objectURL;
      zipDownload.download = 'report.csv';
      document.body.appendChild(zipDownload);
      zipDownload.click();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  //
  // D. Render components

  return (
    <Button onClick={handleDownload} loading={isLoading}>
      Download
    </Button>
  );

  //
}
