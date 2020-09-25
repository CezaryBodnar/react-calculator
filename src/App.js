import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [value, setValue] = useState(null);
  const [displayValue, setdisplayValue] = useState("0");
  const [operation, setOperation] = useState('');
  const [waitingForOperand, setwaitingForOperand] = useState(false);

  const CalculatorOperations = {
    '/': (prevValue, nextValue) => prevValue / nextValue,
    '*': (prevValue, nextValue) => prevValue * nextValue,
    '+': (prevValue, nextValue) => prevValue + nextValue,
    '-': (prevValue, nextValue) => prevValue - nextValue,
    '=': (prevValue, nextValue) => nextValue
  }

  const language = navigator.language || 'pl-PL'
  let formattedValue = parseFloat(displayValue).toLocaleString(language, {
    useGrouping: true,
    maximumFractionDigits: 6
  })

  // Add back missing .0 in e.g. 12.0
  const match = displayValue.match(/\.\d*?(0*)$/);

  if (match)
    formattedValue += (/[1-9]/).test(match[0]) ? match[1] : match[0]

  const clearAll = () => {
    setValue(null);
    setdisplayValue("0");
    setOperation(null);
    setwaitingForOperand(false);
  }
  const clearDisplay = () => {
    setdisplayValue("0");
  }

  const clearLastChar = () => {
    setdisplayValue(displayValue.substring(0, displayValue.length - 1) || '0');
  }

  const toggleSign = () => {
    const newValue = parseFloat(displayValue) * -1;
    setdisplayValue(String(newValue));
  }

  const inputPercent = () => {
    const currentValue = parseFloat(displayValue);
    if (currentValue === 0)
      return
    const fixedDigits = displayValue.replace(/^-?\d*\.?/, '');
    const newValue = parseFloat(displayValue) / 100;
    setdisplayValue(String(newValue.toFixed(fixedDigits.length + 2)));
  }

  const inputDot = () => {
    if (!(/\./).test(displayValue)) {
      setdisplayValue(displayValue + '.', setwaitingForOperand(false));
    }
  }

  const inputDigit = (digit) => {

    if (waitingForOperand) {
      setdisplayValue(String(digit));
      setwaitingForOperand(false);
    } else if (displayValue.length >= 5) {
      return displayValue
    } else {
      setdisplayValue(displayValue === '0' ? String(digit) : displayValue + digit);
    }
  }

  const performOperation = (nextOperator) => {
    const inputValue = parseFloat(displayValue)

    if (value == null) {
      setValue(inputValue);
    } else if (operation) {
      const currentValue = value || 0
      const newValue = CalculatorOperations[operation](currentValue, inputValue)

      setValue(newValue);
      setdisplayValue(String(newValue));
    }
    setwaitingForOperand(true);
    setOperation(nextOperator);
  }

  const handleKeyDown = e => {
    let { key } = e;
    if (key === 'Enter')
      key = '='

    if ((/\d/).test(key)) {
      e.preventDefault()
      inputDigit(parseInt(key, 10))
    } else if (key in CalculatorOperations) {
      e.preventDefault()
      performOperation(key)
    } else if (key === '.') {
      e.preventDefault()
      inputDot()
    } else if (key === '%') {
      e.preventDefault()
      inputPercent()
    } else if (key === 'Backspace') {
      e.preventDefault()
      clearLastChar()
    } else if (key === 'Escape') {
      e.preventDefault()

      if (displayValue !== '0') {
        clearDisplay()
      } else {
        clearAll()
      }
    }
  }
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });
  return (
    <div className="App">
      <div className="container">
        <div className="calculator-box">
          <div className="number-input">
            <div className="input">{formattedValue}</div>
          </div>


          <div className="operations" onClick={clearAll}>AC</div>
          <div className="operations" onClick={clearLastChar}>C</div>
          <div className="operations" onClick={() => inputPercent()}>%</div>
          <div className="operations" onClick={() => performOperation('/')}>/</div>

          <div className="numbers" onClick={() => inputDigit(7)}>7</div>
          <div className="numbers" onClick={() => inputDigit(8)}>8</div>
          <div className="numbers" onClick={() => inputDigit(9)}>9</div>
          <div className="operations" onClick={() => performOperation('*')}>*</div>

          <div className="numbers" onClick={() => inputDigit(4)}>4</div>
          <div className="numbers" onClick={() => inputDigit(5)}>5</div>
          <div className="numbers" onClick={() => inputDigit(6)}>6</div>
          <div className="operations" onClick={() => performOperation('-')}>-</div>

          <div className="numbers" onClick={() => inputDigit(1)}>1</div>
          <div className="numbers" onClick={() => inputDigit(2)}>2</div>
          <div className="numbers" onClick={() => inputDigit(3)}>3</div>
          <div className="operations" onClick={() => performOperation('+')}>+</div>

          <div className="operations" onClick={() => toggleSign()}>+/-</div>
          <div className="numbers" onClick={() => inputDigit(0)}>0</div>



          <div className="numbers" onClick={inputDot}>.</div>
          <div className="operations" onClick={() => performOperation('=')}>=</div>
        </div>
      </div>

    </div>
  );
}

export default App;
