import React from 'react';
import { 
    ShoppingOutlined, 
    UserOutlined, 
    DollarOutlined, 
    ShoppingCartOutlined,
    CalendarOutlined,
    FilterOutlined
} from '@ant-design/icons';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import StatsCard from '../../components/Admin/StatsCard';
import SalesChart from '../../components/Admin/Charts/SalesChart';
import RecentOrders from '../../components/Admin/Widgets/RecentOrders';
import TopProducts from '../../components/Admin/Widgets/TopProducts';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    
    const stats = [
        {
            title: "Ventes totales",
            value: "12,500€",
            icon: <DollarOutlined />,
            trend: "+15%",
            color: "#4CAF50"
        },
        {
            title: "Commandes",
            value: "150",
            icon: <ShoppingCartOutlined />,
            trend: "+8%",
            color: "#2196F3"
        },
        {
            title: "Produits",
            value: "48",
            icon: <ShoppingOutlined />,
            trend: "+12%",
            color: "#FF9800"
        },
        {
            title: "Clients",
            value: "1,250",
            icon: <UserOutlined />,
            trend: "+25%",
            color: "#9C27B0"
        }
    ];

    const dashboardContent = (
        <div className="p-6 space-y-6">
            {/* En-tête avec filtres */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-6 rounded-xl shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Bonjour, Admin 👋</h1>
                    <p className="text-gray-600 mt-1">Voici le résumé de votre activité</p>
                </div>
                
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <div className="flex items-center bg-white border border-gray-200 rounded-lg p-2">
                        <CalendarOutlined className="text-gray-400 mr-2" />
                        <select className="bg-transparent text-sm focus:outline-none">
                            <option>Aujourd'hui</option>
                            <option>Cette semaine</option>
                            <option>Ce mois</option>
                            <option>Cette année</option>
                        </select>
                    </div>
                    <button className="flex items-center gap-2 bg-white border border-gray-200 p-2 rounded-lg">
                        <FilterOutlined className="text-gray-400" />
                        <span className="text-sm">Filtres</span>
                    </button>
                </div>
            </div>
            
            {/* Stats Cards avec animation au survol */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} 
                         className="bg-white p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-600">{stat.title}</p>
                                <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
                                <span className="inline-flex items-center text-sm text-green-600 mt-2">
                                    {stat.trend}
                                    <span className="ml-1">vs mois dernier</span>
                                </span>
                            </div>
                            <div className="p-3 rounded-lg" style={{backgroundColor: `${stat.color}15`}}>
                                <span style={{color: stat.color}}>{stat.icon}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Section Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Évolution des ventes
                        </h2>
                        
                    </div>
                    <div className="h-[400px]">
                        <SalesChart />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Produits les plus vendus
                        </h2>
                        <button 
                            onClick={() => navigate('/admin/products')}
                            className="text-primary hover:text-primary-dark transition-colors flex items-center gap-1 group"
                        >
                            Voir tout
                            <span className="transform transition-transform group-hover:translate-x-1">→</span>
                        </button>
                    </div>
                    <div className="overflow-hidden">
                        <TopProducts />
                    </div>
                </div>
            </div>

            {/* Commandes Récentes */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Dernières commandes
                    </h2>
                    <button 
                        onClick={() => navigate('/admin/orders')}
                        className="text-primary hover:text-primary-dark transition-colors flex items-center gap-1 group"
                    >
                        Voir toutes les commandes
                        <span className="transform transition-transform group-hover:translate-x-1">→</span>
                    </button>
                </div>
                <div className="overflow-hidden rounded-lg">
                    <RecentOrders />
                </div>
            </div>
        </div>
    );

    return <AdminLayout>{dashboardContent}</AdminLayout>;
};

export default Dashboard; 