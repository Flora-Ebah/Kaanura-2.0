import React from 'react';
import { Table } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';

const TopProducts = () => {
    const products = [
        {
            id: 1,
            name: 'Huile de Ricin',
            image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=60',
            sales: 89,
            revenue: '2,670€',
            progress: 85,
            trend: '+12%'
        },
        {
            id: 2,
            name: 'Huile de Coco',
            image: 'https://images.unsplash.com/photo-1550831107-1553da8c8464?w=800&auto=format&fit=crop&q=60',
            sales: 75,
            revenue: '1,875€',
            progress: 70,
            trend: '+8%'
        },
        {
            id: 3,
            name: 'Beurre de Karité',
            image: 'https://images.unsplash.com/photo-1601300576246-965c4296b9d9?w=800&auto=format&fit=crop&q=60',
            sales: 68,
            revenue: '1,360€',
            progress: 65,
            trend: '+15%'
        }
    ];

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
                                e.target.src = 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&auto=format&fit=crop&q=60';
                            }}
                        />
                    </div>
                    <div>
                        <p className="font-medium text-gray-800">{text}</p>
                        <p className="text-xs text-gray-500">Cosmétique naturel</p>
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
                    <p className="text-xs text-green-600 flex items-center gap-1">
                        {record.trend}
                        <ArrowUpOutlined className="text-xs" />
                    </p>
                </div>
            )
        },
        {
            title: 'Revenus',
            dataIndex: 'revenue',
            key: 'revenue',
            render: (revenue) => (
                <span className="font-medium text-gray-800">{revenue}</span>
            )
        },
        {
            title: 'Performance',
            dataIndex: 'progress',
            key: 'progress',
            render: (progress) => (
                <div className="w-full">
                    <div className="flex justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700">{progress}%</span>
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