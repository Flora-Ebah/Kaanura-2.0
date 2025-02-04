import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { message } from 'antd';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential, onAuthStateChanged } from 'firebase/auth';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Settings = () => {
    const [activeSection, setActiveSection] = useState('profile');
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [user, setUser] = useState(null);
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
    const [profileFormData, setProfileFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigate = useNavigate();

    const sections = [
        { id: 'profile', label: 'Profil', icon: <UserOutlined />, showMobile: true },
        { id: 'security', label: 'Sécurité', icon: <LockOutlined />, showMobile: true },
        { id: 'addresses', label: 'Adresses', icon: <EnvironmentOutlined />, showMobile: true },
        { id: 'notifications', label: 'Notifications', icon: <BellOutlined />, showMobile: true },
        { id: 'help', label: 'Aide', icon: <QuestionCircleOutlined />, showMobile: true }
    ];

    // Écouter l'état de l'authentification
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (!currentUser) {
                message.info("Veuillez vous connecter pour accéder aux paramètres");
                navigate('/login');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    // Charger les informations de l'utilisateur
    useEffect(() => {
        const fetchUserInfo = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    setUserInfo(userDoc.data());
                }
                setDataLoaded(true);
            } catch (error) {
                console.error("Erreur lors du chargement des données:", error);
                message.error("Erreur lors du chargement des données");
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [user]);

    useEffect(() => {
        if (userInfo) {
            setProfileFormData({
                firstName: userInfo.firstName || '',
                lastName: userInfo.lastName || '',
                email: userInfo.email || '',
                phone: userInfo.phone || ''
            });
        }
    }, [userInfo]);

    const handleUpdateProfile = async (updatedData) => {
        const user = auth.currentUser;
        if (!user) {
            message.error("Veuillez vous connecter");
            return;
        }

        try {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, updatedData);
            setUserInfo(prev => ({ ...prev, ...updatedData }));
            message.success("Profil mis à jour avec succès");
        } catch (error) {
            console.error("Erreur lors de la mise à jour:", error);
            message.error("Erreur lors de la mise à jour");
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user) {
            message.error("Veuillez vous connecter");
            return;
        }

        const formData = new FormData(e.target);
        const currentPassword = formData.get('currentPassword');
        const newPassword = formData.get('newPassword');
        const confirmPassword = formData.get('confirmPassword');

        if (newPassword !== confirmPassword) {
            message.error("Les mots de passe ne correspondent pas");
            return;
        }

        try {
            // Réauthentifier l'utilisateur
            const credential = EmailAuthProvider.credential(
                user.email,
                currentPassword
            );
            await reauthenticateWithCredential(user, credential);

            // Mettre à jour le mot de passe
            await updatePassword(user, newPassword);
            message.success("Mot de passe mis à jour avec succès");
            e.target.reset();
        } catch (error) {
            console.error("Erreur lors de la mise à jour du mot de passe:", error);
            if (error.code === 'auth/wrong-password') {
                message.error("Mot de passe actuel incorrect");
            } else {
                message.error("Erreur lors de la mise à jour du mot de passe");
            }
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user) return;

        const formData = new FormData(e.target);
        const newAddress = {
            id: Date.now().toString(),
            type: formData.get('type'),
            street: formData.get('street'),
            postalCode: formData.get('postalCode'),
            city: formData.get('city'),
            country: formData.get('country')
        };

        try {
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);
            
            if (userDoc.exists()) {
                const currentAddresses = userDoc.data().addresses || [];
                await updateDoc(userRef, {
                    addresses: [...currentAddresses, newAddress]
                });

                setUserInfo(prev => ({
                    ...prev,
                    addresses: [...(prev.addresses || []), newAddress]
                }));

                message.success("Adresse ajoutée avec succès");
                setIsAddressModalOpen(false);
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'adresse:", error);
            message.error("Erreur lors de l'ajout de l'adresse");
        }
    };

    const handleEditAddress = async (updatedAddress) => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);
            
            if (userDoc.exists()) {
                const currentAddresses = userDoc.data().addresses || [];
                const updatedAddresses = currentAddresses.map(addr => 
                    addr.id === updatedAddress.id ? updatedAddress : addr
                );

                await updateDoc(userRef, {
                    addresses: updatedAddresses
                });

                setUserInfo(prev => ({
                    ...prev,
                    addresses: updatedAddresses
                }));

                message.success("Adresse mise à jour avec succès");
                setIsEditModalOpen(false);
            }
        } catch (error) {
            console.error("Erreur lors de la modification de l'adresse:", error);
            message.error("Erreur lors de la modification de l'adresse");
        }
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        await handleUpdateProfile(profileFormData);
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
                            name="type"
                            type="text"
                            placeholder="Principal, Secondaire, etc."
                            defaultValue={address?.type}
                            className="w-full px-4 py-2 rounded-lg border border-[#8B5E34] focus:outline-none focus:ring-2 focus:ring-[#8B5E34] bg-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#4A2B0F] mb-1">Rue</label>
                        <input
                            name="street"
                            type="text"
                            defaultValue={address?.street}
                            className="w-full px-4 py-2 rounded-lg border border-[#8B5E34] focus:outline-none focus:ring-2 focus:ring-[#8B5E34] bg-white"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[#4A2B0F] mb-1">Code postal</label>
                            <input
                                name="postalCode"
                                type="text"
                                defaultValue={address?.postalCode}
                                className="w-full px-4 py-2 rounded-lg border border-[#8B5E34] focus:outline-none focus:ring-2 focus:ring-[#8B5E34] bg-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#4A2B0F] mb-1">Ville</label>
                            <input
                                name="city"
                                type="text"
                                defaultValue={address?.city}
                                className="w-full px-4 py-2 rounded-lg border border-[#8B5E34] focus:outline-none focus:ring-2 focus:ring-[#8B5E34] bg-white"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#4A2B0F] mb-1">Pays</label>
                        <input
                            name="country"
                            type="text"
                            defaultValue={address?.country}
                            className="w-full px-4 py-2 rounded-lg border border-[#8B5E34] focus:outline-none focus:ring-2 focus:ring-[#8B5E34] bg-white"
                            required
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
                    <h2 className="text-xl font-medium text-[#4A2B0F]">
                        {`${profileFormData.firstName} ${profileFormData.lastName}`}
                    </h2>
                    <p className="text-[#8B5E34]">{profileFormData.email}</p>
                </div>
            </div>

            <form className="grid md:grid-cols-2 gap-6" onSubmit={handleProfileSubmit}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#4A2B0F] mb-1">Prénom</label>
                        <input
                            type="text"
                            name="firstName"
                            value={profileFormData.firstName}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-2 rounded-lg border border-[#8B5E34] focus:outline-none focus:ring-2 focus:ring-[#8B5E34] bg-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#4A2B0F] mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={profileFormData.email}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-2 rounded-lg border border-[#8B5E34] focus:outline-none focus:ring-2 focus:ring-[#8B5E34] bg-white"
                        />
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#4A2B0F] mb-1">Nom</label>
                        <input
                            type="text"
                            name="lastName"
                            value={profileFormData.lastName}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-2 rounded-lg border border-[#8B5E34] focus:outline-none focus:ring-2 focus:ring-[#8B5E34] bg-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#4A2B0F] mb-1">Téléphone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={profileFormData.phone}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-2 rounded-lg border border-[#8B5E34] focus:outline-none focus:ring-2 focus:ring-[#8B5E34] bg-white"
                        />
                    </div>
                </div>
                <div className="md:col-span-2 flex justify-end pt-6">
                    <button 
                        type="submit"
                        className="px-6 py-2 bg-[#8B5E34] text-white rounded-full hover:bg-[#4A2B0F] transition-colors"
                    >
                        Sauvegarder les modifications
                    </button>
                </div>
            </form>
        </div>
    );

    const renderSecuritySection = () => (
        <div className="space-y-6">
            <h2 className="text-xl font-medium text-[#4A2B0F] mb-6">Sécurité</h2>
            <form className="space-y-6" onSubmit={handlePasswordUpdate}>
                <div>
                    <label className="block text-sm font-medium text-[#4A2B0F] mb-1">Mot de passe actuel</label>
                    <input
                        type="password"
                        name="currentPassword"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-[#8B5E34] focus:outline-none focus:ring-2 focus:ring-[#8B5E34] bg-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#4A2B0F] mb-1">Nouveau mot de passe</label>
                    <input
                        type="password"
                        name="newPassword"
                        required
                        minLength={6}
                        className="w-full px-4 py-2 rounded-lg border border-[#8B5E34] focus:outline-none focus:ring-2 focus:ring-[#8B5E34] bg-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#4A2B0F] mb-1">Confirmer le nouveau mot de passe</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        required
                        minLength={6}
                        className="w-full px-4 py-2 rounded-lg border border-[#8B5E34] focus:outline-none focus:ring-2 focus:ring-[#8B5E34] bg-white"
                    />
                </div>
                <div className="flex justify-end">
                    <button 
                        type="submit"
                        className="px-6 py-2 bg-[#8B5E34] text-white rounded-full hover:bg-[#4A2B0F] transition-colors"
                    >
                        Mettre à jour le mot de passe
                    </button>
                </div>
            </form>
        </div>
    );

    const renderAddressesSection = () => (
        <div className="space-y-6">
            <h2 className="text-xl font-medium text-[#4A2B0F] mb-6">Adresses de livraison</h2>
            {userInfo?.addresses?.length > 0 ? (
                userInfo.addresses.map((address) => (
                    <div key={address.id} className="bg-[#fff5e6] p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-medium text-[#4A2B0F]">{address.type}</span>
                            <button 
                                onClick={() => {
                                    setEditingAddress(address);
                                    setIsEditModalOpen(true);
                                }}
                                className="text-[#8B5E34] hover:text-[#4A2B0F]"
                            >
                                Modifier
                            </button>
                        </div>
                        <p className="text-[#4A2B0F]">{address.street}</p>
                        <p className="text-[#4A2B0F]">{`${address.postalCode} ${address.city}`}</p>
                        <p className="text-[#4A2B0F]">{address.country}</p>
                    </div>
                ))
            ) : (
                <div className="text-center py-8 bg-[#fff5e6] rounded-lg">
                    <p className="text-[#8B5E34]">Aucune adresse enregistrée</p>
                </div>
            )}
            
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
                        const formData = new FormData(e.target);
                        const updatedAddress = {
                            ...editingAddress,
                            type: formData.get('type'),
                            street: formData.get('street'),
                            postalCode: formData.get('postalCode'),
                            city: formData.get('city'),
                            country: formData.get('country')
                        };
                        handleEditAddress(updatedAddress);
                    }}
                    onCancel={() => setIsEditModalOpen(false)}
                />
            )}

            {isAddressModalOpen && (
                <AddressForm 
                    address={newAddress}
                    onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const newAddress = {
                            type: formData.get('type'),
                            street: formData.get('street'),
                            postalCode: formData.get('postalCode'),
                            city: formData.get('city'),
                            country: formData.get('country')
                        };
                        handleAddAddress(e);
                    }}
                    onCancel={() => setIsAddressModalOpen(false)}
                    isNew
                />
            )}
        </div>
    );

    const renderNotificationsSection = () => {
        // Valeurs par défaut pour les notifications si elles n'existent pas
        const defaultNotifications = {
            orders: false,
            promotions: false,
            newsletter: false
        };

        // Utiliser les notifications de l'utilisateur ou les valeurs par défaut
        const notifications = userInfo?.notifications || defaultNotifications;

        const handleNotificationChange = async (key, value) => {
            const user = auth.currentUser;
            if (!user) return;

            try {
                const userRef = doc(db, 'users', user.uid);
                const updatedNotifications = {
                    ...notifications,
                    [key]: value
                };

                await updateDoc(userRef, {
                    notifications: updatedNotifications
                });

                setUserInfo(prev => ({
                    ...prev,
                    notifications: updatedNotifications
                }));

                message.success("Préférences mises à jour");
            } catch (error) {
                console.error("Erreur lors de la mise à jour des préférences:", error);
                message.error("Erreur lors de la mise à jour");
            }
        };

        return (
            <div className="space-y-6">
                <h2 className="text-xl font-medium text-[#4A2B0F] mb-6">Préférences de notifications</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-[#4A2B0F] font-medium">Commandes</h3>
                            <p className="text-sm text-[#8B5E34]">Notifications sur l'état de vos commandes</p>
                        </div>
                        <input 
                            type="checkbox" 
                            checked={notifications.orders}
                            onChange={(e) => handleNotificationChange('orders', e.target.checked)}
                            className="rounded text-[#8B5E34]" 
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-[#4A2B0F] font-medium">Promotions</h3>
                            <p className="text-sm text-[#8B5E34]">Offres spéciales et réductions</p>
                        </div>
                        <input 
                            type="checkbox" 
                            checked={notifications.promotions}
                            onChange={(e) => handleNotificationChange('promotions', e.target.checked)}
                            className="rounded text-[#8B5E34]" 
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-[#4A2B0F] font-medium">Newsletter</h3>
                            <p className="text-sm text-[#8B5E34]">Actualités et nouveaux produits</p>
                        </div>
                        <input 
                            type="checkbox" 
                            checked={notifications.newsletter}
                            onChange={(e) => handleNotificationChange('newsletter', e.target.checked)}
                            className="rounded text-[#8B5E34]" 
                        />
                    </div>
                </div>
            </div>
        );
    };

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

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#fff5e6]">
                <h2 className="text-xl font-medium text-[#4A2B0F] mb-4">
                    Connexion requise
                </h2>
                <p className="text-[#8B5E34] mb-6">
                    Veuillez vous connecter pour accéder à vos paramètres
                </p>
                <button
                    onClick={() => navigate('/login')}
                    className="px-6 py-2 bg-[#8B5E34] text-white rounded-full hover:bg-[#4A2B0F] transition-colors"
                >
                    Se connecter
                </button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#fff5e6]">
                <div className="w-16 h-16 border-4 border-[#8B5E34] border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-[#4A2B0F]">Chargement de vos paramètres...</p>
            </div>
        );
    }

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