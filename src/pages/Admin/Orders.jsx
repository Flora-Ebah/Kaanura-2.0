import React, { useState } from 'react';
import { Table, Tag, Button, Modal, Select, message, Card, Statistic, DatePicker } from 'antd';
import { 
    ShoppingCartOutlined, 
    ClockCircleOutlined, 
    CheckCircleOutlined,
    SearchOutlined,
    FilterOutlined
} from '@ant-design/icons';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';

const { RangePicker } = DatePicker;

const Orders = () => {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const stats = [
        {
            title: "Commandes aujourd'hui",
            value: 24,
            icon: <ShoppingCartOutlined />,
            color: "#8B5E34"
        },
        {
            title: "En attente",
            value: 12,
            icon: <ClockCircleOutlined />,
            color: "#e67e22"
        },
        {
            title: "Livrées",
            value: 156,
            icon: <CheckCircleOutlined />,
            color: "#27ae60"
        }
    ];

    const orders = [
        {
            id: '#ORD-001',
            customer: 'Marie Dupont',
            date: '2024-03-20',
            amount: '125.00€',
            status: 'En cours',
            items: [
                { name: 'Huile de Ricin', quantity: 2, price: '29.99€' },
                { name: 'Huile de Coco', quantity: 1, price: '24.99€' }
            ],
            address: '123 Rue de Paris, 75001 Paris'
        },
        {
            id: '#ORD-002',
            customer: 'Jean Martin',
            date: '2024-03-19',
            amount: '89.99€',
            status: 'En attente',
            items: [
                { name: 'Beurre de Karité', quantity: 1, price: '89.99€' }
            ],
            address: '45 Avenue des Champs-Élysées, 75008 Paris'
        }
    ];

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Client',
            dataIndex: 'customer',
            key: 'customer',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Montant',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Statut',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'blue';
                if (status === 'Livré') color = 'green';
                if (status === 'En attente') color = 'orange';
                if (status === 'Annulé') color = 'red';
                return <Tag color={color}>{status}</Tag>;
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div className="space-x-2">
                    <Button 
                        onClick={() => {
                            setSelectedOrder(record);
                            setIsModalVisible(true);
                        }}
                    >
                        Détails
                    </Button>
                </div>
            ),
        },
    ];

    const handleStatusChange = (newStatus) => {
        message.success(`Statut de la commande ${selectedOrder.id} mis à jour : ${newStatus}`);
        setIsModalVisible(false);
    };

    return (
        <AdminLayout>
            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                {/* En-tête de page */}
                <div className="mb-6 md:mb-8">
                    <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Gestion des Commandes</h1>
                    <p className="text-sm md:text-base text-gray-600 mt-1">Suivez et gérez les commandes de vos clients</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {stats.map((stat, index) => (
                        <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
                            <Statistic
                                title={
                                    <span className="text-[#4A2B0F] flex items-center gap-2 text-sm md:text-base">
                                        {React.cloneElement(stat.icon, { className: 'text-lg md:text-xl' })} 
                                        {stat.title}
                                    </span>
                                }
                                value={stat.value}
                                valueStyle={{ color: stat.color, fontSize: '1.25rem md:1.5rem' }}
                            />
                        </Card>
                    ))}
                </div>

                {/* Filters Section */}
                <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm space-y-4">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        <h1 className="text-xl md:text-2xl font-medium text-[#4A2B0F]">Commandes</h1>
                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <RangePicker 
                                placeholder={['Date début', 'Date fin']}
                                className="w-full sm:w-64"
                            />
                            <Select
                                placeholder="Statut"
                                className="w-full sm:w-40"
                                options={[
                                    { value: 'all', label: 'Tous' },
                                    { value: 'pending', label: 'En attente' },
                                    { value: 'processing', label: 'En cours' },
                                    { value: 'shipped', label: 'Expédié' },
                                    { value: 'delivered', label: 'Livré' }
                                ]}
                            />
                            <Button icon={<FilterOutlined />} className="w-full sm:w-auto">Filtres</Button>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Rechercher une commande..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8B5E34]"
                            />
                            <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table 
                            columns={columns} 
                            dataSource={orders}
                            rowKey="id"
                            className="custom-table"
                            scroll={{ x: 'max-content' }}
                            pagination={{
                                pageSize: 10,
                                responsive: true,
                                showSizeChanger: true,
                                showTotal: (total, range) => (
                                    <span className="text-sm">
                                        {range[0]}-{range[1]} sur {total} commandes
                                    </span>
                                )
                            }}
                        />
                    </div>
                </div>

                {/* Order Details Modal */}
                <Modal
                    title={null}
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                    width={600}
                    style={{ top: 20 }}
                    className="custom-modal"
                >
                    {selectedOrder && (
                        <div className="space-y-4 md:space-y-6">
                            <div className="border-b pb-4">
                                <h2 className="text-xl md:text-2xl font-medium text-[#4A2B0F]">
                                    Commande {selectedOrder.id}
                                </h2>
                                <p className="text-sm md:text-base text-[#8B5E34]">{selectedOrder.date}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <h3 className="font-medium text-[#4A2B0F] mb-2 text-sm md:text-base">Client</h3>
                                    <Card className="bg-[#fff5e6]">
                                        <p className="font-medium text-sm md:text-base">{selectedOrder.customer}</p>
                                        <p className="text-[#8B5E34] text-sm">{selectedOrder.address}</p>
                                    </Card>
                                </div>
                                <div>
                                    <h3 className="font-medium text-[#4A2B0F] mb-2 text-sm md:text-base">Statut</h3>
                                    <Select
                                        defaultValue={selectedOrder.status}
                                        style={{ width: '100%' }}
                                        onChange={handleStatusChange}
                                        options={[
                                            { value: 'En attente', label: 'En attente' },
                                            { value: 'En cours', label: 'En cours' },
                                            { value: 'Expédié', label: 'Expédié' },
                                            { value: 'Livré', label: 'Livré' },
                                            { value: 'Annulé', label: 'Annulé' }
                                        ]}
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium text-[#4A2B0F] mb-2 text-sm md:text-base">Articles</h3>
                                <div className="overflow-x-auto">
                                    <Table
                                        dataSource={selectedOrder.items}
                                        columns={[
                                            { title: 'Produit', dataIndex: 'name' },
                                            { title: 'Quantité', dataIndex: 'quantity' },
                                            { title: 'Prix', dataIndex: 'price' }
                                        ]}
                                        pagination={false}
                                        rowKey="name"
                                        className="custom-table"
                                        scroll={{ x: 'max-content' }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </AdminLayout>
    );
};

export default Orders; 