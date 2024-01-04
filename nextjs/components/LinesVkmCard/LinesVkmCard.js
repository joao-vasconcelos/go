/* * */

import { NumberFormatter } from '@mantine/core';
import StatCard from '@/components/StatCard/StatCard';

/* * */

export default function LinesVkmCard({ isLoading, label, value }) {
  //

  //
  // A. Setup variables

  //
  // B. Fetch data

  //
  // C. Render components

  return <StatCard isLoading={isLoading} title={label} value={value} displayValue={value ? <NumberFormatter value={value} suffix=" km" thousandSeparator=" " decimalSeparator="," decimalScale={2} /> : '-'} />;

  //
}
