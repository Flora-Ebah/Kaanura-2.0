import React, { useState } from 'react';
import { 
    UserOutlined, 
    LockOutlined, 
    EnvironmentOutlined, 
    BellOutlined,
    CreditCardOutlined,
    SafetyCertificateOutlined,
    GlobalOutlined,
    QuestionCircleOutlined,
    EllipsisOutlined
} from '@ant-design/icons';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Settings = () => {
    const [activeSection, setActiveSection] = useState('profile');
    const [userInfo, setUserInfo] = useState({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@email.com',
        phone: '+33 6 12 34 56 78',
        language: 'Français',
        notifications: {
            orders: true,
            promotions: false,
            newsletter: true
        },
        addresses: [
            {
                id: 1,
                type: 'Principal',
                street: '123 Rue de Paris',
                city: 'Paris',
                postalCode: '75001',
                country: 'France'
            }
        ],
        paymentMethods: [
            {
                id: 1,
                type: 'Carte',
                last4: '4242',
                expiry: '04/25',
                default: true
            }
        ]
    });
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [newAddress, setNewAddress] = useState({
        type: '',
        street: '',
        city: '',
        postalCode: '',
        country: ''
    });
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const sections = [
        { id: 'profile', label: 'Profil', icon: <UserOutlined />, showMobile: true },
        { id: 'security', label: 'Sécurité', icon: <LockOutlined />, showMobile: true },
        { id: 'addresses', label: 'Adresses', icon: <EnvironmentOutlined />, showMobile: true },
        { id: 'notifications', label: 'Notifications', icon: <BellOutlined />, showMobile: true },
        { id: 'help', label: 'Aide', icon: <QuestionCircleOutlined />, showMobile: true }
    ];

    const handleEditAddress = (address) => {
        setEditingAddress(address);
        setIsEditModalOpen(true);
    };

    const AddressForm = ({ address, onSubmit, onCancel, isNew = false }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-xl font-medium text-[#4A2B0F] mb-4">
                    {isNew ? 'Ajouter une adresse' : 'Modifier l\'adresse'}
                </h3>
                <form className="space-y-4" onSubmit={onSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-[#4A2B0F] mb-1">Type d'adresse</label>
                        <input
                            type="text"
                            placeholder="Principal, Secondaire, etc."
                            defaultValue={address?.type}
                            className="w-full px-4 py-2 rounded-lg border border-[#8B5E34] focus:outline-none focus:ring-2 focus:ring-[#8B5E34] bg-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#4A2B0F] mb-1">Rue</label>
                        <input
                            type="text"
                            defaultValue={address?.street}
                            className="w-full px-4 py-2 rounded-lg border border-[#8B5E34] focus:outline-none focus:ring-2 focus:ring-[#8B5E34] bg-white"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[#4A2B0F] mb-1">Code postal</label>
                            <input
                                type="text"
                                defaultValue={address?.postalCode}
                                className="w-full px-4 py-2 rounded-lg border border-[#8B5E34] focus:outline-none focus:ring-2 focus:ring-[#8B5E34] bg-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#4A2B0F] mb-1">Ville</label>
                            <input
                                type="text"
                                defaultValue={address?.city}
                                className="w-full px-4 py-2 rounded-lg border border-[#8B5E34] focus:outline-none focus:ring-2 focus:ring-[#8B5E34] bg-white"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#4A2B0F] mb-1">Pays</label>
                        <input
                            type="text"
                            defaultValue={address?.country}
                            className="w-full px-4 py-2 rounded-lg border border-[#8B5E34] focus:outline-none focus:ring-2 focus:ring-[#8B5E34] bg-white"
                        />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-[#8B5E34] hover:text-[#4A2B0F]"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-[#8B5E34] text-white rounded-full hover:bg-[#4A2B0F] transition-colors"
                        >
                            {isNew ? 'Ajouter' : 'Sauvegarder'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    const renderProfileSection = () => (
        <div className="space-y-6">
            <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-[#fff5e6] flex items-center justify-center">
                        <UserOutlined className="text-3xl text-[#8B5E34]" />
                    </div>
                    <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md text-[#8B5E34] hover:text-[#4A2B0F] transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                    </button>
                </div>
                <div>
                    <h2 className="text-xl font-medium text-[#4A2B0F]">{`${userInfo.firstName} ${userInfo.lastName}`}</h2>
                    <p className="text-[#8B5E34]">{userInfo.email}</p>
                </div>
            </div>

            <form className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#4A2B0F] mb-1">Prénom</label>
                        <input
                            type="text"
                            value={userInfo.firstName}
                            className="w-full px-4 py-2 rounded-lg border border-[#8B5E34] focus:outline-none focus:ring-2 focus:ring-[#8B5E34] bg-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#4A2B0F] mb-1">Email</label>
                        <input
                            type="email"
                            value={userInfo.email}
                            className="w-full px-4 py-2 rounded-lg border border-[#8B5E34] focus:outline-none focus:ring-2 focus:ring-[#8B5E34] bg-white"
                        />
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#4A2B0F] mb-1">Nom</label>
                        <input
                            type="text"
                            value={userInfo.lastName}
                            className="w-full px-4 py-2 rounded-lg border border-[#8B5E34] focus:outline-none focus:ring-2 focus:ring-[#8B5E34] bg-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#4A2B0F] mb-1">Téléphone</label>
                        <input
                            type="tel"
                            value={userInfo.phone}
                            className="w-full px-4 py-2 rounded-lg border border-[#8B5E34] focus:outline-none focus:ring-2 focus:ring-[#8B5E34] bg-white"
                        />
                    </div>
                </div>
            </form>

            <div className="flex justify-end pt-6">
                <button className="px-6 py-2 bg-[#8B5E34] text-white rounded-full hover:bg-[#4A2B0F] transition-colors">
                    Sauvegarder les modifications
                </button>
            </div>
        </div>
    );

    const renderSecuritySection = () => (
        <div className="space-y-6">
            <h2 className="text-xl font-medium text-[#4A2B0F] mb-6">Sécurité</h2>
            <form className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-[#4A2B0F] mb-1">Mot de passe actuel</label>
                    <input
                        type="password"
                        className="w-full px-4 py-2 rounded-lg border border-[#8B5E34] focus:outline-none focus:ring-2 focus:ring-[#8B5E34] bg-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#4A2B0F] mb-1">Nouveau mot de passe</label>
                    <input
                        type="password"
                        className="w-full px-4 py-2 rounded-lg border border-[#8B5E34] focus:outline-none focus:ring-2 focus:ring-[#8B5E34] bg-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#4A2B0F] mb-1">Confirmer le nouveau mot de passe</label>
                    <input
                        type="password"
                        className="w-full px-4 py-2 rounded-lg border border-[#8B5E34] focus:outline-none focus:ring-2 focus:ring-[#8B5E34] bg-white"
                    />
                </div>
                <div className="flex justify-end">
                    <button className="px-6 py-2 bg-[#8B5E34] text-white rounded-full hover:bg-[#4A2B0F] transition-colors">
                        Mettre à jour le mot de passe
                    </button>
                </div>
            </form>
        </div>
    );

    const renderAddressesSection = () => (
        <div className="space-y-6">
            <h2 className="text-xl font-medium text-[#4A2B0F] mb-6">Adresses de livraison</h2>
            {userInfo.addresses.map((address) => (
                <div key={address.id} className="bg-[#fff5e6] p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-[#4A2B0F]">{address.type}</span>
                        <button 
                            onClick={() => handleEditAddress(address)}
                            className="text-[#8B5E34] hover:text-[#4A2B0F]"
                        >
                            Modifier
                        </button>
                    </div>
                    <p className="text-[#4A2B0F]">{address.street}</p>
                    <p className="text-[#4A2B0F]">{`${address.postalCode} ${address.city}`}</p>
                    <p className="text-[#4A2B0F]">{address.country}</p>
                </div>
            ))}
            <button 
                onClick={() => setIsAddressModalOpen(true)}
                className="w-full px-6 py-2 border border-[#8B5E34] text-[#8B5E34] rounded-full hover:bg-[#8B5E34] hover:text-white transition-colors"
            >
                + Ajouter une nouvelle adresse
            </button>

            {isEditModalOpen && (
                <AddressForm 
                    address={editingAddress}
                    onSubmit={(e) => {
                        e.preventDefault();
                        // Logique de modification
                        setIsEditModalOpen(false);
                    }}
                    onCancel={() => setIsEditModalOpen(false)}
                />
            )}

            {isAddressModalOpen && (
                <AddressForm 
                    address={newAddress}
                    onSubmit={(e) => {
                        e.preventDefault();
                        // Logique d'ajout
                        setIsAddressModalOpen(false);
                    }}
                    onCancel={() => setIsAddressModalOpen(false)}
                    isNew
                />
            )}
        </div>
    );

    const renderNotificationsSection = () => (
        <div className="space-y-6">
            <h2 className="text-xl font-medium text-[#4A2B0F] mb-6">Préférences de notifications</h2>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-[#4A2B0F] font-medium">Commandes</h3>
                        <p className="text-sm text-[#8B5E34]">Notifications sur l'état de vos commandes</p>
                    </div>
                    <input type="checkbox" checked={userInfo.notifications.orders} className="rounded text-[#8B5E34]" />
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-[#4A2B0F] font-medium">Promotions</h3>
                        <p className="text-sm text-[#8B5E34]">Offres spéciales et réductions</p>
                    </div>
                    <input type="checkbox" checked={userInfo.notifications.promotions} className="rounded text-[#8B5E34]" />
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-[#4A2B0F] font-medium">Newsletter</h3>
                        <p className="text-sm text-[#8B5E34]">Actualités et nouveaux produits</p>
                    </div>
                    <input type="checkbox" checked={userInfo.notifications.newsletter} className="rounded text-[#8B5E34]" />
                </div>
            </div>
            <div className="flex justify-end">
                <button className="px-6 py-2 bg-[#8B5E34] text-white rounded-full hover:bg-[#4A2B0F] transition-colors">
                    Sauvegarder les préférences
                </button>
            </div>
        </div>
    );

    const renderHelpSection = () => (
        <div className="space-y-6">
            <h2 className="text-xl font-medium text-[#4A2B0F] mb-6">Centre d'aide</h2>
            <div className="space-y-4">
                <div className="bg-[#fff5e6] p-4 rounded-lg">
                    <h3 className="text-[#4A2B0F] font-medium mb-2">FAQ</h3>
                    <p className="text-sm text-[#8B5E34]">Consultez nos questions fréquemment posées</p>
                </div>
                <div className="bg-[#fff5e6] p-4 rounded-lg">
                    <h3 className="text-[#4A2B0F] font-medium mb-2">Contact Support</h3>
                    <p className="text-sm text-[#8B5E34] mb-4">Notre équipe est là pour vous aider</p>
                    <button className="px-6 py-2 bg-[#8B5E34] text-white rounded-full hover:bg-[#4A2B0F] transition-colors">
                        Contacter le support
                    </button>
                </div>
            </div>
        </div>
    );

    const renderSection = () => {
        switch (activeSection) {
            case 'profile':
                return renderProfileSection();
            case 'security':
                return renderSecuritySection();
            case 'addresses':
                return renderAddressesSection();
            case 'notifications':
                return renderNotificationsSection();
            case 'help':
                return renderHelpSection();
            default:
                return renderProfileSection();
        }
    };

    return (
        <>
            <div style={{ backgroundColor: '#fff5e6', minHeight: '100vh' }}>
                <div className="container mx-auto px-4 pb-12 pt-48">
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <div className="grid md:grid-cols-[280px,1fr]">
                            {/* Mobile Menu Button */}
                            <div className="md:hidden p-4 border-b border-[#8B5E34]/10">
                                <button 
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="w-10 h-10 rounded-full bg-[#fff5e6] flex items-center justify-center text-[#8B5E34]"
                                >
                                    <EllipsisOutlined className="text-xl" />
                                </button>
                                
                                {/* Mobile Menu Dropdown */}
                                {isMobileMenuOpen && (
                                    <div className="absolute left-4 right-4 mt-2 py-2 bg-white rounded-lg shadow-lg border border-[#8B5E34]/10 z-50">
                                        {sections
                                            .filter(section => section.showMobile)
                                            .map((section) => (
                                                <button
                                                    key={section.id}
                                                    onClick={() => {
                                                        setActiveSection(section.id);
                                                        setIsMobileMenuOpen(false);
                                                    }}
                                                    className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                                                        activeSection === section.id
                                                            ? 'bg-[#8B5E34]/10 text-[#8B5E34]'
                                                            : 'text-[#4A2B0F] hover:bg-[#8B5E34]/5'
                                                    }`}
                                                >
                                                    {section.icon}
                                                    <span>{section.label}</span>
                                                </button>
                                            ))}
                                    </div>
                                )}
                            </div>

                            {/* Desktop Sidebar - Hidden on Mobile */}
                            <div className="hidden md:block bg-[#fff5e6] p-6 space-y-2">
                                {sections
                                    .filter(section => window.innerWidth >= 768 || section.showMobile)
                                    .map((section) => (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSection(section.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                                activeSection === section.id
                                                    ? 'bg-[#8B5E34] text-white'
                                                    : 'text-[#4A2B0F] hover:bg-[#8B5E34]/10'
                                            }`}
                                        >
                                            {section.icon}
                                            <span>{section.label}</span>
                                        </button>
                                    ))}
                            </div>

                            {/* Content */}
                            <div className="p-8">
                                <div className="max-w-3xl">
                                    {renderSection()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Settings; 