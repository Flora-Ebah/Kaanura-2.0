import React, { useState, useEffect } from 'react';
import { Table, message } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { collection, query, orderBy, limit, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../../../config/firebase';

const TopProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fonction pour formater le prix en FCFA
    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
    };

    // Fonction pour calculer la tendance
    const calculateTrend = (currentSales, previousSales) => {
        if (!previousSales) return { value: 0, isPositive: true };
        const trend = ((currentSales - previousSales) / previousSales) * 100;
        return {
            value: Math.abs(trend).toFixed(1),
            isPositive: trend >= 0
        };
    };

    useEffect(() => {
        setLoading(true);
        
        const productsQuery = query(
            collection(db, 'orders'),
            orderBy('date', 'desc')
        );

        const unsubscribe = onSnapshot(productsQuery, async (snapshot) => {
            try {
                // Créer un map pour suivre les ventes par produit
                const salesMap = new Map();
                const revenueMap = new Map();

                // Analyser toutes les commandes pour calculer les ventes
                snapshot.docs.forEach(doc => {
                    const order = doc.data();
                    if (order.items && Array.isArray(order.items)) {
                        order.items.forEach(item => {
                            const currentSales = salesMap.get(item.id) || 0;
                            const currentRevenue = revenueMap.get(item.id) || 0;
                            
                            salesMap.set(item.id, currentSales + item.quantity);
                            revenueMap.set(item.id, currentRevenue + (item.price * item.quantity));
                        });
                    }
                });

                // Récupérer les informations des produits
                const productsSnapshot = await getDocs(collection(db, 'products'));
                const productsData = productsSnapshot.docs.map(doc => {
                    const data = doc.data();
                    const sales = salesMap.get(doc.id) || 0;
                    const revenue = revenueMap.get(doc.id) || 0;
                    const trend = calculateTrend(sales, data.previousSales || 0);

                    return {
                        id: doc.id,
                        name: data.name,
                        image: data.imageUrl,
                        category: data.category || 'Cosmétique naturel',
                        sales: sales,
                        revenue: revenue,
                        progress: Math.min(100, (sales / (Math.max(...salesMap.values()))) * 100),
                        trend
                    };
                });

                // Trier par ventes et prendre les 5 premiers
                const topProducts = productsData
                    .sort((a, b) => b.sales - a.sales)
                    .slice(0, 5);

                setProducts(topProducts);
            } catch (error) {
                console.error("Erreur lors du chargement des produits populaires:", error);
                message.error("Erreur lors du chargement des produits populaires");
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const columns = [
        {
            title: 'Produit',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shadow-sm">
                        <img 
                            src={record.image} 
                            alt={text}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = '/default-product.png';
                            }}
                        />
                    </div>
                    <div>
                        <p className="font-medium text-gray-800">{text}</p>
                        <p className="text-xs text-gray-500">{record.category}</p>
                    </div>
                </div>
            )
        },
        {
            title: 'Ventes',
            dataIndex: 'sales',
            key: 'sales',
            render: (sales, record) => (
                <div>
                    <p className="font-medium text-gray-800">{sales} unités</p>
                    <p className={`text-xs flex items-center gap-1 ${
                        record.trend.isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                        {record.trend.isPositive ? '+' : '-'}{record.trend.value}%
                        {record.trend.isPositive ? 
                            <ArrowUpOutlined className="text-xs" /> : 
                            <ArrowDownOutlined className="text-xs" />
                        }
                    </p>
                </div>
            )
        },
        {
            title: 'Revenus',
            dataIndex: 'revenue',
            key: 'revenue',
            render: (revenue) => (
                <span className="font-medium text-gray-800">{formatPrice(revenue)}</span>
            )
        },
        {
            title: 'Performance',
            dataIndex: 'progress',
            key: 'progress',
            render: (progress) => (
                <div className="w-full">
                    <div className="flex justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-[#8B5E34] to-[#A67B5B] rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <Table 
                    columns={columns} 
                    dataSource={products} 
                    pagination={false}
                    rowKey="id"
                    loading={loading}
                    className="top-products-table min-w-[800px]"
                    rowClassName="hover:bg-gray-50 transition-colors"
                />
            </div>
            <style jsx global>{`
                .top-products-table .ant-table {
                    background: transparent;
                }
                .top-products-table .ant-table-thead > tr > th {
                    background: #f9fafb;
                    color: #4b5563;
                    font-weight: 600;
                    padding: 12px 16px;
                    border-bottom: 1px solid #e5e7eb;
                    white-space: nowrap;
                }
                .top-products-table .ant-table-tbody > tr > td {
                    padding: 16px;
                    border-bottom: 1px solid #f3f4f6;
                    white-space: nowrap;
                }
                .top-products-table .ant-table-tbody > tr:last-child > td {
                    border-bottom: none;
                }
                .top-products-table .ant-table-tbody > tr:hover > td {
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

export default TopProducts; 