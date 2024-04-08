import React, { useState } from 'react';
import 'tailwindcss/tailwind.css'; // Import Tailwind CSS styles

const BudgetInvestor = () => {
  const [homePrice, setHomePrice] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [monthlyExpenses, setMonthlyExpenses] = useState('');
  const [affordabilityResult, setAffordabilityResult] = useState(null);

  const [homePriceError, setHomePriceError] = useState('');
  const [monthlyIncomeError, setMonthlyIncomeError] = useState('');
  const [monthlyExpensesError, setMonthlyExpensesError] = useState('');

  const clearErrors = () => {
    setHomePriceError('');
    setMonthlyIncomeError('');
    setMonthlyExpensesError('');
  };

  const calculateAffordability = () => {
    clearErrors();

    // Validation checks
    if (!homePrice) {
      setHomePriceError('Please enter the home price.');
      return;
    }

    if (!monthlyIncome) {
      setMonthlyIncomeError('Please enter the monthly income.');
      return;
    }

    if (!monthlyExpenses) {
      setMonthlyExpensesError('Please enter the monthly expenses.');
      return;
    }

    const takeHomePay = monthlyIncome - monthlyExpenses;
    const maxAffordablePayment = takeHomePay * 0.25;

    const estimatedMortgagePayment = (homePrice * 0.0035) / (1 - Math.pow(1 + 0.0035, -30 * 12));
    setAffordabilityResult(estimatedMortgagePayment <= maxAffordablePayment);
  };

  return (
    <div className="container mx-auto mt-8 p-4 bg-gray-100 rounded-md shadow-md max-w-md">
      <h1 className="text-2xl font-extrabold text-gray-800 mb-4">Can I Afford a Home?</h1>
      <div>
        <label className="block text-sm font-semibold mb-2">Home Price (₹)</label>
        <input
          type="number"
          value={homePrice}
          onChange={(e) => { setHomePrice(e.target.value); clearErrors(); }}
          className={`w-full p-2 border rounded-md ${homePriceError ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Enter home price"
        />
        {homePriceError && <p className="text-red-500 text-sm mt-1">{homePriceError}</p>}
      </div>
      <div className="mt-4">
        <label className="block text-sm font-semibold mb-2">Monthly Income (₹)</label>
        <input
          type="number"
          value={monthlyIncome}
          onChange={(e) => { setMonthlyIncome(e.target.value); clearErrors(); }}
          className={`w-full p-2 border rounded-md ${monthlyIncomeError ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Enter monthly income"
        />
        {monthlyIncomeError && <p className="text-red-500 text-sm mt-1">{monthlyIncomeError}</p>}
      </div>
      <div className="mt-4">
        <label className="block text-sm font-semibold mb-2">Monthly Expenses (₹)</label>
        <input
          type="number"
          value={monthlyExpenses}
          onChange={(e) => { setMonthlyExpenses(e.target.value); clearErrors(); }}
          className={`w-full p-2 border rounded-md ${monthlyExpensesError ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Enter monthly expenses"
        />
        {monthlyExpensesError && <p className="text-red-500 text-sm mt-1">{monthlyExpensesError}</p>}
      </div>
      <button
        onClick={calculateAffordability}
        className="mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 cursor-pointer w-full"
      >
        Calculate Affordability
      </button>
      {affordabilityResult !== null && (
        <p className={`mt-4 ${affordabilityResult ? 'text-green-600' : 'text-red-600'}`}>
          {affordabilityResult ? 'You can afford this home!' : 'You cannot afford this home.'}
        </p>
      )}
    </div>
  );
};

export default BudgetInvestor;
