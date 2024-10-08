import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Container } from 'react-bootstrap';
// Register all necessary components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StockChart = ({ data, ticker }) => {
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
                text: `${ticker}`, // Title above the chart
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
            <h3>Stock Price Chart</h3>
            <Line data={chartData} options={options} />
        </Container>
    );
};

export default StockChart;