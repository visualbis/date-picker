import React, { useState } from 'react';
import FiscalDatePicker from './components/FiscalDatePicker';

function App() {
  const [fiscalStartMonth, setFiscalStartMonth] = useState(1);
  const [mode, setMode] = useState<'date' | 'yearMonth' | 'yearQuarterMonth' | 'multiYearQuarterMonth'>('date');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2rem' }}>
      <div style={{ maxWidth: '28rem', margin: 'auto', marginTop: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', marginTop: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontFamily: 'Arial, sans-serif', color: '#6B7280', marginBottom: '0.5rem' }}>
              Fiscal Year Start Month
            </label>
            <select
              value={fiscalStartMonth}
              onChange={(e) => setFiscalStartMonth(Number(e.target.value))}
              style={{ display: 'block', width: '100%', borderRadius: '0.375rem', border: '1px solid #6B7280', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', outline: 'none' }}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2024, i, 1).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontFamily: 'Arial, sans-serif', color: '#6B7280', marginBottom: '0.5rem' }}>
              Picker Mode
            </label>
            <div style={{ display: 'flex', borderRadius: '0.375rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
              <button
                onClick={() => setMode('date')}
                style={{ flex: 1, padding: '0.5rem 1rem', fontSize: '0.875rem', fontFamily: 'Arial, sans-serif', border: '1px solid #6B7280', borderRadius: '0.375rem', outline: 'none', backgroundColor: mode === 'date' ? '#f3f4f6' : '#ffffff', color: mode === 'date' ? '#3b82f6' : '#6B7280', borderRight: mode === 'date' ? 'none' : '1px solid #6B7280' }}
              >
                Date
              </button>
              <button
                onClick={() => setMode('yearMonth')}
                style={{ flex: 1, padding: '0.5rem 1rem', fontSize: '0.875rem', fontFamily: 'Arial, sans-serif', border: '1px solid #6B7280', borderRadius: '0.375rem', outline: 'none', backgroundColor: mode === 'yearMonth' ? '#f3f4f6' : '#ffffff', color: mode === 'yearMonth' ? '#3b82f6' : '#6B7280', borderRight: mode === 'yearMonth' ? 'none' : '1px solid #6B7280' }}
              >
                Year-Month
              </button>
              <button
                onClick={() => setMode('yearQuarterMonth')}
                style={{ flex: 1, padding: '0.5rem 1rem', fontSize: '0.875rem', fontFamily: 'Arial, sans-serif', border: '1px solid #6B7280', borderRadius: '0.375rem', outline: 'none', backgroundColor: mode === 'yearQuarterMonth' ? '#f3f4f6' : '#ffffff', color: mode === 'yearQuarterMonth' ? '#3b82f6' : '#6B7280', borderRight: mode === 'yearQuarterMonth' ? 'none' : '1px solid #6B7280' }}
              >
                Quarter
              </button>
              <button
                onClick={() => setMode('multiYearQuarterMonth')}
                style={{ flex: 1, padding: '0.5rem 1rem', fontSize: '0.875rem', fontFamily: 'Arial, sans-serif', border: '1px solid #6B7280', borderRadius: '0.375rem', outline: 'none', backgroundColor: mode === 'multiYearQuarterMonth' ? '#f3f4f6' : '#ffffff', color: mode === 'multiYearQuarterMonth' ? '#3b82f6' : '#6B7280', borderRadiusRight: '0.375rem' }}
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