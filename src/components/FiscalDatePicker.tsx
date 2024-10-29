import React, { useState } from 'react';
import { FiscalQuarterPicker } from './FiscalQuarterPicker';

interface FiscalDatePickerProps {
  fiscalStartMonth: number; // 1-12 (January = 1, December = 12)
  mode: 'date' | 'yearMonth' | 'yearQuarterMonth' | 'multiYearQuarterMonth';
}

const FiscalDatePicker: React.FC<FiscalDatePickerProps> = ({ fiscalStartMonth = 1, mode = 'date' }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [selectedQuarters, setSelectedQuarters] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([currentDate.getFullYear().toString()]);
  const [yearsRange, setYearsRange] = useState<number[]>([currentDate.getFullYear() - 1, currentDate.getFullYear(), currentDate.getFullYear() + 1]);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFiscalWeek = (date: Date) => {
    const fiscalYearStart = new Date(
      date.getMonth() < fiscalStartMonth - 1
        ? date.getFullYear() - 1
        : date.getFullYear(),
      fiscalStartMonth - 1,
      1
    );

    const diffTime = date.getTime() - fiscalYearStart.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.ceil((diffDays + fiscalYearStart.getDay()) / 7);
  };

  const getFiscalYear = (date: Date) => {
    return date.getMonth() < fiscalStartMonth - 1
      ? date.getFullYear()
      : date.getFullYear() + 1;
  };

  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = getDaysInMonth(year, month);
    const daysInPrevMonth = getDaysInMonth(year, month - 1);

    const calendar: Array<{ date: Date; fiscalWeek: number }> = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, daysInPrevMonth - i);
      calendar.push({
        date,
        fiscalWeek: getFiscalWeek(date),
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      calendar.push({
        date,
        fiscalWeek: getFiscalWeek(date),
      });
    }

    // Next month days
    const remainingDays = 42 - calendar.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      calendar.push({
        date,
        fiscalWeek: getFiscalWeek(date),
      });
    }

    return calendar;
  };

  const generateYearMonths = () => {
    const year = currentDate.getFullYear();
    const months = [];

    for (let month = 0; month < 12; month++) {
      const date = new Date(year, month, 1);
      const fiscalYear = getFiscalYear(date);
      months.push({
        date,
        fiscalYear,
      });
    }

    return months;
  };

  const changeMonth = (increment: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
  };

  const changeYear = (increment: number) => {
    setCurrentDate(new Date(currentDate.getFullYear() + increment, currentDate.getMonth(), 1));
  };

  const changeYears = (increment: number) => {
    setYearsRange([yearsRange[0] + increment, yearsRange[1] + increment, yearsRange[2] + increment]);
  };

  const toggleDateSelection = (date: Date) => {
    const dateString = date.toDateString();
    const isSelected = selectedDates.some(d => d.toDateString() === dateString);

    if (isSelected) {
      setSelectedDates(selectedDates.filter(d => d.toDateString() !== dateString));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const toggleYearSelection = (yearKey: string) => {
    const isSelected = selectedYears.includes(yearKey);
    if (isSelected && selectedYears.length > 1) {
      setSelectedYears(selectedYears.filter(m => m !== yearKey));
    } else {
      setSelectedYears([...selectedYears, yearKey]);
    }
  };

  const toggleMonthSelection = (date: Date) => {
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    const isSelected = selectedMonths.includes(monthKey);

    if (isSelected) {
      setSelectedMonths(selectedMonths.filter(m => m !== monthKey));
    } else {
      setSelectedMonths([...selectedMonths, monthKey]);
    }
  };

  const toggleQuarterSelection = (dateArr: Array<Date>, selected: boolean) => {
    let localMonths: Array<string> = [...selectedMonths];
    dateArr.forEach(date => {
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const isSelected = localMonths.includes(monthKey);
      if (isSelected && selected) {
        localMonths = localMonths.filter(m => m !== monthKey);
      } else {
        localMonths = [...localMonths, monthKey];
      }
    });
    localMonths = [...new Set(localMonths)];
    setSelectedMonths([...localMonths])

  };

  const toggleWeekSelection = (dateArr: Array<Date>) => {
    let localDates: Array<Date> = [...selectedDates];
    dateArr.forEach(date => {
      const dateString = date.toDateString();
      const isSelected = localDates.some(d => d.toDateString() === dateString);
      if (isSelected) {
        localDates = localDates.filter(d => d.toDateString() !== dateString);
      } else {
        localDates = [...localDates, date];
      }
    });
    localDates = [...new Set(localDates)];
    setSelectedDates([...localDates])
  };

  const isDateSelected = (date: Date) => {
    return selectedDates.some(d => d.toDateString() === date.toDateString());
  };

  const isMonthSelected = (date: Date) => {
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    return selectedMonths.includes(monthKey);
  };

  const clearSelection = () => {
    if (mode === 'date') {
      setSelectedDates([]);
    } else if (mode === 'yearMonth') {
      setSelectedMonths([]);
    } else {
      setSelectedMonths([]);
      setSelectedQuarters([]);
      setSelectedYears([]);
      setYearsRange([currentDate.getFullYear() - 1, currentDate.getFullYear(), currentDate.getFullYear() + 1])
    }
  };

  const renderDatePicker = () => {
    const calendar = generateCalendar();
    const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    return (
      <>
        <div className="date-picker-grid">
          <div className="date-picker-header">
            Wk No
          </div>
          {weekDays.map((day, index) => (
            <div
              key={index}
              className="date-picker-header"
            >
              {day}
            </div>
          ))}

          {Array.from({ length: Math.ceil(calendar.length / 7) }).map((_, weekIndex) => (
            <React.Fragment key={weekIndex}>
              <button
                className="date-picker-button"
                onClick={() => {
                  const weekStartDate = calendar[weekIndex * 7].date;
                  const weekDates = getWeekDates(weekStartDate);
                  toggleWeekSelection(weekDates);
                }}
              >
                {calendar[weekIndex * 7]?.fiscalWeek}
              </button>
              {calendar.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, dayIndex) => {
                const isCurrentMonth = day.date.getMonth() === currentDate.getMonth();
                const isToday = day.date.toDateString() === new Date().toDateString();
                const isSelected = isDateSelected(day.date);
                const isWeekend = day.date.getDay() === 5 || day.date.getDay() === 6;
                return (
                  <button
                    key={dayIndex}
                    onClick={() => toggleDateSelection(day.date)}
                    className="date-picker-day" style={{
                      ...(isCurrentMonth ? { backgroundColor: 'white', ':hover': { backgroundColor: '#f3f4f6' } } : { backgroundColor: 'white', ':hover': { backgroundColor: '#f9fafb' } }),
                      ...(isCurrentMonth ? { color: '#3b82f6' } : { color: '#6B7280' }),
                      ...(isToday ? { fontWeight: 'bold' } : {}),
                      ...(isWeekend ? { fontStyle: 'italic' } : {}),
                      ...(isSelected ? { backgroundColor: '#f3f4f6', ':hover': { backgroundColor: '#3b82f6' } } : { backgroundColor: 'white' }),
                    }}
                  >
                    <span style={{ ...(isSelected ? { position: 'relative', zIndex: '10' } : '') }}>
                      {day.date.getDate()}
                    </span>
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </>
    );
  };

  const renderMultiYearRange = (yearRange: number[]) => {
    return (<div className="multi-year-range">
      {yearRange.map((year) => {
        const activeyear = selectedYears.includes(year.toString());
        return (
          <button
            key={year}
            className="multi-year-button"
            style={{
              ...(activeyear ? {
                backgroundColor: '#f3f4f6',
                borderColor: '#3b82f6',
                color: '#3b82f6',
              } : {
                backgroundColor: '#ffffff',
                borderColor: '#6B7280',
                color: '#6B7280',
                ':hover': {
                  backgroundColor: '#f3f4f6',
                },
              }),
            }}
            onClick={() => toggleYearSelection(year.toString())}>
            {year}
          </button>
        );
      })
      }
    </div >)
  }

  const renderYearMonthPicker = () => {
    const months = generateYearMonths();

    return (
      <div className="year-month-picker">
        {months.map((month, index) => {
          const isCurrentMonth = month.date.getMonth() === new Date().getMonth() &&
            month.date.getFullYear() === new Date().getFullYear();
          const isSelected = isMonthSelected(month.date);

          return (
            <button
              key={index}
              onClick={() => toggleMonthSelection(month.date)}
              className="year-month-button"
              style={{
                ...(isSelected ? {
                  backgroundColor: '#bfdbfe',
                  ':hover': {
                    backgroundColor: '#bfdbfe',
                  },
                } : {
                  ':hover': {
                    backgroundColor: '#f3f4f6',
                  },
                }),
                ...(isCurrentMonth ? {
                  fontWeight: 'bold',
                } : {}),
              }}
            >
              <div className="year-month-fiscal-year">{fiscalStartMonth !== 1 ? "FY" + month.fiscalYear.toString().slice(2) : ''}</div>
              <div className="year-month-month">
                {month.date.toLocaleString('default', { month: 'short' })}
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  const getWeekDates = (startDate: Date): Date[] => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  return (
    <div className="fiscal-date-picker">
      <div className="date-picker-header">
        <button
          onClick={() => mode === 'date' ? changeMonth(-1) : mode === 'yearQuarterMonth' || mode === 'yearMonth' ? changeYear(-1) : changeYears(-1)}
          className="date-picker-nav-button"
        >
          <label className="date-picker-nav-label" >&lt;</label>
        </button>
        {mode === 'multiYearQuarterMonth' ? renderMultiYearRange(yearsRange) :
          <h2 className="date-picker-header">
            {mode === 'date'
              ? currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }) + ' - FY' + getFiscalYear(currentDate).toString().slice(2)
              : mode === 'yearQuarterMonth' ? 'FY ' + currentDate.getFullYear().toString() : currentDate.getFullYear().toString()
            }
          </h2>}

        <button
          onClick={() => mode === 'date' ? changeMonth(1) : mode === 'yearQuarterMonth' || mode === 'yearMonth' ? changeYear(1) : changeYears(1)}
          className="date-picker-nav-button"
        >
          <label className="date-picker-nav-label" >&gt;</label>
        </button>
      </div>

      {((mode === 'date' && selectedDates.length > 0) ||
        (mode === 'yearMonth' && selectedMonths.length > 0) ||
        ((mode === 'yearQuarterMonth' || mode === 'multiYearQuarterMonth') && (selectedMonths.length > 0 || selectedQuarters.length > 0))) && (
          <div className="date-picker-selection">
            <span className="date-picker-selection-text">
              {mode === 'date'
                ? selectedDates.length < 2 ? selectedDates[0].toDateString() + ' selected' : `${selectedDates.length} date${selectedDates.length !== 1 ? 's' : ''} selected`
                : mode === 'yearMonth'
                  ? selectedMonths.length < 2 ? selectedMonths[0] + ' selected' : `${selectedMonths.length} month${selectedMonths.length !== 1 ? 's' : ''} selected`
                  : selectedMonths.length < 2 && mode === 'yearQuarterMonth' ? selectedMonths[0] + ' selected' : `${selectedQuarters.length} quarter${selectedQuarters.length !== 1 ? 's' : ''}, ${selectedMonths.length} month${selectedMonths.length !== 1 ? 's' : ''} selected`
              }
            </span>
            <button
              onClick={clearSelection}
              className="date-picker-clear-button"
            >
              <label className="date-picker-clear-label" >X</label>
              Clear
            </button>
          </div>
        )}

      {mode === 'date' ? renderDatePicker() :
        mode === 'yearMonth' ? renderYearMonthPicker() :
          <FiscalQuarterPicker
            currentDate={currentDate}
            fiscalStartMonth={fiscalStartMonth}
            selectedMonths={selectedMonths}
            selectedQuarters={selectedQuarters}
            onMonthSelect={toggleMonthSelection}
            onQuarterToggleSelect={toggleQuarterSelection}
            onQuarterSelect={(quarter) => {
              const isSelected = selectedQuarters.includes(quarter);
              if (isSelected) {
                setSelectedQuarters(selectedQuarters.filter(q => q !== quarter));
              } else {
                setSelectedQuarters([...selectedQuarters, quarter]);
              }
            }}
          />}
    </div>
  );
};

export default FiscalDatePicker;
