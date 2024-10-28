import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
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
    console.log(increment)
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
    setSelectedMonths([...localMonths])

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
    }
  };

  const renderDatePicker = () => {
    const calendar = generateCalendar();
    const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    return (
      <>
        <div className="grid grid-cols-8 gap-px bg-gray-200">
          <div className="bg-gray-100 p-2 text-sm font-medium text-gray-600">
            Week
          </div>
          {weekDays.map((day, index) => (
            <div
              key={index}
              className="bg-gray-100 p-2 text-center text-sm font-medium text-gray-600"
            >
              {day}
            </div>
          ))}

          {Array.from({ length: Math.ceil(calendar.length / 7) }).map((_, weekIndex) => (
            <React.Fragment key={weekIndex}>
              <div className="bg-white p-2 text-sm font-medium text-gray-600 border-t">
                {calendar[weekIndex * 7]?.fiscalWeek}
              </div>
              {calendar.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, dayIndex) => {
                const isCurrentMonth = day.date.getMonth() === currentDate.getMonth();
                const isToday = day.date.toDateString() === new Date().toDateString();
                const isSelected = isDateSelected(day.date);

                return (
                  <button
                    key={dayIndex}
                    onClick={() => toggleDateSelection(day.date)}
                    className={`
                      relative w-full h-full p-2 text-center border-t transition-colors
                      ${isCurrentMonth ? 'hover:bg-blue-50' : 'hover:bg-gray-50'}
                      ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                      ${isToday ? 'font-bold' : ''}
                      ${isSelected ? 'bg-blue-100 hover:bg-blue-200' : 'bg-white'}
                    `}
                  >
                    <span className={`
                      ${isSelected ? 'relative z-10' : ''}
                    `}>
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
    return (<div className="year-number-container flex" style={{ width: '100%', justifyContent: 'space-evenly' }}>
      {yearRange.map((year) => {
        const activeyear = selectedYears.includes(year.toString());
        return (
          <div
            key={year}
            className={`flex-1 px-8 py-2 text-m border ${activeyear
              ? 'bg-blue-50 border-blue-500 text-blue-700'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              } ''`}>
            {year}
          </div>
        );
      })
      }
    </div >)
  }

  const renderYearMonthPicker = () => {
    const months = generateYearMonths();

    return (
      <div className="grid grid-cols-3 gap-4 p-4">
        {months.map((month, index) => {
          const isCurrentMonth = month.date.getMonth() === new Date().getMonth() &&
            month.date.getFullYear() === new Date().getFullYear();
          const isSelected = isMonthSelected(month.date);

          return (
            <button
              key={index}
              onClick={() => toggleMonthSelection(month.date)}
              className={`
                p-4 rounded-lg text-center transition-colors
            ${isSelected ? 'bg-blue-100 hover:bg-blue-200' : 'hover:bg-gray-50'}
            ${isCurrentMonth ? 'font-bold' : ''}
              `}
            >
              <div className="text-sm text-gray-600">FY{month.fiscalYear}</div>
              <div className="font-medium">
                {month.date.toLocaleString('default', { month: 'short' })}
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
        <button
          onClick={() => mode === 'date' ? changeMonth(-1) : mode === 'yearQuarterMonth' || mode === 'yearMonth' ? changeYear(-1) : changeYears(-1)}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          aria-label={mode === 'date' ? "Previous month" : "Previous year"}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        {mode === 'multiYearQuarterMonth' ? renderMultiYearRange([currentDate.getFullYear() - 1, currentDate.getFullYear(), currentDate.getFullYear() + 1]) :
          <h2 className="text-lg font-semibold">
            {mode === 'date'
              ? currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
              : currentDate.getFullYear().toString()
            }
          </h2>}

        <button
          onClick={() => mode === 'date' ? changeMonth(1) : mode === 'yearQuarterMonth' || mode === 'yearMonth' ? changeYear(1) : changeYears(1)}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          aria-label={mode === 'date' ? "Next month" : "Next year"}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {((mode === 'date' && selectedDates.length > 0) ||
        (mode === 'yearMonth' && selectedMonths.length > 0) ||
        (mode === 'yearQuarterMonth' && (selectedMonths.length > 0 || selectedQuarters.length > 0))) && (
          <div className="px-4 py-2 bg-blue-50 border-b flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {mode === 'date'
                ? `${selectedDates.length} date${selectedDates.length !== 1 ? 's' : ''} selected`
                : mode === 'yearMonth'
                  ? `${selectedMonths.length} month${selectedMonths.length !== 1 ? 's' : ''} selected`
                  : `${selectedQuarters.length} quarter${selectedQuarters.length !== 1 ? 's' : ''}, ${selectedMonths.length} month${selectedMonths.length !== 1 ? 's' : ''} selected`
              }
            </span>
            <button
              onClick={clearSelection}
              className="flex items-center text-sm text-blue-700 hover:text-blue-900"
            >
              <X className="w-4 h-4 mr-1" />
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