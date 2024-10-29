# Date Picker
A simple date picker component for React.

## Installation

```
npm install react-date-picker
```

## Usage

```jsx
import React from 'react';
import DatePicker from 'react-date-picker';

function App() {
  const [date, setDate] = React.useState(new Date());

  return (
    <DatePicker
      onChange={setDate}
      value={date}
    />
  );
}

export default App;
```

## Props

- `value`: The current date value.
- `onChange`: A function that is called when the date value changes.