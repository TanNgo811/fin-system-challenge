import React from 'react';

interface SimulationPieChartProps {
  percentage: number; // 0 to 100
}

const SimulationPieChart: React.FC<SimulationPieChartProps> = ({ percentage }) => {
  const pieStyle: React.CSSProperties = {
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: `conic-gradient(
      #4CAF50 ${percentage}%, 
      #E0E0E0 ${percentage}% 100%
    )`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333'
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center">
      <h3 className="text-gray-600 text-lg mb-4">Interest Rate</h3>
      <div style={pieStyle}>
      </div>
       <p className="mt-2 text-xl font-semibold">{percentage.toFixed(0)}%</p>
    </div>
  );
};
export default SimulationPieChart;