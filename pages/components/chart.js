import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Container } from 'react-bootstrap';
// Register all necessary components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StockChart = ({ data }) => {
    const chartData = {
        labels: data.map(d => d.date),
        datasets: [
        {
            label: 'Open Price',
            data: data.map(d => d.open),
            fill: false,
            borderColor: 'rgba(255, 99, 132, 1)',
            tension: 0.1
        },
        {
            label: 'Close Price',
            data: data.map(d => d.close),
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1
        }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top', // Legend at the top of the chart
            },
            title: {
                display: true,
                text: 'APPLE', // Title above the chart
            },
            tooltip: {
                enabled: true, // Enable tooltips to display data on hover
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date',
                }                
            },
            y: {
                title: {
                    display: true,
                    text: 'Price (USD)',
                }
            },

        }
    };

    return (
        <Container>
            <h2 className="mt-3">Stock Price Chart</h2>
            <Line data={chartData} options={options} />
        </Container>
    );
};

export default StockChart;