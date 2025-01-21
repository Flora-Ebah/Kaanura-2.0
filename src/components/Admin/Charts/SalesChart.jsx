import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
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

const SalesChart = () => {
    const [period, setPeriod] = useState('day');

    const chartData = {
        day: {
            labels: ['8h', '10h', '12h', '14h', '16h', '18h', '20h'],
            data: [1200, 1800, 2500, 2100, 2800, 3200, 2900]
        },
        week: {
            labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
            data: [12500, 14800, 13200, 15500, 16800, 19200, 18500]
        },
        month: {
            labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
            data: [45000, 52000, 49000, 58000, 62000, 68000]
        }
    };

    const data = {
        labels: chartData[period].labels,
        datasets: [
            {
                label: 'Ventes',
                data: chartData[period].data,
                borderColor: '#8B5E34',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(139, 94, 52, 0.2)');
                    gradient.addColorStop(1, 'rgba(139, 94, 52, 0)');
                    return gradient;
                },
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 6,
                pointBackgroundColor: '#FFFFFF',
                pointBorderColor: '#8B5E34',
                pointBorderWidth: 2,
                pointHoverRadius: 8,
                pointHoverBorderWidth: 3,
                pointHoverBackgroundColor: '#8B5E34',
                pointHoverBorderColor: '#FFFFFF',
                pointShadowOffsetY: 3,
                pointShadowBlur: 5,
                pointShadowColor: 'rgba(0, 0, 0, 0.1)'
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
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                titleColor: '#1a1a1a',
                bodyColor: '#666666',
                bodyFont: {
                    size: 14,
                    family: "'Poppins', sans-serif"
                },
                titleFont: {
                    size: 15,
                    weight: 'bold',
                    family: "'Poppins', sans-serif"
                },
                padding: 15,
                borderColor: '#e5e7eb',
                borderWidth: 1,
                displayColors: false,
                cornerRadius: 8,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                callbacks: {
                    label: function(context) {
                        return `${context.parsed.y.toLocaleString('fr-FR')} €`;
                    },
                    title: function(context) {
                        const title = context[0].label;
                        return period === 'day' ? `${title}00` : title;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    font: {
                        size: 13,
                        family: "'Poppins', sans-serif",
                        weight: '500'
                    },
                    color: '#666666',
                    padding: 8
                }
            },
            y: {
                beginAtZero: true,
                border: {
                    display: false
                },
                grid: {
                    color: '#f3f4f6',
                    drawBorder: false,
                    lineWidth: 1.5
                },
                ticks: {
                    font: {
                        size: 13,
                        family: "'Poppins', sans-serif",
                        weight: '500'
                    },
                    color: '#666666',
                    padding: 12,
                    callback: function(value) {
                        if (value >= 1000) {
                            return `${(value / 1000).toLocaleString('fr-FR')}k €`;
                        }
                        return `${value.toLocaleString('fr-FR')} €`;
                    }
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        },
        elements: {
            line: {
                tension: 0.4
            }
        },
        animation: {
            duration: 750,
            easing: 'easeInOutQuart'
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex gap-2 mb-6">
                {[
                    { id: 'day', label: 'Jour' },
                    { id: 'week', label: 'Semaine' },
                    { id: 'month', label: 'Mois' }
                ].map(({ id, label }) => (
                    <button
                        key={id}
                        onClick={() => setPeriod(id)}
                        className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 
                            ${period === id 
                                ? 'bg-[#8B5E34] text-white shadow-md hover:bg-[#7A4E24]' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            } focus:outline-none focus:ring-2 focus:ring-[#8B5E34] focus:ring-opacity-50`}
                    >
                        {label}
                    </button>
                ))}
            </div>
            <div className="flex-1 min-h-[300px]">
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

export default SalesChart; 