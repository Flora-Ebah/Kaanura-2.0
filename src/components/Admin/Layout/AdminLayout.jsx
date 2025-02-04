import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DashboardOutlined,
    ShoppingOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    SettingOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { message } from 'antd';
import { auth } from '../../../config/firebase';
import { signOut } from 'firebase/auth';
import Loader from '../Loader';

const AdminLayout = ({ children, loading }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Fonction de déconnexion
    const handleLogout = async () => {
        try {
            await signOut(auth);
            message.success('Déconnexion réussie');
            navigate('/login');
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
            message.error('Erreur lors de la déconnexion');
        }
    };

    // Détecter la taille de l'écran et mettre à jour l'état
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1024); // lg breakpoint
            setCollapsed(window.innerWidth < 1024);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const menuItems = [
        {
            key: '/admin',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
            path: '/admin'
        },
        {
            key: '/admin/products',
            icon: <ShoppingOutlined />,
            label: 'Produits',
            path: '/admin/products'
        },
        {
            key: '/admin/orders',
            icon: <ShoppingCartOutlined />,
            label: 'Commandes',
            path: '/admin/orders'
        },
        {
            key: '/admin/customers',
            icon: <UserOutlined />,
            label: 'Clients',
            path: '/admin/customers'
        },
        {
            key: '/admin/settings',
            icon: <SettingOutlined />,
            label: 'Paramètres',
            path: '/admin/settings'
        }
    ];

    return (
        <div className="relative min-h-screen">
            {loading && <Loader />}
            <div className="flex h-screen bg-[#fff5e6]">
                {/* Overlay pour mobile */}
                {!collapsed && isMobile && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-20"
                        onClick={() => setCollapsed(true)}
                    />
                )}

                {/* Sidebar */}
                <div 
                    className={`fixed lg:relative bg-white h-full shadow-sm transition-all duration-300 z-30 flex flex-col justify-between
                        ${collapsed && isMobile ? '-translate-x-full w-0' : ''} 
                        ${collapsed && !isMobile ? 'w-20' : 'w-64'}`}
                >
                    {/* En-tête du sidebar */}
                    <div>
                        <div className={`flex items-center justify-between p-4 border-b ${collapsed && isMobile ? 'hidden' : ''}`}>
                            {/* Sur desktop: toujours montrer le bouton, mais le titre seulement quand c'est déplié */}
                            {!isMobile ? (
                                <>
                                    {!collapsed && <h1 className="text-xl font-medium text-[#4A2B0F]">Admin</h1>}
                                    <button 
                                        onClick={() => setCollapsed(!collapsed)}
                                        className="p-2 rounded-lg hover:bg-[#fff5e6] text-[#4A2B0F]"
                                    >
                                        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                    </button>
                                </>
                            ) : (
                                // Sur mobile: montrer le titre et le bouton de fermeture
                                <>
                                    <h1 className="text-xl font-medium text-[#4A2B0F]">Admin</h1>
                                    <button 
                                        onClick={() => setCollapsed(true)}
                                        className="p-2 rounded-lg hover:bg-[#fff5e6] text-[#4A2B0F]"
                                    >
                                        <MenuFoldOutlined />
                                    </button>
                                </>
                            )}
                        </div>
                        <nav className={`p-4 ${collapsed && isMobile ? 'hidden' : ''}`}>
                            {menuItems.map((item) => (
                                <Link
                                    key={item.key}
                                    to={item.path}
                                    className={`flex items-center gap-3 p-3 rounded-lg mb-2 transition-colors ${
                                        location.pathname === item.path
                                            ? 'bg-[#8B5E34] text-white'
                                            : 'text-[#4A2B0F] hover:bg-[#fff5e6]'
                                    }`}
                                    onClick={() => isMobile && setCollapsed(true)}
                                >
                                    {item.icon}
                                    {(!collapsed || isMobile) && <span>{item.label}</span>}
                                </Link>
                            ))}
                            <button 
                                onClick={handleLogout}
                                className="flex items-center gap-3 p-3 rounded-lg w-full mt-8 text-[#4A2B0F] hover:bg-[#fff5e6]"
                            >
                                <LogoutOutlined />
                                {(!collapsed || isMobile) && <span>Déconnexion</span>}
                            </button>
                        </nav>
                    </div>

                    {/* Logo en pied de page */}
                    <div className={`p-4 border-t ${collapsed && isMobile ? 'hidden' : ''}`}>
                        <Link 
                            to="/" 
                            className="flex items-center justify-center hover:opacity-80 transition-opacity"
                        >
                            <img 
                                src="/logo.png" 
                                alt="KAANURA" 
                                className={`${collapsed && !isMobile ? 'w-12 h-12' : 'w-24 h-24'} object-contain`}
                            />
                        </Link>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-auto w-full">
                    {/* Header mobile */}
                    <div className="lg:hidden flex items-center p-4 bg-white shadow-sm">
                        <button 
                            onClick={() => setCollapsed(false)}
                            className="p-2 rounded-lg hover:bg-[#fff5e6] text-[#4A2B0F]"
                        >
                            <MenuUnfoldOutlined />
                        </button>
                        <h1 className="ml-4 text-lg font-medium text-[#4A2B0F]">Admin</h1>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AdminLayout; 