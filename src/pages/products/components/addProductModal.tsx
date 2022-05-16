import { Container } from "react-bootstrap";
import { Button, Modal, Form, Upload, Input, Select, message, Spin } from "antd";
import { useContext, useState } from "react";
import axios from "axios";
import { Option } from "antd/lib/mentions";
import { GetAllProducts, newProduct, useAddProduct, useGetAllProducts } from "../data/data";
import { UserContext } from "../../../App";
import { useQuery } from "react-query";

// TO DO: add button to form so that required will work, verify that the product does not already exist

export const AddProductModal = () => {
    const activeUser = useContext(UserContext)
    const { data, error, isError, isLoading, refetch } = useGetAllProducts(activeUser.token);
    const addProduct = useAddProduct();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [img, setImg] = useState(Object);
    const [imgUrl, setImgUrl] = useState("");
    const [addingProduct, setAddingProduct] = useState(false)

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalVisible(false);
    };

    const handleSubmit = (values: any) => {
        const product = data?.find((x: { name: string; sightings: []; }) => x?.name?.toLowerCase() == values?.ProductName?.toLowerCase());
        let storeName = undefined
        product?.sightings.forEach((x: { store: { name: any; }; }) => {
            if(x.store.name.toLowerCase() == values.StoreName.toLowerCase()){
                storeName = x.store.name
            }
        });
        if (product != undefined && storeName != undefined) {
            setIsModalVisible(false)
            form.resetFields();
            return message.error({
                content: `${product.name} already exists at ${storeName}!`,
                duration: 3,
                style: {
                    marginTop: '40px',
                },
            });
        }

        handleCreateNewProduct(values);
    }

    const getUrlFromUpload = async () => {
        const data = new FormData();
        data.append("file", img);
        data.append("upload_preset", "veggies");
        data.append("cloud_name", "veggie-stock");

        const response = await axios.post("https://api.cloudinary.com/v1_1/veggie-stock/image/upload", data, { withCredentials: false })

        return response.data.url
    }

    const handleCreateNewProduct = async (values: any) => {
        setAddingProduct(true)
        try {
            const url = await getUrlFromUpload();
            const newProd: newProduct = {
                Name: values.ProductName,
                Sighting: {
                    Store: {
                        Name: values.StoreName
                    },
                    SpottedBy: activeUser.userName,
                    Seen: new Date,
                    Street: values.Street,
                    City: values.City,
                    State: values.State,
                    ZipCode: Number(values.ZipCode)
                },
                Brand: values.Brand,
                Type: Number(values.Type),
                CreatedBy: activeUser.userName,
                CoverImage: url
            }
            await addProduct.mutateAsync({ newProduct: newProd, token: activeUser.token });
            message.success({
                content: "Product created!",
                duration: 3,
                style: {
                    marginTop: '40px',
                },
            });
            form.resetFields();
            setAddingProduct(false)
            setIsModalVisible(false);
        } catch (error) {
            form.resetFields();
            setAddingProduct(false)
            setIsModalVisible(false);
            localStorage.clear()
            console.log(error)
        }
    }

    const onChange = (info: any) => {
        setImg(info.file)
    }

    return (
        <>
            <section className="d-flex justify-content-center">
                <Modal
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    onOk={form.submit}
                    title="Add a Product"
                    footer={[
                        <Button form="addProductForm" key="submit" htmlType="submit">
                            Submit
                        </Button>
                    ]}
                    destroyOnClose={true}
                >
                    {addingProduct ? <div className="d-flex justify-content-center"><Spin/></div> :
                        <Form name="Add a Product" id="addProductForm" form={form} onFinish={handleSubmit}>
                            <Form.Item name="ProductName" key="name" label="Product name" required={true} rules={[{ required: true }]}>
                                <Input placeholder="The name on the packaging (i.e. chik'n strips)" />
                            </Form.Item>
                            <Form.Item name="Brand" key="brand" label="Brand" required={true} rules={[{ required: true }]}>
                                <Input placeholder="Who makes this product (i.e. Gardein)" />
                            </Form.Item>
                            <Form.Item name="StoreName" key="store" label="Store Name" required={true} rules={[{ required: true }]}>
                                <Input placeholder="Where did you find this product (i.e. Walmart)" />
                            </Form.Item>
                            <Form.Item name="Street" key="street" label="Street Address" required={true} rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="City" key="city" label="City" required={true} rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="State" key="state" label="State" required={true} rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="ZipCode" key="zip" label="Zip" required={true} rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="Type" key="type" label="Type of prouct" required={true} rules={[{ required: true }]}>
                                <Select>
                                    <Select.Option value="1">Vegan</Select.Option>
                                    <Select.Option value="2">Vegetarian</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name="Image" key="uploadImg" label="Product Image" required={true} rules={[{ required: true }]}>
                                <Upload beforeUpload={() => false} onChange={onChange} accept="image/jpeg, image/png" maxCount={1}>
                                    <Button>Choose File</Button>
                                </Upload>
                            </Form.Item>
                        </Form>
                    }
                </Modal>
                <Button onClick={showModal}>Add Product</Button>
            </section>
        </>
    )
}