import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Modal, Card, Statistic, Input, Select, Avatar, message } from 'antd';
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
import { db } from '../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';

const Customers = () => {
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [stats, setStats] = useState([
        {
            title: "Total Clients",
            value: 0,
            icon: <UserOutlined />,
            color: "#8B5E34"
        },
        {
            title: "Clients Actifs",
            value: 0,
            icon: <StarOutlined />,
            color: "#27ae60"
        },
        {
            title: "Commandes Moyennes",
            value: "0 FCFA",
            icon: <ShoppingOutlined />,
            color: "#e67e22"
        }
    ]);

    // Fonction pour formater le prix en FCFA
    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
    };

    // Fonction pour formater la date
    const formatDate = (timestamp) => {
        if (!timestamp) return 'Non disponible';
        
        // Si c'est un timestamp Firestore
        if (timestamp.seconds) {
            const date = new Date(timestamp.seconds * 1000);
            return new Intl.DateTimeFormat('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }).format(date);
        }
        
        // Si c'est une date string
        const date = new Date(timestamp);
        return new Intl.DateTimeFormat('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(date);
    };

    // Charger les clients et leurs commandes
    const fetchCustomers = async () => {
        setLoading(true);
        try {
            // 1. Récupérer tous les utilisateurs de type 'user'
            const usersQuery = query(
                collection(db, 'users'),
                where('type_user', '==', 'user')
            );
            const usersSnapshot = await getDocs(usersQuery);
            const usersData = usersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // 2. Récupérer toutes les commandes
            const ordersSnapshot = await getDocs(collection(db, 'orders'));
            const ordersData = ordersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // 3. Associer les commandes aux utilisateurs
            const customersWithOrders = usersData.map(user => {
                const userOrders = ordersData.filter(order => order.userId === user.id);
                const totalSpent = userOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
                const lastOrder = userOrders.length > 0 
                    ? userOrders.sort((a, b) => b.date?.seconds - a.date?.seconds)[0].date
                    : null;

                return {
                    ...user,
                    orders: userOrders.length,
                    totalSpent,
                    lastOrder,
                    status: userOrders.length > 0 ? 'Actif' : 'Inactif',
                    favoriteProducts: [], // À implémenter si nécessaire
                };
            });

            // 4. Calculer les statistiques
            const activeCustomers = customersWithOrders.filter(c => c.status === 'Actif').length;
            const totalOrders = customersWithOrders.reduce((sum, c) => sum + c.orders, 0);
            const averageOrderValue = totalOrders > 0 
                ? customersWithOrders.reduce((sum, c) => sum + c.totalSpent, 0) / totalOrders
                : 0;

            setStats([
                {
                    title: "Total Clients",
                    value: customersWithOrders.length,
                    icon: <UserOutlined />,
                    color: "#8B5E34"
                },
                {
                    title: "Clients Actifs",
                    value: activeCustomers,
                    icon: <StarOutlined />,
                    color: "#27ae60"
                },
                {
                    title: "Commandes Moyennes",
                    value: formatPrice(averageOrderValue),
                    icon: <ShoppingOutlined />,
                    color: "#e67e22"
                }
            ]);

            setCustomers(customersWithOrders);
        } catch (error) {
            console.error("Erreur lors du chargement des clients:", error);
            message.error("Erreur lors du chargement des clients");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

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
                    />
                    <div>
                        <div className="font-medium text-[#4A2B0F]">
                            {record.firstName} {record.lastName}
                        </div>
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
                <span className="font-medium text-[#4A2B0F]">{formatPrice(total)}</span>
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
        <AdminLayout loading={loading}>
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
                                />
                                <div>
                                    <h2 className="text-xl md:text-2xl font-medium text-[#4A2B0F]">
                                        {selectedCustomer.firstName} {selectedCustomer.lastName}
                                    </h2>
                                    <p className="text-sm md:text-base text-[#8B5E34]">
                                        Client depuis {formatDate(selectedCustomer.createdAt)}
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
                                            <span className="font-medium">{formatPrice(selectedCustomer.totalSpent)}</span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span>Dernière commande:</span>
                                            <span className="font-medium">
                                                {selectedCustomer.lastOrder ? formatDate(selectedCustomer.lastOrder) : 'Aucune commande'}
                                            </span>
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