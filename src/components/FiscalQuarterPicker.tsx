import React from 'react';

interface FiscalQuarterPickerProps {
  currentDate: Date;
  fiscalStartMonth: number;
  selectedMonths: string[];
  selectedQuarters: string[];
  onMonthSelect: (date: Date) => void;
  onQuarterToggleSelect: (dateArr: Array<Date>, selected: boolean) => void;
  onQuarterSelect: (quarter: string) => void;
}

export const FiscalQuarterPicker: React.FC<FiscalQuarterPickerProps> = ({
  currentDate,
  fiscalStartMonth,
  selectedMonths,
  selectedQuarters,
  onMonthSelect,
  onQuarterToggleSelect,
  onQuarterSelect,
}) => {
  const getQuarterMonths = (quarter: number) => {
    const startMonth = ((quarter - 1) * 3 + fiscalStartMonth - 1 + 12) % 12;
    return Array.from({ length: 3 }, (_, i) => (startMonth + i) % 12);
  };

  const isMonthSelected = (date: Date) => {
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    return selectedMonths.includes(monthKey);
  };

  const isQuarterSelected = (quarter: string) => {
    return selectedQuarters.includes(quarter);
  };

  const handleQuarterSelect = (quarter: number) => {
    const year = currentDate.getFullYear();
    const quarterKey = `${year}-Q${quarter}`;
    const quarterMonths = getQuarterMonths(quarter);
    const isSelected = isQuarterSelected(quarterKey);

    // Toggle quarter selection
    onQuarterSelect(quarterKey);
    let dateArr: Array<Date> = [];
    quarterMonths.forEach(month => {
      const date = new Date(year, month, 1);
      dateArr.push(date)
    });
    onQuarterToggleSelect(dateArr, isSelected);
  };

  const handleMonthSelect = (date: Date, quarter: number) => {
    onMonthSelect(date);

    // Check if all months in the quarter are selected
    const quarterMonths = getQuarterMonths(quarter);
    const quarterKey = `${currentDate.getFullYear()}-Q${quarter}`;
    const isQuarterAlreadySelected = isQuarterSelected(quarterKey);

    const allMonthsSelected = quarterMonths.every(month => {
      const monthDate = new Date(currentDate.getFullYear(), month, 1);
      const monthKey = `${monthDate.getFullYear()}-${monthDate.getMonth()}`;
      return monthKey === `${date.getFullYear()}-${date.getMonth()}`
        ? !selectedMonths.includes(monthKey)
        : selectedMonths.includes(monthKey);
    });

    if (allMonthsSelected && !isQuarterAlreadySelected) {
      onQuarterSelect(quarterKey);
    } else if (!allMonthsSelected && isQuarterAlreadySelected) {
      onQuarterSelect(quarterKey);
    }
  };

  const quarters = Array.from({ length: 4 }, (_, i) => i + 1);
  const year = currentDate.getFullYear();

  return (
    <div className="p-4 space-y-4">
      {quarters.map(quarter => {
        const quarterKey = `${year}-Q${quarter}`;
        const quarterMonths = getQuarterMonths(quarter);
        const isSelected = isQuarterSelected(quarterKey);

        return (
          <div key={quarter} className="space-y-2">
            <button
              onClick={() => handleQuarterSelect(quarter)}
              className={`w-full p-3 text-left rounded-lg transition-colors ${isSelected ? 'bg-blue-100 hover:bg-blue-200' : 'hover:bg-gray-50'
                }`}
            >
              <span className="font-medium">Q{quarter}</span>
            </button>
            <div className="grid grid-cols-3 gap-2 pl-4">
              {quarterMonths.map(month => {
                const date = new Date(year, month, 1);
                const isMonthInQuarter = isMonthSelected(date);

                return (
                  <button
                    key={month}
                    onClick={() => handleMonthSelect(date, quarter)}
                    className={`p-2 rounded-md text-sm transition-colors ${isMonthInQuarter ? 'bg-blue-100 hover:bg-blue-200' : 'hover:bg-gray-50'
                      }`}
                  >
                    {date.toLocaleString('default', { month: 'short' })}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};