import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StockChart = ({ chartData, symbol }) => {
  // Add some fallback mock data if empty
  const dataToUse = chartData?.length > 0 ? chartData : Array.from({length: 30}).map((_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    close: 150 + Math.random() * 20 - 10
  }));

  const data = {
    labels: dataToUse.map(d => d.date),
    datasets: [
      {
        label: `${symbol} Price`,
        data: dataToUse.map(d => d.close),
        borderColor: '#00d4aa',
        backgroundColor: 'rgba(0, 212, 170, 0.1)',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        fill: true,
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#16213e',
        titleColor: '#e8e8e8',
        bodyColor: '#e8e8e8',
        borderColor: '#00d4aa',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#a0a0b8',
          maxTicksLimit: 6
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: '#a0a0b8',
          callback: (value) => '$' + value
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <div className="chart-container" style={{ height: '400px', width: '100%' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default StockChart;
