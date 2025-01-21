import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import { CartProvider } from './context/CartContext';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Settings from './pages/Settings';
import Header from './components/Header';
import Dashboard from './pages/Admin/Dashboard';
import Products from './pages/Admin/Products';
import OrdersAdmin from './pages/Admin/Orders';
import Customers from './pages/Admin/Customers';
import AdminSettings from './pages/Admin/Settings';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

const App = () => {
    return (
        <CartProvider>
            <Router> 
                <Routes>
                    {/* Routes Admin */}
                    <Route path="/admin/*" element={
                        <div style={{ backgroundColor: '#fff5e6'}}>
                            <Routes>
                                <Route index element={<Dashboard />} />
                                <Route path="products" element={<Products />} />
                                <Route path="orders" element={<OrdersAdmin />} />
                                <Route path="customers" element={<Customers />} />
                                {/* Autres routes admin ici */}
                            </Routes>
                        </div>
                    } />

                    {/* Routes d'authentification indépendantes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/sign-up" element={<SignUp />} />

                    {/* Routes Client avec Header */}
                    <Route path="/*" element={
                        <div style={{ backgroundColor: '#fff5e6'}}>
                            <Header />
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/cart" element={<Cart />} />
                                <Route path="/orders" element={<Orders />} />
                                <Route path="/settings" element={<Settings />} />
                            </Routes>
                        </div>
                    } />

                    {/* Route admin settings */}
                    <Route path="/admin/settings" element={<AdminSettings />} />
                </Routes>
            </Router>
        </CartProvider>
    );
};

export default App;
