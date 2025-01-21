import React from 'react';
import { Table, Avatar } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, SyncOutlined } from '@ant-design/icons';

const RecentOrders = () => {
    const orders = [
        {
            id: '#ORD-001',
            customer: 'Marie Dupont',
            avatar: '/images/avatars/avatar1.jpg',
            date: '2024-03-20',
            amount: '125.00€',
            status: 'En cours',
            products: '2 produits'
        },
        {
            id: '#ORD-002',
            customer: 'Jean Martin',
            avatar: '/images/avatars/avatar2.jpg',
            date: '2024-03-19',
            amount: '89.99€',
            status: 'Livré',
            products: '1 produit'
        },
        {
            id: '#ORD-003',
            customer: 'Sophie Bernard',
            avatar: '/images/avatars/avatar3.jpg',
            date: '2024-03-19',
            amount: '245.50€',
            status: 'En attente',
            products: '3 produits'
        }
    ];

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Livré':
                return <CheckCircleOutlined className="text-green-500" />;
            case 'En cours':
                return <SyncOutlined spin className="text-blue-500" />;
            case 'En attente':
                return <ClockCircleOutlined className="text-orange-500" />;
            default:
                return null;
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
                            src={record.avatar}
                            size={40}
                            className="border-2 border-gray-100"
                        />
                    </div>
                    <div>
                        <p className="font-medium text-gray-800">{record.customer}</p>
                        <p className="text-xs text-gray-500">{record.id}</p>
                    </div>
                </div>
            )
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date) => (
                <div>
                    <p className="font-medium text-gray-800">
                        {new Date(date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short'
                        })}
                    </p>
                    <p className="text-xs text-gray-500">
                        {new Date(date).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </p>
                </div>
            )
        },
        {
            title: 'Montant',
            key: 'amount',
            render: (_, record) => (
                <div>
                    <p className="font-medium text-gray-800">{record.amount}</p>
                    <p className="text-xs text-gray-500">{record.products}</p>
                </div>
            )
        },
        {
            title: 'Statut',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const getStatusColor = (status) => {
                    switch (status) {
                        case 'Livré': return 'bg-green-50 text-green-700 border-green-100';
                        case 'En cours': return 'bg-blue-50 text-blue-700 border-blue-100';
                        case 'En attente': return 'bg-orange-50 text-orange-700 border-orange-100';
                        default: return 'bg-gray-50 text-gray-700 border-gray-100';
                    }
                };

                return (
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(status)}`}>
                        {getStatusIcon(status)}
                        <span className="text-sm font-medium">{status}</span>
                    </div>
                );
            }
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