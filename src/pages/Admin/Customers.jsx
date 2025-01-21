import React, { useState } from 'react';
import { Table, Tag, Button, Modal, Card, Statistic, Input, Select, Avatar } from 'antd';
import { 
    UserOutlined, 
    ShoppingOutlined, 
    StarOutlined,
    SearchOutlined,
    FilterOutlined,
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined
} from '@ant-design/icons';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';

const Customers = () => {
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const stats = [
        {
            title: "Total Clients",
            value: 1250,
            icon: <UserOutlined />,
            color: "#8B5E34"
        },
        {
            title: "Clients Actifs",
            value: 856,
            icon: <StarOutlined />,
            color: "#27ae60"
        },
        {
            title: "Commandes Moyennes",
            value: "75€",
            icon: <ShoppingOutlined />,
            color: "#e67e22"
        }
    ];

    const customers = [
        {
            id: 1,
            name: 'Marie Dupont',
            email: 'marie.dupont@email.com',
            phone: '+33 6 12 34 56 78',
            orders: 5,
            totalSpent: '625.00€',
            status: 'Actif',
            lastOrder: '2024-03-20',
            address: '123 Rue de Paris, 75001 Paris',
            avatar: null,
            joinDate: '2023-12-15',
            favoriteProducts: ['Huile de Ricin', 'Beurre de Karité']
        },
        {
            id: 2,
            name: 'Jean Martin',
            email: 'jean.martin@email.com',
            phone: '+33 6 98 76 54 32',
            orders: 3,
            totalSpent: '289.99€',
            status: 'Actif',
            lastOrder: '2024-03-19',
            address: '45 Avenue des Champs-Élysées, 75008 Paris',
            avatar: null,
            joinDate: '2024-01-05',
            favoriteProducts: ['Huile de Coco']
        }
    ];

    const columns = [
        {
            title: 'Client',
            key: 'name',
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    <Avatar 
                        size={40} 
                        icon={<UserOutlined />} 
                        className="bg-[#8B5E34]"
                        src={record.avatar}
                    />
                    <div>
                        <div className="font-medium text-[#4A2B0F]">{record.name}</div>
                        <div className="text-sm text-[#8B5E34]">{record.email}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Commandes',
            dataIndex: 'orders',
            key: 'orders',
            render: (orders) => (
                <Tag color="#8B5E34">{orders} commandes</Tag>
            ),
        },
        {
            title: 'Total dépensé',
            dataIndex: 'totalSpent',
            key: 'totalSpent',
            render: (total) => (
                <span className="font-medium text-[#4A2B0F]">{total}</span>
            ),
        },
        {
            title: 'Statut',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'Actif' ? 'green' : 'red'}>
                    {status}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button 
                    onClick={() => {
                        setSelectedCustomer(record);
                        setIsModalVisible(true);
                    }}
                    className="hover:text-[#8B5E34]"
                >
                    Voir détails
                </Button>
            ),
        }
    ];

    return (
        <AdminLayout>
            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                {/* En-tête de page */}
                <div className="mb-6 md:mb-8">
                    <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Gestion des Clients</h1>
                    <p className="text-sm md:text-base text-gray-600 mt-1">Gérez votre base de clients et leurs informations</p>
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
                        <h1 className="text-xl md:text-2xl font-medium text-[#4A2B0F]">Clients</h1>
                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <Select
                                placeholder="Statut"
                                className="w-full sm:w-40"
                                options={[
                                    { value: 'all', label: 'Tous' },
                                    { value: 'active', label: 'Actifs' },
                                    { value: 'inactive', label: 'Inactifs' }
                                ]}
                            />
                            <Button icon={<FilterOutlined />} className="w-full sm:w-auto">Filtres</Button>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Rechercher un client..."
                                prefix={<SearchOutlined className="text-gray-400" />}
                                className="w-full rounded-lg"
                            />
                        </div>
                    </div>
                </div>

                {/* Customers Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table 
                            columns={columns} 
                            dataSource={customers}
                            rowKey="id"
                            className="custom-table"
                            scroll={{ x: 'max-content' }}
                            pagination={{
                                pageSize: 10,
                                responsive: true,
                                showSizeChanger: true,
                                showTotal: (total, range) => (
                                    <span className="text-sm">
                                        {range[0]}-{range[1]} sur {total} clients
                                    </span>
                                )
                            }}
                        />
                    </div>
                </div>

                {/* Customer Details Modal */}
                <Modal
                    title={null}
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                    width={600}
                    style={{ top: 20 }}
                    className="custom-modal"
                >
                    {selectedCustomer && (
                        <div className="space-y-4 md:space-y-6">
                            <div className="flex items-center gap-4 border-b pb-4">
                                <Avatar 
                                    size={56} 
                                    icon={<UserOutlined />}
                                    className="bg-[#8B5E34]"
                                    src={selectedCustomer.avatar}
                                />
                                <div>
                                    <h2 className="text-xl md:text-2xl font-medium text-[#4A2B0F]">
                                        {selectedCustomer.name}
                                    </h2>
                                    <p className="text-sm md:text-base text-[#8B5E34]">
                                        Client depuis {selectedCustomer.joinDate}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <Card title="Informations de contact" className="shadow-sm">
                                    <div className="space-y-3 text-sm md:text-base">
                                        <p className="flex items-center gap-2">
                                            <MailOutlined /> {selectedCustomer.email}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <PhoneOutlined /> {selectedCustomer.phone}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <EnvironmentOutlined /> 
                                            <span className="break-words">{selectedCustomer.address}</span>
                                        </p>
                                    </div>
                                </Card>

                                <Card title="Statistiques" className="shadow-sm">
                                    <div className="space-y-3 text-sm md:text-base">
                                        <p className="flex justify-between">
                                            <span>Total commandes:</span>
                                            <span className="font-medium">{selectedCustomer.orders}</span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span>Montant total:</span>
                                            <span className="font-medium">{selectedCustomer.totalSpent}</span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span>Dernière commande:</span>
                                            <span className="font-medium">{selectedCustomer.lastOrder}</span>
                                        </p>
                                    </div>
                                </Card>
                            </div>

                            <Card title="Produits favoris" className="shadow-sm">
                                <div className="flex gap-2 flex-wrap">
                                    {selectedCustomer.favoriteProducts.map((product, index) => (
                                        <Tag key={index} color="#8B5E34">{product}</Tag>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    )}
                </Modal>
            </div>
        </AdminLayout>
    );
};

export default Customers; 