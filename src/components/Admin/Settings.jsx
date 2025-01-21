import React from 'react';
import { Card, Form, Input, Switch, Select, Button, Tabs, Divider, Upload, message } from 'antd';
import { 
    ShopOutlined, 
    BellOutlined, 
    SecurityScanOutlined,
    UploadOutlined,
    CreditCardOutlined,
    CloudUploadOutlined,
    EuroCircleOutlined,
    GlobalOutlined
} from '@ant-design/icons';
import AdminLayout from './Layout/AdminLayout';

const Settings = () => {
    const [form] = Form.useForm();

    const handleSubmit = (values) => {
        console.log(values);
        message.success('Paramètres mis à jour avec succès');
    };

    const items = [
        {
            key: 'general',
            label: (
                <span className="flex items-center gap-2 px-1">
                    <ShopOutlined />
                    Général
                </span>
            ),
            children: (
                <div className="space-y-6 max-w-3xl">
                    <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">Informations de la boutique</h3>
                            <p className="text-gray-500 text-sm">Configurez les informations principales de votre boutique</p>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                    <Form.Item name="storeName" label="Nom de la boutique">
                                        <Input 
                                            placeholder="Ma Boutique" 
                                            className="rounded-lg"
                                        />
                                    </Form.Item>
                                    <Form.Item name="description" label="Description">
                                        <Input.TextArea 
                                            rows={4} 
                                            placeholder="Description de votre boutique"
                                            className="rounded-lg"
                                        />
                                    </Form.Item>
                                </div>
                                <div className="w-full md:w-48">
                                    <Form.Item 
                                        name="logo" 
                                        label="Logo"
                                        className="text-center"
                                    >
                                        <Upload.Dragger 
                                            maxCount={1}
                                            className="h-48 rounded-xl border-dashed border-2 border-gray-200 hover:border-primary"
                                        >
                                            <p className="text-gray-500">
                                                <CloudUploadOutlined className="text-2xl mb-2" />
                                                <br />
                                                Glissez ou cliquez
                                            </p>
                                        </Upload.Dragger>
                                    </Form.Item>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">Localisation</h3>
                            <p className="text-gray-500 text-sm">Définissez les paramètres régionaux de votre boutique</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <Form.Item 
                                name="timezone" 
                                label={
                                    <span className="flex items-center gap-2">
                                        <GlobalOutlined />
                                        Fuseau horaire
                                    </span>
                                }
                            >
                                <Select
                                    className="rounded-lg"
                                    options={[
                                        { value: 'europe_paris', label: 'Europe/Paris (UTC+1)' },
                                        { value: 'europe_london', label: 'Europe/London (UTC)' }
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item 
                                name="currency" 
                                label={
                                    <span className="flex items-center gap-2">
                                        <EuroCircleOutlined />
                                        Devise
                                    </span>
                                }
                            >
                                <Select
                                    className="rounded-lg"
                                    options={[
                                        { value: 'eur', label: 'Euro (EUR €)' },
                                        { value: 'usd', label: 'Dollar (USD $)' }
                                    ]}
                                />
                            </Form.Item>
                        </div>
                    </Card>
                </div>
            )
        },
        {
            key: 'notifications',
            label: (
                <span className="flex items-center gap-2 px-1">
                    <BellOutlined />
                    Notifications
                </span>
            ),
            children: (
                <Card className="max-w-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">Préférences de notification</h3>
                        <p className="text-gray-500 text-sm">Gérez vos préférences de notifications</p>
                    </div>

                    <div className="space-y-6">
                        {[
                            {
                                title: 'Nouvelles commandes',
                                description: 'Recevoir une notification pour chaque nouvelle commande',
                                name: 'orderNotifications'
                            },
                            {
                                title: 'Stock faible',
                                description: 'Être averti quand un produit est presque en rupture',
                                name: 'stockNotifications'
                            },
                            {
                                title: 'Nouveaux clients',
                                description: 'Notification lors de l\'inscription d\'un nouveau client',
                                name: 'customerNotifications'
                            }
                        ].map((item, index) => (
                            <React.Fragment key={item.name}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-medium text-gray-800">{item.title}</h4>
                                        <p className="text-gray-500 text-sm mt-1">{item.description}</p>
                                    </div>
                                    <Form.Item name={item.name} valuePropName="checked" noStyle>
                                        <Switch className="bg-gray-200" />
                                    </Form.Item>
                                </div>
                                {index < 2 && <Divider className="my-6" />}
                            </React.Fragment>
                        ))}
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
            <div className="p-6 space-y-6 max-w-[1200px]">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Paramètres</h1>
                        <p className="text-gray-600 mt-1">Configurez les paramètres de votre boutique</p>
                    </div>
                    <Button 
                        type="primary"
                        htmlType="submit"
                        onClick={() => form.submit()}
                        className="bg-primary hover:bg-primary-dark px-6 h-10 flex items-center rounded-lg"
                        style={{ backgroundColor: '#8B5E34', borderColor: '#8B5E34' }}
                    >
                        Enregistrer
                    </Button>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Tabs
                        defaultActiveKey="general"
                        items={items}
                        className="settings-tabs"
                        type="card"
                    />
                </Form>

                <style jsx global>{`
                    .settings-tabs .ant-tabs-nav {
                        margin-bottom: 24px;
                    }
                    .settings-tabs .ant-tabs-tab {
                        border-radius: 8px;
                        margin: 0 8px 0 0;
                        padding: 8px 16px;
                        transition: all 0.3s;
                    }
                    .settings-tabs .ant-tabs-tab-active {
                        background-color: #8B5E34 !important;
                        border-color: #8B5E34 !important;
                    }
                    .settings-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
                        color: white !important;
                    }
                    .settings-tabs .ant-form-item-label > label {
                        font-weight: 500;
                    }
                `}</style>
            </div>
        </AdminLayout>
    );
};

export default Settings; 