import React from 'react';

interface ValuationDisplayProps {
  valuation: number;
  termsOk: boolean;
}

const ValuationDisplay: React.FC<ValuationDisplayProps> = ({ valuation, termsOk }) => (
  <div className="bg-white p-6 rounded-lg shadow text-center">
    <h3 className="text-gray-600 text-lg mb-2">Valuation</h3>
    {termsOk && valuation > 0 ? (
      <p className="text-3xl font-bold text-green-600">
        ${valuation.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
      </p>
    ) : (
      <p className="text-xl font-semibold text-orange-500">
        Pending Agreement
      </p>
    )}
  </div>
);
export default ValuationDisplay;