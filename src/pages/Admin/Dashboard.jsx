import React, { useState, useEffect } from 'react';
import { 
    ShoppingOutlined, 
    UserOutlined, 
    DollarOutlined, 
    ShoppingCartOutlined,
    CalendarOutlined,
    FilterOutlined
} from '@ant-design/icons';
import { auth, db } from '../../config/firebase';
import { doc, getDoc, collection, query, getDocs, where } from 'firebase/firestore';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import StatsCard from '../../components/Admin/StatsCard';
import SalesChart from '../../components/Admin/Charts/SalesChart';
import RecentOrders from '../../components/Admin/Widgets/RecentOrders';
import TopProducts from '../../components/Admin/Widgets/TopProducts';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [adminName, setAdminName] = useState('');
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState([]);

    // Fonction pour formater le prix en FCFA
    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
    };

    // Fonction pour calculer la variation en pourcentage
    const calculateTrend = (current, previous) => {
        if (!previous) return '+0%';
        const trend = ((current - previous) / previous) * 100;
        return `${trend > 0 ? '+' : ''}${trend.toFixed(1)}%`;
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                // Récupérer les données de l'admin
                const user = auth.currentUser;
                if (user) {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setAdminName(`${userData.firstName} ${userData.lastName}`);
                    }
                }

                // Dates pour les comparaisons
                const now = new Date();
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

                // Récupérer les commandes
                const ordersQuery = query(collection(db, 'orders'));
                const ordersSnapshot = await getDocs(ordersQuery);
                const orders = ordersSnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id
                }));

                // Calculer les ventes totales (uniquement commandes livrées)
                const totalSales = orders
                    .filter(order => order.status === 'Livré')
                    .reduce((sum, order) => {
                        // Calculer le total réel pour chaque commande
                        const orderTotal = order.items.reduce((itemSum, item) => 
                            itemSum + (item.price * item.quantity), 0
                        );
                        return sum + orderTotal;
                    }, 0);

                // Calculer les ventes mensuelles (uniquement commandes livrées)
                const currentMonthOrders = orders.filter(order => 
                    new Date(order.date.seconds * 1000) >= startOfMonth &&
                    order.status === 'Livré'
                );
                const prevMonthOrders = orders.filter(order => 
                    new Date(order.date.seconds * 1000) >= startOfPrevMonth && 
                    new Date(order.date.seconds * 1000) < startOfMonth &&
                    order.status === 'Livré'
                );

                const currentMonthSales = currentMonthOrders.reduce((sum, order) => {
                    const orderTotal = order.items.reduce((itemSum, item) => 
                        itemSum + (item.price * item.quantity), 0
                    );
                    return sum + orderTotal;
                }, 0);

                const prevMonthSales = prevMonthOrders.reduce((sum, order) => {
                    const orderTotal = order.items.reduce((itemSum, item) => 
                        itemSum + (item.price * item.quantity), 0
                    );
                    return sum + orderTotal;
                }, 0);

                // Récupérer les produits et clients
                const productsSnapshot = await getDocs(collection(db, 'products'));
                const usersSnapshot = await getDocs(query(
                    collection(db, 'users'),
                    where('type_user', '==', 'user')
                ));

                // Mettre à jour les stats
                setStats([
                    {
                        title: "Ventes totales",
                        value: formatPrice(totalSales),
                        icon: <DollarOutlined />,
                        trend: calculateTrend(currentMonthSales, prevMonthSales),
                        color: "#4CAF50",
                        tooltip: "Total des ventes des commandes livrées"
                    },
                    {
                        title: "Commandes",
                        value: orders.length,
                        icon: <ShoppingCartOutlined />,
                        trend: calculateTrend(
                            currentMonthOrders.length,
                            prevMonthOrders.length
                        ),
                        color: "#2196F3"
                    },
                    {
                        title: "Produits",
                        value: productsSnapshot.size,
                        icon: <ShoppingOutlined />,
                        trend: "+0%", // À implémenter si nécessaire
                        color: "#FF9800"
                    },
                    {
                        title: "Clients",
                        value: usersSnapshot.size,
                        icon: <UserOutlined />,
                        trend: "+0%", // À implémenter si nécessaire
                        color: "#9C27B0"
                    }
                ]);

            } catch (error) {
                console.error("Erreur lors du chargement des données:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const dashboardContent = (
        <div className="p-6 space-y-6">
            {/* En-tête avec filtres */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-6 rounded-xl shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Bonjour, {adminName || 'Admin'} 👋
                    </h1>
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

    return <AdminLayout loading={loading}>{dashboardContent}</AdminLayout>;
};

export default Dashboard; 