import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Upload, message, Card, Row, Col, Select, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ShoppingOutlined, DollarOutlined, InboxOutlined, ShoppingCartOutlined, BarChartOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { db, auth } from '../../config/firebase';
import { 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    updateDoc, 
    deleteDoc,
    query,
    where,
    orderBy,
    getDoc
} from 'firebase/firestore';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import { useNavigate } from 'react-router-dom';
import { uploadImage } from '../../config/cloudinary';

const Products = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [form] = Form.useForm();
    const [stats, setStats] = useState([
        {
            title: 'Total Produits',
            value: 0,
            icon: <ShoppingCartOutlined />,
            color: 'text-indigo-600',
            trend: 'Total'
        },
        {
            title: 'Valeur du Stock',
            value: '0.00 €',
            icon: <BarChartOutlined />,
            color: 'text-emerald-600',
            trend: 'Total'
        },
        {
            title: 'Stock Faible',
            value: '0 produits',
            icon: <ExclamationCircleOutlined />,
            color: 'text-rose-600',
            trend: 'À réapprovisionner'
        }
    ]);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fonction pour formater le prix en FCFA
    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
    };

    // Nouvelles fonctions pour calculer les statistiques
    const calculateStockStats = (productsData) => {
        const lowStockThreshold = 10; // Seuil de stock faible
        
        // Calculer la valeur totale du stock
        const totalStockValue = productsData.reduce((total, product) => {
            return total + (product.price * product.stock);
        }, 0);

        // Compter les produits en stock faible
        const lowStockProducts = productsData.filter(product => product.stock <= lowStockThreshold);

        return {
            totalValue: formatPrice(totalStockValue),
            lowStockCount: lowStockProducts.length
        };
    };

    // Charger les produits
    const fetchProducts = async () => {
        setLoading(true);
        try {
            let productsQuery = collection(db, 'products');
            let queries = [];

            // Créer la requête en fonction des filtres et tris
            if (categoryFilter && sortOrder) {
                // Si on a à la fois un filtre de catégorie et un tri
                switch(sortOrder) {
                    case 'price_asc':
                        productsQuery = query(productsQuery,
                            where('category', '==', categoryFilter),
                            orderBy('price', 'asc')
                        );
                        break;
                    case 'price_desc':
                        productsQuery = query(productsQuery,
                            where('category', '==', categoryFilter),
                            orderBy('price', 'desc')
                        );
                        break;
                    case 'stock_low':
                        productsQuery = query(productsQuery,
                            where('category', '==', categoryFilter),
                            orderBy('stock', 'asc')
                        );
                        break;
                    default:
                        productsQuery = query(productsQuery,
                            where('category', '==', categoryFilter)
                        );
                }
            } else {
                // Si on n'a qu'un filtre de catégorie
                if (categoryFilter) {
                    queries.push(where('category', '==', categoryFilter));
                }
                // Si on n'a qu'un tri
                if (sortOrder) {
                    switch(sortOrder) {
                        case 'price_asc':
                            queries.push(orderBy('price', 'asc'));
                            break;
                        case 'price_desc':
                            queries.push(orderBy('price', 'desc'));
                            break;
                        case 'stock_low':
                            queries.push(orderBy('stock', 'asc'));
                            break;
                    }
                }
                if (queries.length > 0) {
                    productsQuery = query(productsQuery, ...queries);
                }
            }

            const querySnapshot = await getDocs(productsQuery);
            const productsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Filtrer par recherche côté client
            const filteredProducts = searchText 
                ? productsData.filter(product => 
                    product.name.toLowerCase().includes(searchText.toLowerCase())
                )
                : productsData;

            // Calculer les statistiques
            const stockStats = calculateStockStats(productsData);
            
            // Mettre à jour les stats
            setStats([
                {
                    title: 'Total Produits',
                    value: productsData.length,
                    icon: <ShoppingCartOutlined />,
                    color: 'text-indigo-600',
                    trend: 'Total'
                },
                {
                    title: 'Valeur du Stock',
                    value: stockStats.totalValue,
                    icon: <BarChartOutlined />,
                    color: 'text-emerald-600',
                    trend: 'Total'
                },
                {
                    title: 'Stock Faible',
                    value: `${stockStats.lowStockCount} produits`,
                    icon: <ExclamationCircleOutlined />,
                    color: 'text-rose-600',
                    trend: 'À réapprovisionner'
                }
            ]);

            setProducts(filteredProducts);
        } catch (error) {
            console.error("Erreur lors du chargement des produits:", error);
            
            if (error.message.includes('index')) {
                const indexUrl = error.message.split('here: ')[1];
                console.log("Créez l'index requis ici :", indexUrl);
                
                // Message plus détaillé pour l'utilisateur
                Modal.error({
                    title: 'Configuration requise',
                    content: (
                        <div>
                            <p>Une configuration d'index est nécessaire pour cette combinaison de filtres et de tri.</p>
                            <p>Veuillez suivre ces étapes :</p>
                            <ol className="list-decimal ml-4">
                                <li>Cliquez sur le lien dans la console développeur</li>
                                <li>Connectez-vous à Firebase</li>
                                <li>Cliquez sur "Create Index"</li>
                                <li>Attendez que l'index soit créé (environ 1-2 minutes)</li>
                                <li>Réessayez votre recherche</li>
                            </ol>
                        </div>
                    ),
                    okText: 'Compris'
                });
            } else {
                message.error("Erreur lors du chargement des produits");
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, [searchText, categoryFilter, sortOrder]);

    // Vérifier si l'utilisateur est admin
    useEffect(() => {
        const checkAdminStatus = async () => {
            const user = auth.currentUser;
            if (!user) {
                navigate('/login');
                return;
            }

            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (!userDoc.exists() || userDoc.data().type_user !== 'admin') {
                    navigate('/login');
                    return;
                }
                setIsAdmin(true);
            } catch (error) {
                console.error("Erreur lors de la vérification du statut admin:", error);
                navigate('/login');
            }
        };

        checkAdminStatus();
    }, [navigate]);

    // Remplacez la fonction uploadImage par celle-ci
    const handleImageUpload = async (file) => {
        if (!file) return null;
        try {
            return await uploadImage(file);
        } catch (error) {
            message.error("Erreur lors de l'upload de l'image");
            console.error(error);
            return null;
        }
    };

    const columns = [
        {
            title: 'Image',
            dataIndex: 'imageUrl',
            key: 'image',
            render: (imageUrl) => (
                <img 
                    src={imageUrl || '/placeholder-image.png'} 
                    alt="" 
                    className="w-12 h-12 rounded-lg object-cover"
                />
            )
        },
        {
            title: 'Nom',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Prix',
            dataIndex: 'price',
            key: 'price',
            render: (price) => formatPrice(price)
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
            render: (stock) => (
                <span className={`px-2 py-1 rounded ${
                    stock <= 10 ? 'bg-red-100 text-red-800' :
                    stock <= 20 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                }`}>
                    {stock}
                </span>
            )
        },
        {
            title: 'Catégorie',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div className="space-x-2">
                    <Button 
                        icon={<EditOutlined />} 
                        onClick={() => handleEdit(record)}
                    />
                    <Button 
                        icon={<DeleteOutlined />} 
                        danger 
                        onClick={() => handleDelete(record)}
                    />
                </div>
            ),
        },
    ];

    const handleEdit = (product) => {
        setEditingProduct(product);
        form.setFieldsValue(product);
        setIsModalVisible(true);
    };

    const handleDelete = async (product) => {
        if (!isAdmin) {
            message.error("Vous n'avez pas les droits d'administration nécessaires");
            return;
        }

        Modal.confirm({
            title: 'Êtes-vous sûr de vouloir supprimer ce produit ?',
            content: 'Cette action est irréversible.',
            okText: 'Oui',
            cancelText: 'Non',
            onOk: async () => {
                try {
                    await deleteDoc(doc(db, 'products', product.id));
                    message.success('Produit supprimé avec succès');
                    fetchProducts();
                } catch (error) {
                    console.error("Erreur lors de la suppression:", error);
                    message.error("Erreur lors de la suppression");
                }
            },
        });
    };

    const handleSubmit = async (values) => {
        if (!isAdmin) {
            message.error("Vous n'avez pas les droits d'administration nécessaires");
            return;
        }

        try {
            setIsSubmitting(true);
            setIsModalVisible(false);

            // Gérer l'upload de l'image
            let imageUrl = null;
            if (values.image && values.image.fileList && values.image.fileList[0]) {
                const file = values.image.fileList[0].originFileObj;
                imageUrl = await handleImageUpload(file);
            }

            if (editingProduct) {
                await updateDoc(doc(db, 'products', editingProduct.id), {
                    name: values.name,
                    price: parseFloat(values.price),
                    stock: values.stock,
                    category: values.category,
                    description: values.description,
                    imageUrl: imageUrl || editingProduct.imageUrl
                });
                message.success('Produit modifié avec succès');
            } else {
                await addDoc(collection(db, 'products'), {
                    name: values.name,
                    price: parseFloat(values.price),
                    stock: values.stock,
                    category: values.category,
                    description: values.description,
                    imageUrl: imageUrl,
                    createdAt: new Date().toISOString()
                });
                message.success('Produit ajouté avec succès');
            }

            form.resetFields();
            setEditingProduct(null);
            fetchProducts();
        } catch (error) {
            console.error("Erreur lors de l'enregistrement:", error);
            message.error("Une erreur est survenue");
            setIsModalVisible(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Ne rendre le composant que si l'utilisateur est admin
    if (!isAdmin) {
        return <AdminLayout loading={true} />;
    }

    return (
        <AdminLayout loading={loading || isSubmitting}>
            <div className="p-4 md:p-8 min-h-screen">
                {/* En-tête de page */}
                <div className="mb-6 md:mb-8">
                    <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Gestion des Produits</h1>
                    <p className="text-sm md:text-base text-gray-600 mt-1">Gérez votre catalogue de produits</p>
                </div>

                {/* Stats Cards */}
                <Row gutter={[16, 16]} className="mb-6 md:mb-8">
                    {stats.map((stat, index) => (
                        <Col xs={24} sm={12} lg={8} key={index}>
                            <Card 
                                className="hover:shadow-md transition-shadow duration-300"
                                bodyStyle={{ padding: '16px md:24px' }}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-xs md:text-sm font-medium text-gray-500 mb-1">
                                            {stat.title}
                                        </p>
                                        <div className="flex items-baseline flex-wrap">
                                            <p className="text-lg md:text-2xl font-semibold text-gray-900">
                                                {stat.value}
                                            </p>
                                            <span className="ml-2 text-xs md:text-sm font-medium text-gray-500">
                                                {stat.trend}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`${stat.color} bg-opacity-10 p-2 md:p-3 rounded-full`}>
                                        {React.cloneElement(stat.icon, { 
                                            className: `text-lg md:text-xl ${stat.color}`,
                                            style: { fontSize: '20px md:24px' }
                                        })}
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Barre de recherche et filtres */}
                <Card className="mb-6 md:mb-8">
                    <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} md={8}>
                            <Input.Search 
                                placeholder="Rechercher un produit..." 
                                size="large"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="w-full"
                            />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Select
                                placeholder="Catégorie"
                                size="large"
                                className="w-full"
                                value={categoryFilter}
                                onChange={setCategoryFilter}
                                options={[
                                    { value: '', label: 'Toutes les catégories' },
                                    { value: 'huiles', label: 'Huiles' },
                                    { value: 'cremes', label: 'Crèmes' }
                                ]}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Select
                                placeholder="Trier par"
                                size="large"
                                className="w-full"
                                value={sortOrder}
                                onChange={setSortOrder}
                                options={[
                                    { value: '', label: 'Sans tri' },
                                    { value: 'price_asc', label: 'Prix croissant' },
                                    { value: 'price_desc', label: 'Prix décroissant' },
                                    { value: 'stock_low', label: 'Stock faible' }
                                ]}
                            />
                        </Col>
                        <Col xs={24} md={4} className="flex justify-center md:justify-end">
                            <Button 
                                icon={<PlusOutlined />}
                                size="large"
                                onClick={() => {
                                    setEditingProduct(null);
                                    form.resetFields();
                                    setIsModalVisible(true);
                                }}
                                style={{ 
                                    backgroundColor: '#8B5E34',
                                    borderColor: '#8B5E34',
                                    color: 'white'
                                }}
                                className="w-full md:w-auto border-none hover:bg-[#8B5E34] focus:bg-[#8B5E34] active:bg-[#8B5E34]"
                            >
                                Nouveau Produit
                            </Button>
                        </Col>
                    </Row>
                </Card>

                {/* Table sans le loading prop car géré par AdminLayout */}
                <Card className="overflow-x-auto">
                    <Table 
                        columns={columns} 
                        dataSource={products}
                        rowKey="id"
                        className="product-table"
                        scroll={{ x: 'max-content' }}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} produits`
                        }}
                    />
                </Card>

                {/* Modal responsive */}
                <Modal
                    title={editingProduct ? "Modifier le produit" : "Ajouter un produit"}
                    open={isModalVisible}
                    onCancel={() => {
                        if (!isSubmitting) {
                            setIsModalVisible(false);
                            form.resetFields();
                        }
                    }}
                    maskClosable={!isSubmitting}
                    closable={!isSubmitting}
                    width={600}
                    footer={null}
                    style={{ top: 20 }}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                    >
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="image"
                                    label="Image"
                                    valuePropName="file"
                                >
                                    <Upload.Dragger
                                        name="file"
                                        maxCount={1}
                                        listType="picture-card"
                                        showUploadList={{showPreviewIcon: true}}
                                        beforeUpload={(file) => {
                                            // Vérifier le type et la taille du fichier
                                            const isImage = file.type.startsWith('image/');
                                            const isLt2M = file.size / 1024 / 1024 < 2;

                                            if (!isImage) {
                                                message.error('Vous ne pouvez uploader que des images!');
                                            }
                                            if (!isLt2M) {
                                                message.error('L\'image doit faire moins de 2MB!');
                                            }

                                            return false; // Empêcher l'upload automatique
                                        }}
                                    >
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="text-sm md:text-base">
                                            Cliquez ou glissez une image ici
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            PNG, JPG jusqu'à 2MB
                                        </p>
                                    </Upload.Dragger>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="name"
                                    label="Nom du produit"
                                    rules={[{ required: true, message: 'Veuillez entrer le nom du produit' }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    name="price"
                                    label="Prix (FCFA)"
                                    rules={[{ required: true, message: 'Veuillez entrer le prix' }]}
                                >
                                    <InputNumber
                                        className="w-full"
                                        formatter={value => `${value} FCFA`}
                                        parser={value => value.replace(' FCFA', '')}
                                        min={0}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="stock"
                                    label="Stock"
                                    rules={[{ required: true, message: 'Veuillez entrer le stock' }]}
                                >
                                    <InputNumber className="w-full" min={0} />
                                </Form.Item>

                                <Form.Item
                                    name="category"
                                    label="Catégorie"
                                    rules={[{ required: true, message: 'Veuillez sélectionner une catégorie' }]}
                                >
                                    <Select
                                        options={[
                                            { value: 'huiles', label: 'Huiles' },
                                            { value: 'cremes', label: 'Crèmes' }
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24}>
                                <Form.Item
                                    name="description"
                                    label="Description"
                                    rules={[{ required: true, message: 'Veuillez entrer une description' }]}
                                >
                                    <Input.TextArea 
                                        rows={4}
                                        placeholder="Décrivez votre produit..."
                                        className="w-full"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item className="mb-0 flex flex-col sm:flex-row justify-end gap-2">
                            <Button 
                                onClick={() => setIsModalVisible(false)} 
                                className="w-full sm:w-auto"
                                disabled={isSubmitting}
                            >
                                Annuler
                            </Button>
                            <Button 
                                htmlType="submit" 
                                style={{ 
                                    backgroundColor: '#8B5E34',
                                    borderColor: '#8B5E34',
                                    color: 'white'
                                }}
                                className="w-full sm:w-auto border-none hover:bg-[#8B5E34] focus:bg-[#8B5E34] active:bg-[#8B5E34]"
                                loading={isSubmitting}
                                disabled={isSubmitting}
                            >
                                {editingProduct ? 'Modifier' : 'Ajouter'}
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </AdminLayout>
    );
};

export default Products; 