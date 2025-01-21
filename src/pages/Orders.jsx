import React, { useState } from 'react';
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

const Orders = () => {
    const { cartItems } = useCart();
    const [activeTab, setActiveTab] = useState('en-cours');
    const [searchTerm, setSearchTerm] = useState('');

    // Simuler différents types de commandes
    const orders = {
        'en-cours': [
            {
                id: '1',
                date: '2024-03-20',
                status: 'En préparation',
                items: cartItems,
                total: '89.99',
                estimatedDelivery: '2024-03-25'
            }
        ],
        'livrees': [
            {
                id: '2',
                date: '2024-03-15',
                status: 'Livrée',
                items: cartItems,
                total: '129.99',
                deliveryDate: '2024-03-18'
            }
        ],
        'retours': [
            {
                id: '3',
                date: '2024-03-10',
                status: 'Retour accepté',
                items: cartItems.slice(0, 1),
                total: '45.99',
                returnReason: 'Taille incorrecte'
            }
        ]
    };

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
                            <h3 className="text-lg font-medium text-[#4A2B0F]">Commande #{order.id}</h3>
                            <p className="text-sm text-[#8B5E34]">Passée le {order.date}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-sm bg-[#fff5e6] text-[#8B5E34]">
                            {order.status}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-[#8B5E34]">Total</p>
                        <p className="text-lg font-medium text-[#4A2B0F]">{order.total} €</p>
                    </div>
                </div>
                
                {order.estimatedDelivery && (
                    <p className="text-sm text-[#8B5E34] mb-4">
                        Livraison estimée : {order.estimatedDelivery}
                    </p>
                )}

                <div className="space-y-3">
                    {order.items.map((item) => (
                        <div key={item.name} className="flex gap-3 p-3 bg-[#fff5e6] rounded-lg">
                            <img 
                                src={item.img} 
                                alt={item.name} 
                                className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                            />
                            <div className="flex-grow min-w-0">
                                <h4 className="text-[#4A2B0F] font-medium truncate">{item.name}</h4>
                                <p className="text-sm text-[#8B5E34]">Quantité: {item.quantity}</p>
                                <div className="flex justify-between items-center mt-1">
                                    <p className="text-[#4A2B0F] font-medium">{item.price}</p>
                                    {activeTab === 'livrees' && (
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
                        {orders[activeTab]?.length > 0 ? (
                            orders[activeTab].map(order => renderOrderCard(order))
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