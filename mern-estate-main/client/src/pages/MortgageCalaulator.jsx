import React, { useState } from 'react';

const MortgageCalculator = () => {
  const [purchasePrice, setPurchasePrice] = useState('');
  const [downPaymentPercentage, setDownPaymentPercentage] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState(null);

  const [purchasePriceError, setPurchasePriceError] = useState('');
  const [downPaymentPercentageError, setDownPaymentPercentageError] = useState('');
  const [loanTermError, setLoanTermError] = useState('');
  const [interestRateError, setInterestRateError] = useState('');

  const clearErrors = () => {
    setPurchasePriceError('');
    setDownPaymentPercentageError('');
    setLoanTermError('');
    setInterestRateError('');
  };

  const calculateMonthlyPayment = () => {
    clearErrors();

    // Validation checks
    if (!purchasePrice) {
      setPurchasePriceError('Please enter the purchase price.');
      return;
    }

    if (!downPaymentPercentage) {
      setDownPaymentPercentageError('Please enter the down payment percentage.');
      return;
    }

    if (!loanTerm) {
      setLoanTermError('Please enter the loan term.');
      return;
    }

    if (!interestRate) {
      setInterestRateError('Please enter the annual interest rate.');
      return;
    }

    // Calculation logic
    const principal = parseFloat(purchasePrice) * (1 - parseFloat(downPaymentPercentage) / 100);
    const monthlyInterestRate = parseFloat(interestRate) / 100 / 12;
    const numberOfPayments = parseFloat(loanTerm) * 12;

    const monthlyPayment =
      (principal * monthlyInterestRate) /
      (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));

    setMonthlyPayment(monthlyPayment.toFixed(2));
  };

  return (
    <div className="container mx-auto mt-8 p-4 bg-gray-100 rounded-md shadow-md max-w-md">
      <form className="max-w-md mx-auto">
        <div className="mb-4">
          <h2 className='text-3xl font-extrabold text-blue-500'>Mortgage Calculator</h2> <br />
          <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-600">
            Purchase Price (₹)
          </label>
          <input
            type="number"
            id="purchasePrice"
            className={`mt-1 p-2 border rounded-md w-full ${purchasePriceError ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter purchase price"
            value={purchasePrice}
            onChange={(e) => { setPurchasePrice(e.target.value); clearErrors(); }}
          />
          {purchasePriceError && <p className="text-red-500 text-sm mt-1">{purchasePriceError}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="downPaymentPercentage" className="block text-sm font-medium text-gray-600">
            Down Payment Percentage (%)
          </label>
          <input
            type="number"
            id="downPaymentPercentage"
            className={`mt-1 p-2 border rounded-md w-full ${downPaymentPercentageError ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter down payment percentage"
            value={downPaymentPercentage}
            onChange={(e) => { setDownPaymentPercentage(e.target.value); clearErrors(); }}
          />
          {downPaymentPercentageError && <p className="text-red-500 text-sm mt-1">{downPaymentPercentageError}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-600">
            Loan Term (Years)
          </label>
          <input
            type="number"
            id="loanTerm"
            className={`mt-1 p-2 border rounded-md w-full ${loanTermError ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter loan term"
            value={loanTerm}
            onChange={(e) => { setLoanTerm(e.target.value); clearErrors(); }}
          />
          {loanTermError && <p className="text-red-500 text-sm mt-1">{loanTermError}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="interestRate" className="block text-sm font-medium text-gray-600">
            Annual Interest Rate (%)
          </label>
          <input
            type="number"
            id="interestRate"
            className={`mt-1 p-2 border rounded-md w-full ${interestRateError ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter annual interest rate"
            value={interestRate}
            onChange={(e) => { setInterestRate(e.target.value); clearErrors(); }}
          />
          {interestRateError && <p className="text-red-500 text-sm mt-1">{interestRateError}</p>}
        </div>
        <button
          type="button"
          className="bg-blue-500 font-bold text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={calculateMonthlyPayment}
        >
          Calculate Monthly Payment
        </button>
        {monthlyPayment && (
          <p className="mt-4 text-green-600">
            Your estimated monthly payment is: ₹{monthlyPayment}
          </p>
        )}
      </form>
    </div>
  );
};

export default MortgageCalculator;
