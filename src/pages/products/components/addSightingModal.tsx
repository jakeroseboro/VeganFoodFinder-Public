import { Button, Form, Input, message, Modal } from "antd";
import { useContext, useState } from "react";
import { UserContext } from "../../../App";
import { productUpdateOptions, Sighting, useUpdateProduct } from "../data/data";

export const AddSightingModal = ({ product }: { product: any }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const updateProduct = useUpdateProduct()
    const activeUser = useContext(UserContext)
    const [form] = Form.useForm();

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        form.resetFields()
        setIsModalVisible(false);
    };

    const handleSubmit = (values: any) => {
        handleAddSighting(values)
        return message.success({
            content: "Sighting Added!",
            duration: 3,
            style: {
                marginTop: '40px',
            },
        });
    }

    const handleAddSighting = async(values:any)=>{
        const sighting: Sighting= {
            Store: {
                Name: values.StoreName
            },
            SpottedBy: activeUser.userName,
            Seen: new Date,
            Street: values.Street,
            City: values.City,
            State: values.State,
            ZipCode: Number(values.ZipCode)
        }

        const update: productUpdateOptions={
            Id : product.id,
            Sighting : sighting
        }

        try{
            await updateProduct.mutateAsync({updates: update, token: activeUser.token})
            form.resetFields();
            setIsModalVisible(false)
        }
        catch(error){
            localStorage.clear()
            console.error(error)
            form.resetFields();
            setIsModalVisible(false)
            return message.error({
                content: "Unable to add sighting. Try again later",
                duration: 3,
                style: {
                    marginTop: '40px',
                },
            });
        }
    }

    return (
        <>
            <section>
                <Modal
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    onOk={handleCancel}
                    title="Add a Sighting"
                    destroyOnClose={true}
                    footer={[
                        <Button form="sightingForm" key="submit" htmlType="submit">
                            Submit
                        </Button>
                    ]}>
                    <Form name="Add a Product" id="sightingForm" form={form} onFinish={handleSubmit}>
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
                    </Form>
                </Modal>
                <Button onClick={showModal}>Add sighting</Button>
            </section>
        </>
    )
}