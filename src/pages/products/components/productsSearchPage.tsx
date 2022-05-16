import { ReactChild, ReactFragment, ReactPortal, useContext, useEffect, useState } from "react";
import { UserContext } from "../../../App";
import { GetProducts, productQuery, useGetAllProducts } from "../data/data";
import { Card, Col, Row } from "react-bootstrap";
import { Button, Dropdown, Form, Input, Select, Spin, Pagination } from "antd";
import { SightingModal } from "./sightingModal";
import { AddSightingModal } from "./addSightingModal";
import { AddProductModal } from './addProductModal';
const zipcodes = require('zipcodes');

//Todo: add pagination
export const SearchPage = () => {
    const activeUser = useContext(UserContext)
    const { data, error, isError, isLoading, refetch } = useGetAllProducts(activeUser.token);
    const [form] = Form.useForm();
    const [results, setResults] = useState([])
    const [isSearchBar, setIsSearchBar] = useState(false);
    const pageSize = 8;
    const [current, setCurrent] = useState(1);

    const handleSubmit = (values: any) => {
        setIsSearchBar(!isSearchBar)
        handleSearch(values)
    }

    useEffect(() => {
        setInitialResults()
    }, [data])

    const setInitialResults = async () => {
        await refetch()
        const sorted = data?.sort(function (a: any, b: any) { return Number(new Date(b?.lastSpotted).getTime()) - new Date(a?.lastSpotted).getTime() });
        setResults(sorted)
    }

    const handleSearch = async (values: any) => {

        let query: productQuery = {

        }
        if (values.ProductName !== undefined) {
            query.Name = values.ProductName
        }
        if (values.StoreName !== undefined) {
            query.StoreName = values.StoreName
        }
        if (values.ZipCode !== undefined) {
            const rad = zipcodes.radius(values.ZipCode, values.Radius ?? 10);
            rad.push(Number(values.ZipCode))
            query.ZipCodes = rad
        }
        const response = await GetProducts(query, activeUser.token);
        setResults(response?.sort(function (a: any, b: any) { return Number(new Date(b?.lastSpotted).getTime()) - new Date(a?.lastSpotted).getTime() }));
        form.resetFields();
    }

    const handlePageChange = (e: any) => {
        setCurrent(e)
    }

    return (
        <>
            {isLoading ? <div className="d-flex justify-content-center"><Spin /></div> :
                <>
                    <div className="d-flex justify-content-center align-content-center">
                        <Row style={{ width: "100%" }}>
                            <Col className="d-flex justify-content-center">
                                <Button className="mx-2" onClick={_ => setIsSearchBar(!isSearchBar)} hidden={isSearchBar}>Search options</Button>
                            </Col>
                            <Col className="d-flex justify-content-center" hidden={isSearchBar}>
                                <AddProductModal/>
                            </Col>
                            <div hidden={!isSearchBar}>
                            <Form name="Add a Product" id="myForm" form={form} onFinish={handleSubmit}>
                                <Row lg={3} xs={1} s={3} md={3} className="d-flex justify-content-center">
                                    <Col>
                                        <Form.Item label={<span style={{color:"white"}}>Product Name:</span>} colon={false}>
                                            <Form.Item name="ProductName" key="name">
                                                <Input />
                                            </Form.Item>
                                        </Form.Item>
                                    </Col>
                                    <Col>
                                        <Form.Item label={<span style={{color:"white"}}>Store Name:</span>} colon={false}>
                                            <Form.Item name="StoreName" key="store">
                                                <Input />
                                            </Form.Item>
                                        </Form.Item>

                                    </Col>
                                    <Col >
                                        <Form.Item label={<span style={{color:"white"}}>Zip Code:</span>} colon={false}>
                                            <Input.Group compact>
                                                <Form.Item name="ZipCode" key="zipCode">
                                                    <Input />
                                                </Form.Item>
                                                <Form.Item name="Radius" key="radius">
                                                    <Select placeholder="Radius (miles)">
                                                        <Select.Option value="5">5</Select.Option>
                                                        <Select.Option value="10">10</Select.Option>
                                                        <Select.Option value="25">25</Select.Option>
                                                        <Select.Option value="50">50</Select.Option>
                                                    </Select>
                                                </Form.Item>
                                            </Input.Group>
                                        </Form.Item>
                                    </Col>
                                    <Col className="d-flex justify-content-center">
                                        <Button className="mx-2" onClick={_ => setIsSearchBar(!isSearchBar)}>Cancel</Button>
                                        <Button className="mx-2" form="myForm" key="submit" htmlType="submit">
                                            Search
                                        </Button>
                                        <Button className="mx-2" onClick={_ => handleSubmit("")} hidden={!isSearchBar}>Clear Filters</Button>
                                    </Col>
                                </Row>
                            </Form>
                            </div>
                        </Row>
                    </div>
                    <Row lg={4} xs={1}>
                        {results?.length > 0 ? results?.slice((current - 1) * pageSize, current * pageSize)?.map((x: any) => (
                            <Col className="d-flex justify-content-center py-3" key={x?.id}>
                                <Card style={{ width: '18rem' }}>
                                    <Card.Img src={
                                        x?.coverImage == "" || x?.coverImage == "string" ? "https://res.cloudinary.com/veggie-stock/image/upload/w_300,h_300,c_fill/v1649865055/sample.jpg" :
                                            x?.coverImage?.split("upload")[0] + "upload/w_300,h_300,c_fill" + x?.coverImage?.split("upload")[1]
                                    } ></Card.Img>
                                    <Card.Body>
                                        <h3>{x?.name} by {x?.brand}</h3>
                                        <p>Posted by: {x?.createdBy}</p>
                                        <p>Last spotted near you on {x?.lastSpotted.toString().split("T")[0]} at {x?.sightings[0]?.store?.name}({x?.sightings[0]?.zipCode}, {x?.sightings[0]?.street}) by {x?.sightings[0]?.spottedBy}</p>
                                        <span className="d-flex justify-content-between" style={{flexWrap: "wrap"}}><AddSightingModal product={x} /> <SightingModal products={x} /></span>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )) : <Col style={{ width: "100%", height: "550px" }}><h1 style={{color:"white"}}>No results match that search, try another search or consider adding a product</h1></Col>}
                    </Row>
                    <div hidden={results?.length < 1} className="d-flex justify-content-center" style={{paddingBottom:"10px"}}><Pagination current={current} pageSize={pageSize} onChange={handlePageChange} total={results?.length} /></div>
                </>
            }
        </>
    )
}

//.slice((current - 1) * pageSize, current * pageSize)
    // for pagination 