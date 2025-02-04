import React, { useState, useEffect } from 'react';
import { Table, Avatar, message } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, SyncOutlined, CarOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { collection, query, orderBy, limit, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';

const RecentOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fonction pour formater le prix en FCFA
    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
    };

    // Fonction pour formater la date Firestore
    const formatFirestoreDate = (firestoreDate) => {
        if (!firestoreDate) return '';
        
        // Si c'est un timestamp Firestore
        if (firestoreDate.seconds) {
            const date = new Date(firestoreDate.seconds * 1000);
            return {
                date: date.toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short'
                }),
                time: date.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };
        }
        
        // Si c'est une date ISO string
        const date = new Date(firestoreDate);
        return {
            date: date.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short'
            }),
            time: date.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            })
        };
    };

    // Fonction pour générer une couleur de fond
    const getBackgroundColor = (name) => {
        const colors = [
            '#8B5E34', '#A67B5B', '#C4A484', 
            '#D2B48C', '#DEB887', '#E6CCAF'
        ];
        const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[index % colors.length];
    };

    // Fonction pour obtenir les initiales
    const getInitials = (name) => {
        if (!name) return '??';
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    useEffect(() => {
        const fetchRecentOrders = async () => {
            setLoading(true);
            try {
                const ordersQuery = query(
                    collection(db, 'orders'),
                    orderBy('date', 'desc'),
                    limit(5)
                );
                const snapshot = await getDocs(ordersQuery);
                const ordersData = await Promise.all(snapshot.docs.map(async docSnapshot => {
                    const orderData = docSnapshot.data();
                    
                    // Récupérer les informations du client
                    const userDocRef = doc(db, 'users', orderData.userId);
                    const userDocSnap = await getDoc(userDocRef);
                    const userData = userDocSnap.exists() ? userDocSnap.data() : null;
                    
                    return {
                        id: docSnapshot.id,
                        ...orderData,
                        customer: userData ? `${userData.firstName} ${userData.lastName}` : 'Client inconnu',
                        products: `${orderData.items.length} produit${orderData.items.length > 1 ? 's' : ''}`
                    };
                }));
                setOrders(ordersData);
            } catch (error) {
                console.error("Erreur lors du chargement des commandes récentes:", error);
                message.error("Erreur lors du chargement des commandes récentes");
            } finally {
                setLoading(false);
            }
        };

        fetchRecentOrders();
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Livré':
                return <CheckCircleOutlined className="text-green-500" />;
            case 'En cours':
                return <SyncOutlined spin className="text-blue-500" />;
            case 'En attente':
                return <ClockCircleOutlined className="text-orange-500" />;
            case 'Expédié':
                return <CarOutlined className="text-purple-500" />;
            case 'Annulé':
                return <CloseCircleOutlined className="text-red-500" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Livré': 
                return 'bg-green-50 text-green-700 border-green-100';
            case 'En cours': 
                return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'En attente': 
                return 'bg-orange-50 text-orange-700 border-orange-100';
            case 'Expédié': 
                return 'bg-purple-50 text-purple-700 border-purple-100';
            case 'Annulé': 
                return 'bg-red-50 text-red-700 border-red-100';
            default: 
                return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    const columns = [
        {
            title: 'Commande',
            key: 'order',
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                        <Avatar 
                            style={{ 
                                backgroundColor: getBackgroundColor(record.customerName),
                                color: 'white',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid #f3f4f6'
                            }}
                            size={40}
                        >
                            {getInitials(record.customerName)}
                        </Avatar>
                    </div>
                    <div>
                        <p className="font-medium text-gray-800">{record.customerName}</p>
                        <p className="text-xs text-gray-500">#{record.id.slice(-6).toUpperCase()}</p>
                        <p className="text-xs text-gray-500">{record.email}</p>
                    </div>
                </div>
            )
        },
        {
            title: 'Produits',
            key: 'products',
            render: (_, record) => (
                <div className="space-y-2">
                    {record.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <img 
                                src={item.imageUrl} 
                                alt={item.name}
                                className="w-8 h-8 rounded-lg object-cover"
                            />
                            <div>
                                <p className="text-sm font-medium">{item.name}</p>
                                <p className="text-xs text-gray-500">
                                    {item.quantity} x {formatPrice(item.price)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )
        },
        {
            title: 'Adresse',
            key: 'address',
            render: (_, record) => (
                <div>
                    <p className="text-sm">{record.shippingAddress?.street}</p>
                    <p className="text-xs text-gray-500">
                        {record.shippingAddress?.city}, {record.shippingAddress?.country}
                    </p>
                    <p className="text-xs text-gray-500">
                        {record.phone}
                    </p>
                </div>
            )
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date) => {
                const formattedDate = formatFirestoreDate(date);
                return (
                    <div>
                        <p className="font-medium text-gray-800">{formattedDate.date}</p>
                        <p className="text-xs text-gray-500">{formattedDate.time}</p>
                    </div>
                );
            }
        },
        {
            title: 'Montant',
            key: 'amount',
            render: (_, record) => (
                <div>
                    <p className="font-medium text-gray-800">{formatPrice(record.totalAmount)}</p>
                    <p className="text-xs text-gray-500">{record.items.length} produit{record.items.length > 1 ? 's' : ''}</p>
                </div>
            )
        },
        {
            title: 'Statut',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(status)}`}>
                    {getStatusIcon(status)}
                    <span className="text-sm font-medium">{status}</span>
                </div>
            )
        }
    ];

    return (
        <div className="rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <Table 
                    columns={columns} 
                    dataSource={orders} 
                    pagination={false}
                    rowKey="id"
                    loading={loading}
                    className="recent-orders-table min-w-[800px]"
                    rowClassName="hover:bg-gray-50 transition-colors"
                />
            </div>
            <style jsx global>{`
                .recent-orders-table .ant-table {
                    background: transparent;
                }
                .recent-orders-table .ant-table-thead > tr > th {
                    background: #f9fafb;
                    color: #4b5563;
                    font-weight: 600;
                    padding: 12px 16px;
                    border-bottom: 1px solid #e5e7eb;
                    white-space: nowrap;
                }
                .recent-orders-table .ant-table-tbody > tr > td {
                    padding: 16px;
                    border-bottom: 1px solid #f3f4f6;
                    white-space: nowrap;
                }
                .recent-orders-table .ant-table-tbody > tr:last-child > td {
                    border-bottom: none;
                }
                .recent-orders-table .ant-table-tbody > tr:hover > td {
                    background: #f9fafb;
                }
                /* Styles pour la barre de défilement */
                .overflow-x-auto::-webkit-scrollbar {
                    height: 6px;
                }
                .overflow-x-auto::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 3px;
                }
                .overflow-x-auto::-webkit-scrollbar-thumb {
                    background: #888;
                    border-radius: 3px;
                }
                .overflow-x-auto::-webkit-scrollbar-thumb:hover {
                    background: #666;
                }
            `}</style>
        </div>
    );
};

export default RecentOrders; 