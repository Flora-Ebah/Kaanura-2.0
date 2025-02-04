import React, { useState, useEffect } from 'react';
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
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../../config/firebase';

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
    const [chartData, setChartData] = useState({
        labels: [],
        data: []
    });

    // Fonction pour formater le prix en FCFA
    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
    };

    // Fonction pour grouper les commandes par période
    const groupOrdersByPeriod = (orders, period) => {
        const groupedData = {};
        
        // Ne prendre en compte que les commandes livrées
        const deliveredOrders = orders.filter(order => order.status === 'Livré');
        
        deliveredOrders.forEach(order => {
            // Gérer les timestamps Firestore
            const date = order.date?.seconds ? 
                new Date(order.date.seconds * 1000) : 
                new Date(order.date);
            
            let key;

            switch(period) {
                case 'day':
                    key = `${date.getHours()}h`;
                    break;
                case 'week':
                    key = date.toLocaleDateString('fr-FR', { weekday: 'short' });
                    break;
                case 'month':
                    key = date.toLocaleDateString('fr-FR', { month: 'short' });
                    break;
                default:
                    key = date.toISOString();
            }

            if (!groupedData[key]) {
                groupedData[key] = 0;
            }

            // Calculer le total réel de la commande
            const orderTotal = order.items.reduce((sum, item) => 
                sum + (item.price * item.quantity), 0
            );
            groupedData[key] += orderTotal;
        });

        return groupedData;
    };

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                const now = new Date();
                const startDate = new Date();

                // Définir la période de début selon le filtre
                switch(period) {
                    case 'day':
                        startDate.setHours(0, 0, 0, 0);
                        break;
                    case 'week':
                        startDate.setDate(now.getDate() - 7);
                        break;
                    case 'month':
                        startDate.setMonth(now.getMonth() - 1);
                        break;
                }

                // Modifier la requête pour utiliser les timestamps Firestore
                const ordersQuery = query(
                    collection(db, 'orders'),
                    orderBy('date', 'desc')  // Supprimer les where clauses pour l'instant
                );

                const snapshot = await getDocs(ordersQuery);
                const orders = snapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id
                }));

                // Filtrer les commandes selon la période après récupération
                const filteredOrders = orders.filter(order => {
                    const orderDate = order.date?.seconds ? 
                        new Date(order.date.seconds * 1000) : 
                        new Date(order.date);
                    return orderDate >= startDate && orderDate <= now;
                });

                // Grouper les données par période avec le nouveau calcul de total
                const groupedData = groupOrdersByPeriod(filteredOrders, period);

                // Trier les clés pour l'affichage chronologique
                const sortedLabels = Object.keys(groupedData).sort((a, b) => {
                    if (period === 'day') {
                        return parseInt(a) - parseInt(b);
                    }
                    return 0; // Pour les autres périodes, garder l'ordre naturel
                });

                setChartData({
                    labels: sortedLabels,
                    data: sortedLabels.map(label => groupedData[label])
                });

            } catch (error) {
                console.error("Erreur lors du chargement des données de vente:", error);
            }
        };

        fetchSalesData();
    }, [period]);

    const data = {
        labels: chartData.labels,
        datasets: [
            {
                label: 'Ventes (commandes livrées)',
                data: chartData.data,
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
                pointHoverBorderColor: '#FFFFFF'
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
                        return formatPrice(context.parsed.y);
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
                            return formatPrice(value / 1000) + 'k';
                        }
                        return formatPrice(value);
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