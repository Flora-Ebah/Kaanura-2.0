import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Tabs, message, Switch } from 'antd';
import { 
    ShopOutlined, 
    UserOutlined,
    GlobalOutlined,
} from '@ant-design/icons';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import { auth, db } from '../../config/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';

const AdminSettings = () => {
    const [form] = Form.useForm();
    const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('general');

    // Récupérer les informations de l'admin et de la boutique
    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    // Récupérer les données de l'admin
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists() && userDoc.data().type_user === 'admin') {
                        setAdminData(userDoc.data());
                    }

                    // Récupérer les données de la boutique
                    const shopDoc = await getDoc(doc(db, 'shop', 'info'));
                    if (shopDoc.exists()) {
                        form.setFieldsValue({
                            storeName: shopDoc.data().name,
                            description: shopDoc.data().description,
                            email: shopDoc.data().email,
                            emailPassword: shopDoc.data().emailPassword,
                            mainPhone: shopDoc.data().mainPhone,
                            secondaryPhone: shopDoc.data().secondaryPhone
                        });
                    }
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des données:", error);
                message.error("Erreur lors du chargement des données");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [form]);

    const handleSubmit = async (values) => {
        try {
            const user = auth.currentUser;
            if (!user) {
                message.error("Vous devez être connecté");
                return;
            }

            // Gestion des modifications selon l'onglet actif
            if (activeTab === 'general') {
                // Mise à jour des informations de la boutique uniquement
                await setDoc(doc(db, 'shop', 'info'), {
                    name: values.storeName,
                    description: values.description,
                    email: values.email,
                    emailPassword: values.emailPassword,
                    mainPhone: values.mainPhone,
                    secondaryPhone: values.secondaryPhone || null,
                    updatedAt: new Date().toISOString(),
                    updatedBy: user.uid
                }, { merge: true });
                
                message.success('Informations de la boutique mises à jour avec succès');
            } 
            else if (activeTab === 'security') {
                // Gestion du mot de passe et 2FA uniquement
                if (values.currentPassword && values.newPassword) {
                    try {
                        const credential = EmailAuthProvider.credential(
                            user.email,
                            values.currentPassword
                        );
                        
                        await reauthenticateWithCredential(user, credential);
                        await updatePassword(user, values.newPassword);

                        if (values.twoFactor !== undefined) {
                            await updateDoc(doc(db, 'users', user.uid), {
                                twoFactor: values.twoFactor
                            });
                        }

                        message.success('Paramètres de sécurité mis à jour avec succès');
                        
                        // Réinitialiser uniquement les champs de mot de passe
                        form.setFieldsValue({
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                        });
                    } catch (error) {
                        if (error.code === 'auth/wrong-password') {
                            message.error('Le mot de passe actuel est incorrect');
                        } else {
                            throw error;
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour:", error);
            message.error("Erreur lors de la mise à jour des paramètres");
        }
    };

    const items = [
        {
            key: 'general',
            label: (
                <span className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                    <ShopOutlined />
                    Général
                </span>
            ),
            children: (
                <div className="space-y-4 sm:space-y-6">
                    <Card title={<span className="text-base sm:text-lg">Informations de la boutique</span>} className="shadow-sm">
                        <Form.Item name="storeName" label={<span className="text-sm sm:text-base">Nom de la boutique</span>}>
                            <Input placeholder="Ma Boutique" className="text-sm sm:text-base" />
                        </Form.Item>
                        <Form.Item name="description" label={<span className="text-sm sm:text-base">Description</span>}>
                            <Input.TextArea rows={4} placeholder="Description de votre boutique" className="text-sm sm:text-base" />
                        </Form.Item>
                        <Form.Item name="email" label={<span className="text-sm sm:text-base">Email de contact</span>}>
                            <Input placeholder="contact@maboutique.com" type="email" className="text-sm sm:text-base" />
                        </Form.Item>
                        <Form.Item 
                            name="emailPassword" 
                            label={<span className="text-sm sm:text-base">Mot de passe de l'email</span>}
                            rules={[{ required: true, message: 'Le mot de passe de l\'email est requis' }]}
                        >
                            <Input.Password className="text-sm sm:text-base" placeholder="Mot de passe de l'email" />
                        </Form.Item>
                        <Form.Item name="mainPhone" label={<span className="text-sm sm:text-base">Numéro de téléphone principal</span>}>
                            <Input placeholder="+221 XX XXX XX XX" className="text-sm sm:text-base" />
                        </Form.Item>
                        <Form.Item name="secondaryPhone" label={<span className="text-sm sm:text-base">Numéro de téléphone secondaire (optionnel)</span>}>
                            <Input placeholder="+221 XX XXX XX XX" className="text-sm sm:text-base" />
                        </Form.Item>
                    </Card>
                </div>
            )
        },
        {
            key: 'security',
            label: (
                <span className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                    <UserOutlined />
                    Sécurité
                </span>
            ),
            children: (
                <Card title={<span className="text-base sm:text-lg">Paramètres de sécurité</span>} className="shadow-sm">
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-[#fff5e6] rounded-lg">
                        <h3 className="text-base sm:text-lg font-medium text-[#4A2B0F] mb-2">Informations administrateur</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <p className="text-xs sm:text-sm text-[#8B5E34]">Nom</p>
                                <p className="text-sm sm:text-base font-medium">{adminData?.lastName || '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs sm:text-sm text-[#8B5E34]">Prénom</p>
                                <p className="text-sm sm:text-base font-medium">{adminData?.firstName || '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs sm:text-sm text-[#8B5E34]">Email</p>
                                <p className="text-sm sm:text-base font-medium">{adminData?.email || '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs sm:text-sm text-[#8B5E34]">Type de compte</p>
                                <p className="text-sm sm:text-base font-medium">Administrateur</p>
                            </div>
                        </div>
                    </div>

                    <Form.Item name="twoFactor" label={<span className="text-sm sm:text-base">Authentification à deux facteurs</span>}>
                        <Switch defaultChecked={adminData?.twoFactor} />
                    </Form.Item>

                    <Form.Item 
                        name="currentPassword" 
                        label={<span className="text-sm sm:text-base">Mot de passe actuel</span>}
                        rules={[{ required: true, message: 'Veuillez entrer votre mot de passe actuel' }]}
                    >
                        <Input.Password className="text-sm sm:text-base" />
                    </Form.Item>

                    <Form.Item 
                        name="newPassword" 
                        label={<span className="text-sm sm:text-base">Nouveau mot de passe</span>}
                        rules={[{ required: true, message: 'Veuillez entrer le nouveau mot de passe' }]}
                    >
                        <Input.Password className="text-sm sm:text-base" />
                    </Form.Item>

                    <Form.Item 
                        name="confirmPassword" 
                        label={<span className="text-sm sm:text-base">Confirmer le mot de passe</span>}
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: 'Veuillez confirmer le mot de passe' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Les mots de passe ne correspondent pas'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password className="text-sm sm:text-base" />
                    </Form.Item>
                </Card>
            )
        }
    ];

    return (
        <AdminLayout loading={loading}>
            <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6">
                <div className="mb-4 sm:mb-6 md:mb-8">
                    <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">Paramètres</h1>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1">Configurez les paramètres de votre boutique</p>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="max-w-[1000px]"
                >
                    <Tabs
                        defaultActiveKey="general"
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        items={items}
                        className="settings-tabs text-sm sm:text-base"
                        type="card"
                    />

                    <div className="flex justify-end mt-4 sm:mt-6">
                        <Button 
                            type="primary"
                            htmlType="submit"
                            style={{ 
                                backgroundColor: '#8B5E34',
                                borderColor: '#8B5E34'
                            }}
                            className="px-4 sm:px-8 text-sm sm:text-base"
                        >
                            Enregistrer les modifications
                        </Button>
                    </div>
                </Form>
            </div>
        </AdminLayout>
    );
};

export default AdminSettings; 