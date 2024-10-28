import React, { useState } from 'react';
import FiscalDatePicker from './components/FiscalDatePicker';

function App() {
  const [fiscalStartMonth, setFiscalStartMonth] = useState(1);
  const [mode, setMode] = useState<'date' | 'yearMonth' | 'yearQuarterMonth' | 'multiYearQuarterMonth'>('date');

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto space-y-6">
        <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fiscal Year Start Month
            </label>
            <select
              value={fiscalStartMonth}
              onChange={(e) => setFiscalStartMonth(Number(e.target.value))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2024, i, 1).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Picker Mode
            </label>
            <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => setMode('date')}
                className={`flex-1 px-4 py-2 text-sm font-medium border ${mode === 'date'
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  } ${mode === 'date' ? '' : 'border-r-0'} rounded-l-md`}
              >
                Date
              </button>
              <button
                onClick={() => setMode('yearMonth')}
                className={`flex-1 px-4 py-2 text-sm font-medium border ${mode === 'yearMonth'
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  } ${mode === 'yearMonth' ? '' : 'border-r-0'}`}
              >
                Year-Month
              </button>
              <button
                onClick={() => setMode('yearQuarterMonth')}
                className={`flex-1 px-4 py-2 text-sm font-medium border ${mode === 'yearQuarterMonth'
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  } ${mode === 'yearQuarterMonth' ? '' : 'border-r-0'}`}
              >
                Quarter
              </button>
              <button
                onClick={() => setMode('multiYearQuarterMonth')}
                className={`flex-1 px-4 py-2 text-sm font-medium border ${mode === 'multiYearQuarterMonth'
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  } rounded-r-md`}
              >
                Multi Yr Qtr Month
              </button>
            </div>
          </div>
        </div>

        <FiscalDatePicker fiscalStartMonth={fiscalStartMonth} mode={mode} />
      </div>
    </div>
  );
}

export default App;