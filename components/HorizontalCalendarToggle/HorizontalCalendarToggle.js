'use client';

import { styled } from '@stitches/react';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import DateCardToggle from './DateCardToggle';

const TableContainer = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '1px',
  backgroundColor: '$gray0',
  overflow: 'scroll',
});

const TableRow = styled('div', {
  display: 'grid',
  gridTemplateColumns: '200px repeat(42, 30px)',
  alignItems: 'center',
  gap: '1px',
});

const TableHeader = styled(TableRow, {
  position: 'sticky',
  backgroundColor: '$gray3',
});

const TableBody = styled('div', {
  display: 'grid',
  gap: '1px',
  width: '100%',
});

const TableBodyRow = styled(TableRow, {
  //   backgroundColor: '$gray0',
});

const TableCell = styled('div', {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
});

const TableCellHeader = styled(TableCell, {
  minHeight: '25px',
  fontWeight: '$medium',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  fontSize: '11px',
});

const TableCellBody = styled(TableCell, {
  minHeight: '30px',
  alignItems: 'center',
  justifyContent: 'center',
});

export default function HorizontalCalendarToggle({ allDates, activeDates, onUpdateDate, onDeleteDate, onToggleDate }) {
  //

  //
  // A. Setup variables

  const [allDatesFormatted, setAllDatesFormatted] = useState();

  //
  // B. Fetch data

  //
  // C. Handle actions

  //
  // D. Render components

  useEffect(() => {
    //

    // 1. Exit if allDates is not defined
    if (!allDates || !allDates.length) return;

    // 2. Sort the array to ensure we get the whole range of dates in the database
    const sortedDates = allDates.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

    // 3. Create the placeholder dates from the first and last dates in the database
    let allPlaceholderDatesInRange = [];
    let currentDate = dayjs(sortedDates[0].date).startOf('month');
    const lastDate = dayjs(sortedDates[sortedDates.length - 1].date)
      .endOf('month')
      .format('YYYYMMDD');
    while (currentDate.format('YYYYMMDD') <= lastDate) {
      allPlaceholderDatesInRange.push(currentDate.format('YYYYMMDD'));
      currentDate = currentDate.add(1, 'day');
    }

    // 4. Now, for each date from the database, match it with each placeholder dates arra
    for (let i = 0; i < allPlaceholderDatesInRange.length; i++) {
      const placeholderDate = allPlaceholderDatesInRange[i];
      // Find the corresponding object in arrayB
      const actualDateObject = allDates.find((dateObject) => dateObject.date === placeholderDate);
      // If the object exists, assign its properties to the date in arrayA
      if (actualDateObject) allPlaceholderDatesInRange[i] = { ...actualDateObject, card_type: 'date', active: false };
      else allPlaceholderDatesInRange[i] = { date: placeholderDate, card_type: 'placeholder', active: false };
    }

    // 5. Find out if each date is active or not
    for (let i = 0; i < allPlaceholderDatesInRange.length; i++) {
      // Find the corresponding object in arrayB
      const activeDate = activeDates.find((dateObject) => dateObject.date === allPlaceholderDatesInRange[i].date);
      // If the object exists, assign its properties to the date in arrayA
      if (activeDate) allPlaceholderDatesInRange[i] = { ...allPlaceholderDatesInRange[i], ...activeDate, active: 'true' };
    }

    // 5. Now that we have a complete set of dates, we can organize them by month
    const allDatesOrganizedByMonth = allPlaceholderDatesInRange.reduce((acc, dateItem) => {
      // Setup the variable for this iteration
      const monthSortKey = dayjs(dateItem.date, 'YYYYMMDD').format('YYYYMM');
      const monthNumber = dayjs(dateItem.date, 'YYYYMMDD').month();
      const monthName = dayjs(dateItem.date, 'YYYYMMDD').format('MMMM YYYY');
      const monthIndex = acc.findIndex((month) => month.sort_key === monthSortKey);
      // Month doesn't exist in the array yet, create a new month object
      if (monthIndex === -1) acc.push({ sort_key: monthSortKey, month_number: monthNumber, month_name: monthName, days: [dateItem] });
      // Month already exists in the array, add the date object to its days array
      else acc[monthIndex].days.push(dateItem);
      // Return the updated accumulator
      return acc;
    }, []);

    // 6. With the organized dates, we can sort each months days and prepare them for display
    const allDatesPreparedForDisplay = allDatesOrganizedByMonth.map((month) => {
      // Sort this months days just to make sure
      const sortedDays = month.days.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
      // Add empty objects to align the days by weekday type
      const firstDayOfThisMonthWeekdayType = dayjs(sortedDays[0].date).day();
      const numberOfSpacersToAddForAlignment = firstDayOfThisMonthWeekdayType === 0 ? 6 : firstDayOfThisMonthWeekdayType - 1;
      const spacersToAddForAlignment = Array.from({ length: numberOfSpacersToAddForAlignment }, (_, i) => ({
        date: '',
        card_type: 'spacer',
      }));
      // Return this months formatted dates
      return { ...month, days: [...spacersToAddForAlignment, ...sortedDays] };
    });

    // 7. Sort the months
    const allDatesReadyForCalendar = allDatesPreparedForDisplay.sort((a, b) => (a.sort_key < b.sort_key ? -1 : a.sort_key > b.sort_key ? 1 : 0));

    // 8. Update state
    setAllDatesFormatted(allDatesReadyForCalendar);

    //
  }, [activeDates, allDates]);

  //
  // D. Render components

  const CalendarHeader = () => {
    //

    if (!allDatesFormatted) return <div>Loading</div>;

    let longestArrayLength = 0;
    for (let i = 0; i < allDatesFormatted.length; i++) {
      if (allDatesFormatted[i].days.length > longestArrayLength) {
        longestArrayLength = allDatesFormatted[i].days.length;
      }
    }

    let headerCells = [];
    while (headerCells.length < longestArrayLength) {
      headerCells = [...headerCells, 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];
    }

    return (
      <TableHeader>
        <TableCellHeader>Mês</TableCellHeader>
        {headerCells.map((weekdayString, index) => (
          <TableCellHeader key={index}>{weekdayString}</TableCellHeader>
        ))}
      </TableHeader>
    );
  };

  return (
    <TableContainer>
      <CalendarHeader />
      <TableBody>
        {allDatesFormatted &&
          allDatesFormatted.map((month, index) => (
            <TableBodyRow key={index}>
              <TableCellBody>{month.month_name}</TableCellBody>
              {month.days.map((dateObj, index) => (
                <DateCardToggle key={index} cardType={dateObj.card_type} dateObj={dateObj} date={dateObj.date} onToggleDate={onToggleDate} />
              ))}
            </TableBodyRow>
          ))}
      </TableBody>
    </TableContainer>
  );
}
