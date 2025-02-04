import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    UserOutlined, 
    MenuOutlined, 
    ShoppingCartOutlined, 
    CloseOutlined,
    HomeOutlined,
    ShoppingOutlined,
    ContactsOutlined,
    CheckCircleFilled,
    StarOutlined,
    HistoryOutlined,
    SettingOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { Drawer, Dropdown, message } from 'antd';
import { useCart } from '../context/CartContext';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { cartCount } = useCart();
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Écouter l'état de l'authentification
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            message.success("Déconnexion réussie");
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
            message.error("Erreur lors de la déconnexion");
        }
    };

    const userMenuItems = user ? [
        {
            key: '1',
            label: 'Vos commandes',
            icon: <HistoryOutlined />,
            onClick: () => navigate('/orders')
        },
        {
            key: '2',
            label: 'Paramètres',
            icon: <SettingOutlined />,
            onClick: () => navigate('/settings')
        },
        {
            type: 'divider'
        },
        {
            key: '3',
            label: 'Déconnexion',
            icon: <LogoutOutlined />,
            onClick: handleLogout
        }
    ] : [
        {
            key: '1',
            label: 'Connexion',
            icon: <UserOutlined />,
            onClick: () => navigate('/login')
        }
    ];

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const scrollToSection = (e, id) => {
        // Empêcher le comportement par défaut du lien
        e.preventDefault();
        
        const goToSection = () => {
            const section = document.getElementById(id);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        };

        if (window.location.pathname !== '/') {
            navigate('/', { replace: true });
            // Utiliser un écouteur d'événements pour détecter quand la navigation est terminée
            const checkAndScroll = setInterval(() => {
                if (window.location.pathname === '/') {
                    clearInterval(checkAndScroll);
                    // Attendre un peu que le DOM soit mis à jour
                    setTimeout(goToSection, 100);
                }
            }, 100);
        } else {
            goToSection();
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#fff4de]/40 backdrop-blur-sm shadow-sm">
            <nav className="flex items-center justify-between p-4 mx-4 sm:mx-4 md:mx-12 md:mr-12 lg:mr-24 font-poppins">
                <div className="flex items-center space-x-6">
                    <button onClick={toggleMenu} className="lg:hidden">
                        <MenuOutlined className="text-xl" />
                    </button>
                    <Link to="/">
                        <img src="/logo.png" alt="Logo" className="w-25 h-12 md:w-30 md:h-16" />
                    </Link>
                </div>
                <div className={`flex-grow flex justify-center hidden lg:flex`}>
                    <ul className="flex items-center space-x-10">
                        <li><Link to="/" className="text-[#4a2b0f] dark:text-white hover:text-[#795f45]">Accueil</Link></li>
                        <li>
                            <Link 
                                to="#" 
                                onClick={(e) => scrollToSection(e, 'nos-produits')} 
                                className="text-[#4a2b0f] dark:text-white hover:text-[#795f45]"
                            >
                                Nos Produits
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="#" 
                                onClick={(e) => scrollToSection(e, 'contact')} 
                                className="text-[#4a2b0f] dark:text-white hover:text-[#795f45]"
                            >
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="flex items-center space-x-10">
                    <Dropdown 
                        menu={{ items: userMenuItems }} 
                        placement="bottomRight"
                        trigger={['click']}
                        overlayClassName="user-dropdown"
                    >
                        <button className="text-[#4a2b0f] dark:text-white hover:text-[#795f45] text-lg relative">
                            <UserOutlined className="text-xl" />
                            {user && (
                                <CheckCircleFilled className="text-green-500 text-sm absolute -top-1 -right-2" />
                            )}
                        </button>
                    </Dropdown>
                    <button 
                        onClick={() => navigate('/cart')}
                        className="relative text-[#4a2b0f] dark:text-white hover:text-[#795f45] text-lg"
                    >
                        <ShoppingCartOutlined className="text-xl" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-2 bg-[#795f45] text-white text-xs rounded-full px-1">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </nav>

            {/* Drawer Menu */}
            <Drawer
                title={null}
                placement="left"
                closable={false}
                onClose={toggleMenu}
                open={isMenuOpen}
                width={300}
                className="custom-drawer"
                styles={{
                    mask: {
                        background: 'rgba(0, 0, 0, 0.2)',
                        backdropFilter: 'blur(8px)',
                    },
                    wrapper: {
                        background: 'transparent',
                    },
                    content: {
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(12px)',
                    }
                }}
            >
                <div className="h-full flex flex-col">
                    <div className="flex justify-end mb-6">
                        <button 
                            onClick={toggleMenu}
                            className="p-2 rounded-full hover:bg-[#795f45]/10 transition-colors"
                        >
                            <CloseOutlined className="text-xl text-[#4a2b0f]" />
                        </button>
                    </div>
                    <ul className="flex flex-col space-y-6 px-4">
                        <li>
                            <Link 
                                to="/" 
                                className="text-[#4a2b0f] text-lg font-medium hover:text-[#795f45] transition-colors flex items-center gap-3"
                                onClick={toggleMenu}
                            >
                                <HomeOutlined className="text-xl" />
                                Accueil
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="#" 
                                onClick={(e) => {
                                    scrollToSection(e, 'nos-produits');
                                    toggleMenu();
                                }}
                                className="text-[#4a2b0f] text-lg font-medium hover:text-[#795f45] transition-colors flex items-center gap-3"
                            >
                                <ShoppingOutlined className="text-xl" />
                                Nos Produits
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="#" 
                                onClick={(e) => {
                                    scrollToSection(e, 'contact');
                                    toggleMenu();
                                }}
                                className="text-[#4a2b0f] text-lg font-medium hover:text-[#795f45] transition-colors flex items-center gap-3"
                            >
                                <ContactsOutlined className="text-xl" />
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>
            </Drawer>
        </header>
    );
};

export default Header; 