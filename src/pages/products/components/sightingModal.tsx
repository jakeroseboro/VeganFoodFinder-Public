import { Button, Input, Modal, Table } from "antd"
import { useState } from "react";


export const SightingModal = ({products} : {products: any}) =>{
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [sightings, setSightings] = useState(products?.sightings)
    
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const columns = [
        { 
            title: 'Date', 
            dataIndex: 'seen',
            key: 'seen',
            render: (row: any) =><> {row.split("T")[0]}</>
        },
        { 
            title: 'Spotted By', 
            dataIndex: 'spottedBy',
            key: 'spottedBy',
            render: (row: any) =><> {row}</>
        },
        { 
            title: 'Store', 
            dataIndex: 'store',
            key: 'store.name',
            render: (row: any) =><> {row.name}</>
        },{ 
            title: 'Zip Code', 
            dataIndex: 'zipCode',
            key: 'zipCode',
            render: (row: any) =><> {row}</>
        },
        { 
            title: 'Street Address', 
            dataIndex: 'street',
            key: 'street',
            render: (row: any) =><> {row}</>
        }

    ];

    const handleZipInput =(values: any)=>{
        values.target.value == "" ? setSightings(products?.sightings) : setSightings(products.sightings.filter((x: { zipCode: string; store: {name : string}; }) => x.zipCode.toString().includes(values.target.value) || x.store.name.toLocaleLowerCase().includes(values.target.value.toLocaleLowerCase()) ));
    }

    
    return(
        <>
            <section>
                <Modal
                visible={isModalVisible}
                onCancel={handleCancel}
                onOk={handleCancel}
                title="View all Sightings"
                destroyOnClose={true}>
                    <Input onChange={handleZipInput} placeholder="Enter a zipcode or store name" allowClear/>
                    <Table dataSource={sightings?.sort(function(a: any, b: any){return Number(new Date(b?.seen).getTime()) - new Date(a?.seen).getTime()})} columns={columns} scroll={{x:400}} pagination={{ pageSize: 5 }}>

                    </Table>
                </Modal>
                <Button onClick={showModal}>View sightings</Button>
            </section>
        </>
    )
}