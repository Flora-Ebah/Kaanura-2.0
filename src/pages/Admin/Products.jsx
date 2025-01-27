import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Upload, message, Card, Row, Col, Select, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, ShoppingOutlined, DollarOutlined, InboxOutlined, ShoppingCartOutlined, BarChartOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import { child, get, ref } from 'firebase/database';
import { db } from "/lib/firebase";
import SaveProduct from '../../../actions/saveProd';



const Products = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form] = Form.useForm();
    const [images, setImages] = React.useState()


    const products = [
        {
            id: 1,
            name: 'Huile de Ricin',
            price: '29.99€',
            stock: 45,
            category: 'Huiles',
            image: '/path/to/image.jpg'
        },
        // ... autres produits
    ];

    // Ajout des statistiques
 

    const columns = [
        {
            title: 'Image',
            dataIndex: 'img',
            key: 'img',
            render: (image) => <img src={image} alt="" className="w-12 h-12 rounded-lg object-cover" />
        },
        {
            title: 'Nom',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Prix',
            dataIndex: 'price',
            key: 'price',
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
            dataIndex: 'categorie',
            key: 'categorie',
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

    const handleDelete = (product) => {
        Modal.confirm({
            title: 'Êtes-vous sûr de vouloir supprimer ce produit ?',
            content: 'Cette action est irréversible.',
            okText: 'Oui',
            cancelText: 'Non',
            onOk: () => {
                message.success('Produit supprimé avec succès');
            },
        });
    };

    const handleSubmit =async  (values) => {
        console.log(images);
        const formData = new FormData();
        formData.append('file', images);
        formData.append('upload_preset', 'kanuura');
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/do59jclns/image/upload`, 
            {
              method: 'POST',
              body:formData,
            }
          );
          console.log("Response",response)
          if (!response.ok) {
            
            throw new Error('Upload failed');
          }
    
          const data = await response.json();
          
        SaveProduct(values.name, values.category, values.price,  values.stock, "disponible", data.secure_url)
        message.success(`Produit ${editingProduct ? 'modifié' : 'ajouté'} avec succès`);
        setIsModalVisible(false);
        form.resetFields();
        setEditingProduct(null);
    };

    const [Products,setProducts] = React.useState()
    


    useEffect(() => {
        const dbRef = ref(db);
        get(child(dbRef, `produits/`)).then((snapshot) => {
          if (snapshot.exists()) {
            console.log(snapshot.val());
             setProducts(snapshot.val())
          } else {
            // console.log("No data available");
            setProducts(null);
          }
        }).catch((error) => {
          console.error(error);
          setProducts(null);
         
        });
      },[])


      const stats = [
        {
            title: 'Total Produits',
            value: Products ? Object.values(Products).length : 0    ,
            icon: <ShoppingCartOutlined />,
            color: 'text-indigo-600',
            trend: 'ce mois'
            // trend: '+12% ce mois'
        },
        {
            title: 'Valeur du Stock',
            value: '2,345.00 €',
            icon: <BarChartOutlined />,
            color: 'text-emerald-600',
            trend: '+8.5% ce mois'
        },
        {
            title: 'Stock Faible',
            value: '3 produits',
            icon: <ExclamationCircleOutlined />,
            color: 'text-rose-600',
            trend: '-2 depuis hier'
        }
    ];



    


    return (
        <AdminLayout>
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
                                            <span className={`ml-2 text-xs md:text-sm font-medium ${
                                                stat.trend.includes('+') ? 'text-emerald-600' : 'text-rose-600'
                                            }`}>
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
                                className="search-input w-full"
                            />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Select
                                placeholder="Catégorie"
                                size="large"
                                className="w-full"
                                options={[
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
                                options={[
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

                {/* Table responsive */}
                <Card className="overflow-x-auto">
                    <Table 
                        columns={columns} 
                        dataSource={Products ? Object.values(Products) : []}
                        rowKey="id"
                        className="product-table"
                        scroll={{ x: 'max-content' }}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} produits`,
                            responsive: true
                        }}
                    />
                </Card>

                {/* Modal responsive */}
                <Modal
                    title={editingProduct ? "Modifier le produit" : "Ajouter un produit"}
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
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
                                >
                                    {/* <Upload.Dragger
                                        maxCount={1}
                                        listType="picture-card"
                                        showUploadList={{showPreviewIcon: true}}
                                    >
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="text-sm md:text-base">Cliquez ou glissez une image ici</p>
                                    </Upload.Dragger> */}
                                    <input type='file' accept='image/*' onChange={(e)=>setImages(e.target.files[0])}/>
                                    
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
                                    label="Prix"
                                    rules={[{ required: true, message: 'Veuillez entrer le prix' }]}
                                >
                                    <InputNumber
                                        className="w-full"
                                        formatter={value => `${value}€`}
                                        parser={value => value.replace('€', '')}
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
                        </Row>

                        <Form.Item className="mb-0 flex flex-col sm:flex-row justify-end gap-2">
                            <Button 
                                onClick={() => setIsModalVisible(false)} 
                                className="w-full sm:w-auto"
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