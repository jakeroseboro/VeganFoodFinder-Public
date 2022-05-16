import React, { useState } from "react";
import { Container } from "react-bootstrap";
import emailjs from "emailjs-com";
import { Form, Input, Button, message, Modal } from "antd";
import { heroProps } from "../../props/hero-props";
import './contact.scss'


export const Contact = () => {
    const [form] = Form.useForm();

    const handleSubmit = (e: any) => {
        emailjs
            .send(
                "jakeroseboro",
                "jakeroseboro",
                {
                    message_email: e.message_email,
                    message: e.message,
                    from_first_name: e.from_first_name,
                    from_last_name: e.from_last_name,
                },
                "user_vbjYlIJevYSxTjDOUmDQ0"
            )
            .then((_) => {
                form.resetFields()
                return message.success({
                    content: "Email Sent",
                    duration: 3,
                    style: {
                        marginTop: '40px',
                    },
                });
            })
            .catch((_) => {
                return message.error({
                    content: "Failed to send message. Please try again.",
                    duration: 3,
                    style: {
                        marginTop: '40px',
                    },
                });
            });
    };

    return (
        <>
         <section className="jumbotron d-flex justify-content-center text-center" style={{backgroundImage: `url(${heroProps.bannerImg})`}}>
            <Container>
            <div className="contact-div">
                <div className="contact-wrapper">
                    <h1 className="contact-h1">Contact us to report bugs, submit feature requests, or just say hi!</h1>
                    <Form
                        name="nest-messages"
                        onFinish={handleSubmit}
                        form={form}
                    >
                        <Form.Item
                            name="from_first_name"
                            label={<p className="contact-text">First Name</p>}
                            rules={[{ required: true, message: "Please enter your first name!" }]}
                            labelAlign="left"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="from_last_name"
                            label={<p className="contact-text">Last Name</p>}
                            rules={[{ required: true, message: "Please enter your last name!" }]}
                            labelAlign="left"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="message_email"
                            label={<p className="contact-text">Email</p>}
                            rules={[{ type: "email", required: true, message: "Please enter your email!" }]}
                            labelAlign="left"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="message"
                            label={<p className="contact-text">Message</p>}
                            labelAlign="left"
                            rules={[{ required: true, message: "Please enter your message!" }]}
                        >
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item>
                            <div className="d-flex justify-content-center">
                                <Button type="primary" htmlType="submit" form="nest-messages">
                                    Submit
                                </Button>
                            </div>

                        </Form.Item>
                    </Form>
                    </div>
                </div>
            </Container>
        </section>         
        </>
       
    );
};