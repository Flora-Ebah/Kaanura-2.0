import React from 'react';
import { Card, Form, Input, Switch, Select, Button, Tabs, Divider, Upload, message } from 'antd';
import { 
    ShopOutlined, 
    MailOutlined, 
    BellOutlined, 
    SecurityScanOutlined,
    UploadOutlined,
    UserOutlined,
    GlobalOutlined,
    CreditCardOutlined
} from '@ant-design/icons';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';

const AdminSettings = () => {
    const [form] = Form.useForm();

    const handleSubmit = (values) => {
        console.log(values);
        message.success('Paramètres mis à jour avec succès');
    };

    const items = [
        {
            key: 'general',
            label: (
                <span className="flex items-center gap-2">
                    <ShopOutlined />
                    Général
                </span>
            ),
            children: (
                <div className="space-y-6">
                    <Card title="Informations de la boutique" className="shadow-sm">
                        <Form.Item name="storeName" label="Nom de la boutique">
                            <Input placeholder="Ma Boutique" />
                        </Form.Item>
                        <Form.Item name="description" label="Description">
                            <Input.TextArea rows={4} placeholder="Description de votre boutique" />
                        </Form.Item>
                        <Form.Item name="logo" label="Logo">
                            <Upload maxCount={1}>
                                <Button icon={<UploadOutlined />}>Choisir un fichier</Button>
                            </Upload>
                        </Form.Item>
                    </Card>

                    <Card title="Localisation" className="shadow-sm">
                        <Form.Item name="timezone" label="Fuseau horaire">
                            <Select
                                options={[
                                    { value: 'europe_paris', label: 'Europe/Paris' },
                                    { value: 'europe_london', label: 'Europe/London' }
                                ]}
                            />
                        </Form.Item>
                        <Form.Item name="currency" label="Devise">
                            <Select
                                options={[
                                    { value: 'eur', label: 'EUR (€)' },
                                    { value: 'usd', label: 'USD ($)' }
                                ]}
                            />
                        </Form.Item>
                    </Card>
                </div>
            )
        },
        {
            key: 'notifications',
            label: (
                <span className="flex items-center gap-2">
                    <BellOutlined />
                    Notifications
                </span>
            ),
            children: (
                <Card title="Préférences de notification" className="shadow-sm">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-medium">Nouvelles commandes</h3>
                                <p className="text-gray-500 text-sm">Recevoir une notification pour chaque nouvelle commande</p>
                            </div>
                            <Form.Item name="orderNotifications" valuePropName="checked" noStyle>
                                <Switch />
                            </Form.Item>
                        </div>
                        <Divider />
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-medium">Stock faible</h3>
                                <p className="text-gray-500 text-sm">Être averti quand un produit est presque en rupture</p>
                            </div>
                            <Form.Item name="stockNotifications" valuePropName="checked" noStyle>
                                <Switch />
                            </Form.Item>
                        </div>
                        <Divider />
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-medium">Nouveaux clients</h3>
                                <p className="text-gray-500 text-sm">Notification lors de l'inscription d'un nouveau client</p>
                            </div>
                            <Form.Item name="customerNotifications" valuePropName="checked" noStyle>
                                <Switch />
                            </Form.Item>
                        </div>
                    </div>
                </Card>
            )
        },
        {
            key: 'payment',
            label: (
                <span className="flex items-center gap-2">
                    <CreditCardOutlined />
                    Paiement
                </span>
            ),
            children: (
                <Card title="Méthodes de paiement" className="shadow-sm">
                    <Form.Item name="paymentMethods" label="Méthodes acceptées">
                        <Select
                            mode="multiple"
                            placeholder="Sélectionnez les méthodes de paiement"
                            options={[
                                { value: 'card', label: 'Carte bancaire' },
                                { value: 'paypal', label: 'PayPal' },
                                { value: 'bank_transfer', label: 'Virement bancaire' }
                            ]}
                        />
                    </Form.Item>
                    <Form.Item name="testMode" label="Mode test">
                        <Switch />
                    </Form.Item>
                </Card>
            )
        },
        {
            key: 'security',
            label: (
                <span className="flex items-center gap-2">
                    <SecurityScanOutlined />
                    Sécurité
                </span>
            ),
            children: (
                <Card title="Paramètres de sécurité" className="shadow-sm">
                    <Form.Item name="twoFactor" label="Authentification à deux facteurs">
                        <Switch />
                    </Form.Item>
                    <Form.Item name="password" label="Changer le mot de passe">
                        <Input.Password />
                    </Form.Item>
                    <Form.Item name="passwordConfirm" label="Confirmer le mot de passe">
                        <Input.Password />
                    </Form.Item>
                </Card>
            )
        }
    ];

    return (
        <AdminLayout>
            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                {/* En-tête de page */}
                <div className="mb-6 md:mb-8">
                    <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Paramètres</h1>
                    <p className="text-sm md:text-base text-gray-600 mt-1">Configurez les paramètres de votre boutique</p>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="max-w-[1000px]"
                >
                    <Tabs
                        defaultActiveKey="general"
                        items={items}
                        className="settings-tabs"
                        type="card"
                    />

                    <div className="flex justify-end mt-6">
                        <Button 
                            type="primary"
                            htmlType="submit"
                            style={{ 
                                backgroundColor: '#8B5E34',
                                borderColor: '#8B5E34'
                            }}
                            className="px-8"
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