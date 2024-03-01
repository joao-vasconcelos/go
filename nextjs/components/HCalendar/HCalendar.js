'use client';

import { useMemo } from 'react';
import styles from './HCalendar.module.css';
import dayjs from 'dayjs';
import HCalendarSpacer from '../HCalendarSpacer/HCalendarSpacer';
import HCalendarPlaceholder from '../HCalendarPlaceholder/HCalendarPlaceholder';

export default function HCalendar({ availableDates, renderCardComponent, onMultiSelect }) {
  //

  //
  // A. Setup variables

  const allDatesFormatted = useMemo(() => {
    //

    // 1. Exit if availableDates is not defined
    if (!availableDates || !availableDates.length) return [];

    // 2. Sort the array to ensure we get the whole range of dates in the database
    const sortedDates = availableDates.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

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
      const actualDateObject = availableDates.find((dateObject) => dateObject.date === placeholderDate);
      // If the object exists, assign its properties to the date in arrayA
      if (actualDateObject) allPlaceholderDatesInRange[i] = { ...actualDateObject, card_type: 'date' };
      else allPlaceholderDatesInRange[i] = { date: placeholderDate, card_type: 'placeholder' };
    }

    // 5. Now that we have a complete set of dates, we can organize them by month
    const allDatesOrganizedByMonth = allPlaceholderDatesInRange.reduce((acc, dateItem) => {
      // Setup the variable for this iteration
      const monthSortKey = dayjs(dateItem.date, 'YYYYMMDD').format('YYYYMM');
      const monthNumber = dayjs(dateItem.date, 'YYYYMMDD').month();
      const monthName = dayjs(dateItem.date, 'YYYYMMDD').format('MMM YYYY');
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
    return allDatesReadyForCalendar;

    //
  }, [availableDates]);

  //
  // D. Render components

  const handleReferenceClick = () => {
    if (!onMultiSelect) return;
    onMultiSelect(availableDates);
  };

  const handleDayTypeClick = (columnIndex) => {
    if (!onMultiSelect) return;
    let matchingDates = [];
    for (const month of allDatesFormatted) {
      if (month.days.length > columnIndex) {
        if (month.days[columnIndex].date) {
          matchingDates.push(month.days[columnIndex]);
        }
      }
    }
    onMultiSelect(matchingDates);
  };

  const handleMonthClick = (month) => {
    if (!onMultiSelect) return;
    const matchingDates = availableDates.filter((dateObj) => {
      return dateObj.date.includes(month.sort_key);
    });
    onMultiSelect(matchingDates);
  };

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
      <div className={styles.tableHeaderRow}>
        <div className={styles.tableHeaderCell} onClick={handleReferenceClick}>
          Mês
        </div>
        {headerCells.map((weekdayString, index) => (
          <div key={index} className={styles.tableHeaderCell} onClick={() => handleDayTypeClick(index)}>
            {weekdayString}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <CalendarHeader />
      <div className={styles.tableBody}>
        {allDatesFormatted &&
          allDatesFormatted.map((month, index) => (
            <>
              <div key={index} className={styles.tableBodyRow}>
                <div className={`${styles.tableBodyCell} ${styles.monthCell}`} onClick={() => handleMonthClick(month)}>
                  {month.month_name}
                </div>
                {month.days.map((dateObj, index) => {
                  switch (dateObj.card_type) {
                    default:
                    case 'spacer':
                      return <HCalendarSpacer key={index} />;
                    case 'placeholder':
                      return <HCalendarPlaceholder key={index} date={dateObj.date} />;
                    case 'date':
                      return renderCardComponent({ key: index, date: dateObj.date, dateObj: dateObj });
                  }
                })}
              </div>
              {month.month_number === 11 && index < allDatesFormatted.length - 1 && <div className={styles.lastMonthOfYear} />}
            </>
          ))}
      </div>
    </div>
  );
}
