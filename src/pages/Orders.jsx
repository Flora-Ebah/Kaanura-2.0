import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer';
import { 
    ClockCircleOutlined, 
    CheckCircleOutlined, 
    RollbackOutlined, 
    HistoryOutlined,
    StarOutlined,
    SearchOutlined,
    FilterOutlined
} from '@ant-design/icons';
import { message } from 'antd';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Orders = () => {
    const { cartItems } = useCart();
    const [orders, setOrders] = useState({
        'en-cours': [],
        'livrees': [],
        'retours': [],
        'historique': []
    });
    const [loading, setLoading] = useState(true);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [activeTab, setActiveTab] = useState('en-cours');
    const [searchTerm, setSearchTerm] = useState('');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Écouter l'état de l'authentification
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (!currentUser) {
                message.info("Veuillez vous connecter pour voir vos commandes");
                navigate('/login');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    // Charger les commandes de l'utilisateur
    useEffect(() => {
        let unsubscribeOrders = null;

        const fetchOrders = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const q = query(
                    collection(db, 'orders'),
                    where('userId', '==', user.uid)
                );

                unsubscribeOrders = onSnapshot(q, (snapshot) => {
                    const fetchedOrders = {
                        'en-cours': [],
                        'livrees': [],
                        'retours': [],
                        'historique': []
                    };

                    const sortedDocs = [...snapshot.docs].sort((a, b) => {
                        const dateA = a.data().createdAt || '';
                        const dateB = b.data().createdAt || '';
                        return dateB.localeCompare(dateA);
                    });

                    sortedDocs.forEach(doc => {
                        const order = {
                            id: doc.id,
                            ...doc.data()
                        };

                        // Classer les commandes selon leur statut
                        switch (order.status) {
                            case 'En attente':
                            case 'En préparation':
                            case 'En livraison':
                                fetchedOrders['en-cours'].push(order);
                                break;
                            case 'Livrée':
                                fetchedOrders['livrees'].push(order);
                                fetchedOrders['historique'].push(order);
                                break;
                            case 'Retournée':
                            case 'Retour en cours':
                                fetchedOrders['retours'].push(order);
                                fetchedOrders['historique'].push(order);
                                break;
                            default:
                                fetchedOrders['historique'].push(order);
                        }
                    });

                    setOrders(fetchedOrders);
                    setLoading(false);
                    setDataLoaded(true);
                });

            } catch (error) {
                console.error("Erreur lors du chargement des commandes:", error);
                message.error("Erreur lors du chargement des commandes");
                setLoading(false);
                setDataLoaded(true);
            }
        };

        fetchOrders();

        return () => {
            if (unsubscribeOrders) {
                unsubscribeOrders();
            }
        };
    }, [user]);

    // Formater la date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Filtrer les commandes selon la recherche
    const filteredOrders = orders[activeTab]?.filter(order => {
        const searchLower = searchTerm.toLowerCase();
        return (
            order.id.toLowerCase().includes(searchLower) ||
            order.items.some(item => 
                item.name.toLowerCase().includes(searchLower)
            )
        );
    });

    const tabs = [
        { id: 'en-cours', label: 'En cours', icon: <ClockCircleOutlined /> },
        { id: 'livrees', label: 'Livrées', icon: <CheckCircleOutlined /> },
        { id: 'retours', label: 'Retours', icon: <RollbackOutlined /> },
        { id: 'historique', label: 'Historique', icon: <HistoryOutlined /> }
    ];

    const renderOrderCard = (order) => (
        <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
                <div className="flex flex-col gap-2 mb-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-medium text-[#4A2B0F]">
                                Commande #{order.id.slice(-6)}
                            </h3>
                            <p className="text-sm text-[#8B5E34]">
                                Passée le {formatDate(order.createdAt)}
                            </p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-sm bg-[#fff5e6] text-[#8B5E34]">
                            {order.status}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-[#8B5E34]">Total</p>
                        <p className="text-lg font-medium text-[#4A2B0F]">
                            {order.totalAmount} FCFA
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    {order.items.map((item, index) => (
                        <div key={index} className="flex gap-3 p-3 bg-[#fff5e6] rounded-lg">
                            <img 
                                src={item.imageUrl} 
                                alt={item.name} 
                                className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                            />
                            <div className="flex-grow min-w-0">
                                <h4 className="text-[#4A2B0F] font-medium truncate">
                                    {item.name}
                                </h4>
                                <p className="text-sm text-[#8B5E34]">
                                    Quantité: {item.quantity}
                                </p>
                                <div className="flex justify-between items-center mt-1">
                                    <p className="text-[#4A2B0F] font-medium">
                                        {item.price} FCFA
                                    </p>
                                    {order.status === 'Livrée' && (
                                        <button className="text-sm text-[#8B5E34] hover:text-[#4A2B0F] flex items-center gap-1">
                                            <StarOutlined /> Évaluer
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="p-4 bg-[#fff5e6] space-y-2">
                <div className="grid grid-cols-2 gap-2">
                    <button className="px-3 py-2 text-sm text-[#8B5E34] hover:text-[#4A2B0F] transition-colors border border-[#8B5E34] rounded-full">
                        Suivre la commande
                    </button>
                    <button className="px-3 py-2 text-sm text-[#8B5E34] hover:text-[#4A2B0F] transition-colors border border-[#8B5E34] rounded-full">
                        Contacter le support
                    </button>
                </div>
                {activeTab === 'livrees' && (
                    <button className="w-full px-3 py-2 text-sm bg-[#8B5E34] text-white rounded-full hover:bg-[#4A2B0F] transition-colors">
                        Retourner un article
                    </button>
                )}
            </div>
        </div>
    );

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#fff5e6]">
                <h2 className="text-xl font-medium text-[#4A2B0F] mb-4">
                    Connexion requise
                </h2>
                <p className="text-[#8B5E34] mb-6">
                    Veuillez vous connecter pour voir vos commandes
                </p>
                <button
                    onClick={() => navigate('/login')}
                    className="px-6 py-2 bg-[#8B5E34] text-white rounded-full hover:bg-[#4A2B0F] transition-colors"
                >
                    Se connecter
                </button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#fff5e6]">
                <div className="w-16 h-16 border-4 border-[#8B5E34] border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-[#4A2B0F]">Chargement de vos commandes...</p>
            </div>
        );
    }

    return (
        <>
            <div style={{ backgroundColor: '#fff5e6', minHeight: '100vh' }}>
                <div className="container mx-auto px-4 pb-12 pt-48">
                    <div className="space-y-4 mb-6">
                        <h1 className="text-2xl font-light text-[#4A2B0F]">Vos Commandes</h1>
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    className="w-full pl-10 pr-4 py-2 rounded-full border border-[#8B5E34] focus:outline-none focus:ring-2 focus:ring-[#8B5E34] bg-white text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <SearchOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B5E34]" />
                            </div>
                            <button className="p-2 rounded-full border border-[#8B5E34] text-[#8B5E34] hover:bg-[#8B5E34] hover:text-white transition-colors">
                                <FilterOutlined />
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm mb-6 overflow-x-auto">
                        <div className="flex">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    className={`flex-1 min-w-[80px] px-3 py-2 text-center transition-colors ${
                                        activeTab === tab.id
                                            ? 'text-[#4A2B0F] border-b-2 border-[#8B5E34]'
                                            : 'text-[#8B5E34] hover:text-[#4A2B0F]'
                                    }`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    <span className="flex items-center justify-center gap-1">
                                        {tab.icon}
                                        <span className="text-sm hidden sm:inline">{tab.label}</span>
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {filteredOrders?.length > 0 ? (
                            filteredOrders.map(order => renderOrderCard(order))
                        ) : (
                            <div className="text-center py-8 bg-white rounded-lg">
                                <h2 className="text-xl font-light text-[#4A2B0F] mb-2">
                                    Aucune commande trouvée
                                </h2>
                                <p className="text-sm text-[#8B5E34]">
                                    Aucune commande {activeTab.replace('-', ' ')} pour le moment
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Orders; 