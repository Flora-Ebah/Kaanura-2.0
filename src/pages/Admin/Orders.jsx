import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Modal, Select, message, Card, Statistic, DatePicker, Tooltip } from 'antd';
import { 
    ShoppingCartOutlined, 
    ClockCircleOutlined, 
    CheckCircleOutlined,
    SearchOutlined,
    FilterOutlined
} from '@ant-design/icons';
import { db } from '../../config/firebase';
import { collection, getDocs, doc, updateDoc, query, where, orderBy, onSnapshot, writeBatch, getDoc, addDoc } from 'firebase/firestore';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import { auth } from '../../config/firebase';
import emailjs from '@emailjs/browser';

const { RangePicker } = DatePicker;

const Orders = () => {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState([
        {
            title: "Commandes aujourd'hui",
            value: 0,
            icon: <ShoppingCartOutlined />,
            color: "#8B5E34"
        },
        {
            title: "En attente",
            value: 0,
            icon: <ClockCircleOutlined />,
            color: "#e67e22"
        },
        {
            title: "Livrées",
            value: 0,
            icon: <CheckCircleOutlined />,
            color: "#27ae60"
        }
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateRange, setDateRange] = useState(null);
    const [filteredOrders, setFilteredOrders] = useState([]);

    // Fonction pour formater le prix en FCFA
    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
    };

    // Fonction pour calculer les statistiques
    const calculateStats = (ordersData) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayOrders = ordersData.filter(order => {
            // Vérifier si la date est un timestamp Firestore
            if (order.date?.seconds) {
                const orderDate = new Date(order.date.seconds * 1000);
                return orderDate >= today;
            }
            // Si c'est une date ISO
            const orderDate = new Date(order.date);
            return orderDate >= today;
        }).length;

        const pendingOrders = ordersData.filter(order => 
            order.status === 'En attente'
        ).length;

        const deliveredOrders = ordersData.filter(order => 
            order.status === 'Livré'
        ).length;

        return [
            {
                title: "Commandes aujourd'hui",
                value: todayOrders,
                icon: <ShoppingCartOutlined />,
                color: "#8B5E34",
                tooltip: `${todayOrders} commande${todayOrders > 1 ? 's' : ''} aujourd'hui`
            },
            {
                title: "En attente",
                value: pendingOrders,
                icon: <ClockCircleOutlined />,
                color: "#e67e22",
                tooltip: `${pendingOrders} commande${pendingOrders > 1 ? 's' : ''} en attente`
            },
            {
                title: "Livrées",
                value: deliveredOrders,
                icon: <CheckCircleOutlined />,
                color: "#27ae60",
                tooltip: `${deliveredOrders} commande${deliveredOrders > 1 ? 's' : ''} livrées`
            }
        ];
    };

    // Fonction pour regrouper les commandes par client et par jour
    const groupOrdersByClientAndDay = (orders) => {
        const groupedOrders = orders.reduce((acc, order) => {
            // Créer une clé unique pour chaque client et jour
            const date = new Date(order.date.seconds * 1000);
            const dayKey = date.toISOString().split('T')[0];
            const clientKey = `${order.userId}_${dayKey}`;

            if (!acc[clientKey]) {
                // Première commande pour ce client ce jour-là
                acc[clientKey] = {
                    ...order,
                    items: [...order.items],
                    totalAmount: order.totalAmount,
                    originalOrders: [order.id],
                    orderStatuses: [order.status],
                    date: order.date,
                };
            } else {
                // Fusionner avec la commande existante
                acc[clientKey].items = [...acc[clientKey].items, ...order.items];
                acc[clientKey].totalAmount += order.totalAmount;
                acc[clientKey].originalOrders.push(order.id);
                acc[clientKey].orderStatuses.push(order.status);
            }
            return acc;
        }, {});

        // Pour chaque groupe, déterminer le statut global
        return Object.values(groupedOrders).map(group => ({
            ...group,
            status: determineGroupStatus(group.orderStatuses)
        }));
    };

    // Fonction pour déterminer le statut global d'un groupe de commandes
    const determineGroupStatus = (statuses) => {
        // Si tous les statuts sont identiques, utiliser ce statut
        if (new Set(statuses).size === 1) {
            return statuses[0];
        }

        // Si au moins une commande est "En attente", le groupe est "En attente"
        if (statuses.includes('En attente')) {
            return 'En attente';
        }

        // Si au moins une commande est "En cours", le groupe est "En cours"
        if (statuses.includes('En cours')) {
            return 'En cours';
        }

        // Si au moins une commande est "Expédié", le groupe est "Expédié"
        if (statuses.includes('Expédié')) {
            return 'Expédié';
        }

        // Si toutes les commandes sont "Livrées" ou "Annulées"
        if (statuses.every(status => status === 'Livré' || status === 'Annulé')) {
            const livres = statuses.filter(s => s === 'Livré').length;
            const annules = statuses.filter(s => s === 'Annulé').length;
            return livres >= annules ? 'Livré' : 'Annulé';
        }

        return statuses[0]; // Fallback au premier statut
    };

    // Écouter les changements des commandes en temps réel
    useEffect(() => {
        setLoading(true);
        const ordersQuery = query(
            collection(db, 'orders'),
            orderBy('date', 'desc')
        );

        const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
            const ordersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                key: doc.id
            }));

            // Grouper les commandes avant de les stocker
            const groupedOrders = groupOrdersByClientAndDay(ordersData);
            setOrders(groupedOrders);
            setFilteredOrders(groupedOrders);
            setStats(calculateStats(ordersData)); // Garder les stats sur toutes les commandes
            setLoading(false);
        }, (error) => {
            console.error("Erreur lors de l'écoute des commandes:", error);
            message.error("Erreur lors du chargement des commandes");
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Appliquer les filtres
    useEffect(() => {
        let result = [...orders];

        // Filtre par recherche
        if (searchTerm) {
            result = result.filter(order => 
                order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtre par statut
        if (statusFilter !== 'all') {
            result = result.filter(order => order.status === statusFilter);
        }

        // Filtre par date
        if (dateRange && dateRange[0] && dateRange[1]) {
            const startDate = dateRange[0].startOf('day').valueOf();
            const endDate = dateRange[1].endOf('day').valueOf();
            
            result = result.filter(order => {
                const orderDate = new Date(order.date.seconds * 1000).getTime();
                return orderDate >= startDate && orderDate <= endDate;
            });
        }

        setFilteredOrders(result);
    }, [orders, searchTerm, statusFilter, dateRange]);

    const sendStatusUpdateEmail = async (orderGroup, newStatus, shopData) => {
        try {
            emailjs.init("BsNolhO31AKSsIfBy");

            // Récupérer les informations du client
            const userDoc = await getDoc(doc(db, 'users', orderGroup.userId));
            if (!userDoc.exists()) {
                throw new Error("Utilisateur non trouvé");
            }
            const userData = userDoc.data();

            const totalAmount = orderGroup.items.reduce((sum, item) => 
                sum + (item.price * item.quantity), 0
            );

            const groupedItems = orderGroup.items.reduce((acc, item) => {
                const existingItem = acc.find(i => i.id === item.id);
                if (existingItem) {
                    existingItem.quantity += item.quantity;
                } else {
                    acc.push({ ...item });
                }
                return acc;
            }, []);

            // Créer le tableau HTML directement
            const itemsTable = `
                ${groupedItems.map(item => `
                    <tr>
                        <td style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">${item.name}</td>
                        <td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${item.quantity}</td>
                        <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">${item.price.toLocaleString('fr-FR')} FCFA</td>
                        <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">${(item.price * item.quantity).toLocaleString('fr-FR')} FCFA</td>
                    </tr>
                `).join('')}
            `;

            const templateParams = {
                to_email: userData.email,           // Email du client (destinataire)
                to_name: userData.firstName + ' ' + userData.lastName,  // Nom du client
                reply_to: shopData.email,           // Les réponses iront à l'admin
                shop_name: shopData.name,
                order_id: orderGroup.originalOrders.join(', '),
                order_status: newStatus,
                order_date: new Date(orderGroup.date.seconds * 1000).toLocaleDateString('fr-FR'),
                order_total: totalAmount.toLocaleString('fr-FR'),
                shop_email: shopData.email,
                shop_phone: shopData.mainPhone,
                items_list: itemsTable,
                shipping_address: `${orderGroup.shippingAddress.street}, ${orderGroup.shippingAddress.city}, ${orderGroup.shippingAddress.postalCode}, ${orderGroup.shippingAddress.country}`,
                orders_count: orderGroup.originalOrders.length > 1 ? 
                    `(${orderGroup.originalOrders.length} commandes groupées)` : ''
            };

            await emailjs.send(
                'service_zo719yo',
                'template_fbvazfj',
                templateParams,
                'BsNolhO31AKSsIfBy'
            );

            console.log('Email envoyé avec succès au client:', userData.email);
        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'email:', error);
            throw error;
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            const user = auth.currentUser;
            if (!user) {
                message.error("Vous devez être connecté");
                return;
            }

            // Récupérer les informations de la boutique
            const shopDoc = await getDoc(doc(db, 'shop', 'info'));
            if (!shopDoc.exists()) {
                message.error("Informations de la boutique non trouvées");
                return;
            }
            const shopData = shopDoc.data();

            // Si le statut passe à "En cours" et l'ancien statut était "En attente"
            if (newStatus === 'En cours' && selectedOrder.status === 'En attente') {
                const batch = writeBatch(db);
                
                // Map pour suivre les quantités totales à déduire par produit
                const productQuantities = new Map();

                // Calculer la quantité totale à déduire pour chaque produit
                selectedOrder.items.forEach(item => {
                    const currentQuantity = productQuantities.get(item.id) || 0;
                    productQuantities.set(item.id, currentQuantity + item.quantity);
                });

                // Mettre à jour le stock de chaque produit
                for (const [productId, quantityToDeduct] of productQuantities) {
                    const productRef = doc(db, 'products', productId);
                    const productSnap = await getDoc(productRef);
                    
                    if (productSnap.exists()) {
                        const currentStock = productSnap.data().stock || 0;
                        const newStock = Math.max(0, currentStock - quantityToDeduct);
                        
                        batch.update(productRef, {
                            stock: newStock,
                            updatedAt: new Date().toISOString()
                        });
                    }
                }

                // Mettre à jour le statut de toutes les commandes du groupe
                for (const orderId of selectedOrder.originalOrders) {
                    const orderRef = doc(db, 'orders', orderId);
                    batch.update(orderRef, {
                        status: newStatus,
                        updatedAt: new Date().toISOString(),
                        updatedBy: user.uid,
                        lastStatusUpdate: {
                            status: newStatus,
                            date: new Date().toISOString(),
                        }
                    });
                }

                // Exécuter toutes les mises à jour en une seule transaction
                await batch.commit();
                
                // Envoyer un seul email pour le groupe après la mise à jour du stock
                try {
                    await sendStatusUpdateEmail(selectedOrder, newStatus, shopData);
                } catch (emailError) {
                    console.error('Erreur lors de l\'envoi de l\'email:', emailError);
                    message.warning('Les commandes ont été mises à jour mais l\'email n\'a pas pu être envoyé');
                }
                
                message.success('Commandes mises en cours et stocks mis à jour');
            } else {
                // Pour les autres changements de statut
                const batch = writeBatch(db);
                
                // Mettre à jour toutes les commandes du groupe
                for (const orderId of selectedOrder.originalOrders) {
                    const orderRef = doc(db, 'orders', orderId);
                    batch.update(orderRef, {
                        status: newStatus,
                        updatedAt: new Date().toISOString(),
                        updatedBy: user.uid,
                        lastStatusUpdate: {
                            status: newStatus,
                            date: new Date().toISOString(),
                        }
                    });
                }

                // D'abord effectuer les mises à jour
                await batch.commit();

                // Ensuite envoyer un seul email pour le groupe entier
                try {
                    await sendStatusUpdateEmail(selectedOrder, newStatus, shopData);
                    message.success(`Statut des commandes mis à jour : ${newStatus}`);
                } catch (emailError) {
                    console.error('Erreur lors de l\'envoi de l\'email:', emailError);
                    message.warning('Les commandes ont été mises à jour mais l\'email n\'a pas pu être envoyé');
                }
            }

            // Mettre à jour l'ordre sélectionné localement
            setSelectedOrder(prev => ({
                ...prev,
                status: newStatus,
                lastStatusUpdate: {
                    status: newStatus,
                    date: new Date().toISOString(),
                }
            }));

        } catch (error) {
            console.error("Erreur lors de la mise à jour:", error);
            message.error("Erreur lors de la mise à jour");
        }
    };

    // Fonction pour formater la date Firestore
    const formatFirestoreDate = (firestoreDate) => {
        if (!firestoreDate) return '';
        
        // Si c'est un timestamp Firestore
        if (firestoreDate.seconds) {
            const date = new Date(firestoreDate.seconds * 1000);
            return date.toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        
        // Si c'est une date ISO string
        return new Date(firestoreDate).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    const handleStatusFilterChange = (value) => {
        setStatusFilter(value);
    };

    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
    };

    // Ajouter cette fonction après les autres fonctions utilitaires
    const getStatusColor = (status) => {
        switch (status) {
            case 'Livré':
                return 'green';
            case 'En cours':
                return 'blue';
            case 'En attente':
                return 'orange';
            case 'Expédié':
                return 'purple';
            case 'Annulé':
                return 'red';
            default:
                return 'default';
        }
    };

    const columns = [
        {
            title: 'ID',
            key: 'id',
            render: (_, record) => (
                <div>
                    <span className="font-medium">
                        #{record.originalOrders[0].slice(0, 8).toUpperCase()}
                    </span>
                    {record.originalOrders.length > 1 && (
                        <span className="text-xs text-gray-500 block">
                            +{record.originalOrders.length - 1} autre(s)
                        </span>
                    )}
                </div>
            )
        },
        {
            title: 'Client',
            dataIndex: 'customerName',
            key: 'customerName',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date) => formatFirestoreDate(date)
        },
        {
            title: 'Montant',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount, record) => {
                // Calculer le total réel en tenant compte des quantités
                const total = record.items.reduce((sum, item) => 
                    sum + (item.price * item.quantity), 0
                );

                // Grouper les articles identiques pour le compte
                const uniqueItems = record.items.reduce((acc, item) => {
                    const existingItem = acc.find(i => i.id === item.id);
                    if (existingItem) {
                        existingItem.quantity += item.quantity;
                    } else {
                        acc.push({ ...item });
                    }
                    return acc;
                }, []);

                return (
                    <div>
                        <span className="font-medium">{formatPrice(total)}</span>
                        <span className="text-xs text-gray-500 block">
                            {uniqueItems.length} article{uniqueItems.length > 1 ? 's' : ''} différent{uniqueItems.length > 1 ? 's' : ''}
                        </span>
                    </div>
                );
            }
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

    return (
        <AdminLayout loading={loading}>
            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                {/* En-tête de page */}
                <div className="mb-6 md:mb-8">
                    <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Gestion des Commandes</h1>
                    <p className="text-sm md:text-base text-gray-600 mt-1">Suivez et gérez les commandes de vos clients</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {stats.map((stat, index) => (
                        <Card 
                            key={index} 
                            className="shadow-sm hover:shadow-md transition-shadow"
                            title={
                                <Tooltip title={stat.tooltip}>
                                    <span className="text-[#4A2B0F] flex items-center gap-2 text-sm md:text-base">
                                        {React.cloneElement(stat.icon, { 
                                            className: 'text-lg md:text-xl',
                                            style: { color: stat.color }
                                        })} 
                                        {stat.title}
                                    </span>
                                </Tooltip>
                            }
                        >
                            <Statistic
                                value={stat.value}
                                valueStyle={{ 
                                    color: stat.color, 
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold'
                                }}
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
                                onChange={handleDateRangeChange}
                            />
                            <Select
                                placeholder="Statut"
                                className="w-full sm:w-40"
                                value={statusFilter}
                                onChange={handleStatusFilterChange}
                                options={[
                                    { value: 'all', label: 'Tous' },
                                    { value: 'En attente', label: 'En attente' },
                                    { value: 'En cours', label: 'En cours' },
                                    { value: 'Expédié', label: 'Expédié' },
                                    { value: 'Livré', label: 'Livré' },
                                    { value: 'Annulé', label: 'Annulé' }
                                ]}
                            />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Rechercher une commande..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8B5E34]"
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
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
                            dataSource={filteredOrders}
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
                                    Commandes du {formatFirestoreDate(selectedOrder.date).split(' à ')[0]}
                                </h2>
                                {selectedOrder.originalOrders.length > 1 && (
                                    <p className="text-sm text-gray-500">
                                        {selectedOrder.originalOrders.length} commandes regroupées
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <h3 className="font-medium text-[#4A2B0F] mb-2 text-sm md:text-base">Client</h3>
                                    <Card className="bg-[#fff5e6]">
                                        <p className="font-medium text-sm md:text-base">{selectedOrder.customerName}</p>
                                        <p className="text-[#8B5E34] text-sm">
                                            {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}
                                        </p>
                                        <p className="text-[#8B5E34] text-sm">
                                            {selectedOrder.shippingAddress?.postalCode} {selectedOrder.shippingAddress?.country}
                                        </p>
                                    </Card>
                                </div>
                                <div>
                                    <h3 className="font-medium text-[#4A2B0F] mb-2 text-sm md:text-base">Statut</h3>
                                    <div className="space-y-2">
                                        <Select
                                            value={selectedOrder.status}
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
                                        <Tag color={getStatusColor(selectedOrder.status)} className="mt-2">
                                            {selectedOrder.originalOrders.length > 1 ? 
                                                `${selectedOrder.originalOrders.length} commandes ${selectedOrder.status.toLowerCase()}` : 
                                                selectedOrder.status
                                            }
                                        </Tag>
                                        {selectedOrder.lastStatusUpdate && (
                                            <p className="text-xs text-[#8B5E34] mt-2">
                                                Dernière mise à jour : {formatFirestoreDate(selectedOrder.lastStatusUpdate.date)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium text-[#4A2B0F] mb-2">Articles</h3>
                                <Table
                                    dataSource={selectedOrder.items}
                                    columns={[
                                        { 
                                            title: 'Produit', 
                                            dataIndex: 'name',
                                            render: (name, record) => (
                                                <div className="flex items-center gap-2">
                                                    <img 
                                                        src={record.imageUrl} 
                                                        alt={name}
                                                        className="w-8 h-8 rounded-lg object-cover"
                                                    />
                                                    <span>{name}</span>
                                                </div>
                                            )
                                        },
                                        { title: 'Quantité', dataIndex: 'quantity' },
                                        { 
                                            title: 'Prix', 
                                            dataIndex: 'price',
                                            render: price => formatPrice(price)
                                        }
                                    ]}
                                    pagination={false}
                                    rowKey={(record, index) => `${record.id}_${index}`}
                                    summary={pageData => {
                                        const total = pageData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                                        return (
                                            <Table.Summary.Row>
                                                <Table.Summary.Cell>Total</Table.Summary.Cell>
                                                <Table.Summary.Cell></Table.Summary.Cell>
                                                <Table.Summary.Cell>
                                                    <strong>{formatPrice(total)}</strong>
                                                </Table.Summary.Cell>
                                            </Table.Summary.Row>
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </AdminLayout>
    );
};

export default Orders; 