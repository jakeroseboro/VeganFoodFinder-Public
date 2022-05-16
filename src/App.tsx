import React, { createContext, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.scss';
import { Navigation } from './components/nav/navbar';
import { Hero } from './pages/home/hero';
import { Products } from './pages/products/products';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Footer } from './components/footer/footer';
import axios from 'axios';
import { Contact } from './pages/contact/contact';
import { loginOptions, newUser, useGetAllUsers, useLogin, useSignUp } from './pages/home/data/data';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { heroProps } from './props/hero-props';
import { Button, Form, Input, message } from 'antd';
export const UserContext = createContext({
  token: "null",
  id: "null",
  userName: "null",
  email: "null",
  password: "null"
});

function App() {
  const [ActiveUser, SetActiveUser] = useState(
    {
      token: "null",
      id: "null",
      userName: "null",
      email: "null",
      password: "null"
    }
  );
  const [signupForm] = Form.useForm();
  const [loginForm] = Form.useForm();
  const login = useLogin();
  const createUser = useSignUp();
  const [isSignup, setIsSignup] = useState(false);
  const {data, isLoading} = useGetAllUsers();

  useEffect(() =>{
    const userName = localStorage.getItem("userName");
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");
    if(userName != null && userName != undefined && email != null && email != undefined && token != null && token != undefined){
      SetActiveUser({
        email: email,
        id: "null",
        userName: userName,
        token: token,
        password: "null"
      });
    }
  }, [])

  const handleLoginSubmit = (values:any) =>{
    handleLogin(values)
  }

  const handleLogin = async(values:any) =>{
    try{
      const opts:loginOptions ={
        UserName: values.Username,
        Password: values.Password
      }
  
      const response = await login.mutateAsync({opts})
      SetActiveUser({
        email: response.email,
        id: response.id,
        userName: response.userName,
        token: response.token,
        password: response.password
      });
  
      localStorage.setItem("email", response.email)
      localStorage.setItem("userName", response.userName)
      localStorage.setItem("token", response.token)
    }
    catch(error){
      message.error("The username or password is incorrect. Please try again")
      console.error(error)
      localStorage.clear()
    }
  }

  const handleSignupSubmit = (values:any) =>{
    handleSignup(values)
  }

  const handleSignup = async(values:any) =>{

    try{
      const newUser:newUser ={
        Email: values.Email,
        UserName: values.Username,
        Password: values.Password
      }
  
      const existingUser = data?.filter((x: string) => x.toLowerCase() == values.Username.toLowerCase())
      
      if(existingUser?.length > 0){
        return message.error("Username already exists")
      }
  
      const response = await createUser.mutateAsync({newUser})
  
      SetActiveUser({
        email: response.email,
        id: response.id,
        userName: response.userName,
        token: response.token,
        password: response.password
      });
  
      localStorage.setItem("email", response.email)
      localStorage.setItem("userName", response.userName)
      localStorage.setItem("token", response.token)
    }
    catch(error){
      console.error(error)
      localStorage.clear()
    }
  }

  return (
    <>
      {
        ActiveUser.token == "null" ?
          <>
            <section className="jumbotron-login d-flex justify-content-center text-center" style={{ backgroundImage: `url(${heroProps.bannerImg})` }}>
              <Container className='d-flex justify-content-center'>
                <Row>
                  <Col>
                    {
                      isSignup ?
                        <Card>
                          <Card.Title>Sign Up</Card.Title>
                          <Card.Body>
                            <Form form={signupForm} id="signUpForm" onFinish={handleSignupSubmit}>
                              <Form.Item name="Email" key="Email" label="Email" required={true} rules={[{ required: true }]}>
                                <Input />
                              </Form.Item>
                              <Form.Item name="Username" key="Username" label="Username" required={true} rules={[{ required: true }]}>
                                <Input />
                              </Form.Item>
                              <Form.Item name="Password" key="Password" label="Password" required={true} rules={[{ required: true }]}>
                                <Input.Password />
                              </Form.Item>
                              <Form.Item>
                                <Button form="signUpForm" key="submit" htmlType="submit">
                                  Submit
                                </Button>
                              </Form.Item>
                            </Form>
                            <a className='login-anchor' onClick={() => setIsSignup(false)}>Already have an account? Login.</a>
                          </Card.Body>
                        </Card>

                        :

                        <Card>
                          <Card.Title>Login</Card.Title>
                          <Card.Body>
                            <Form form={loginForm} id="loginForm" onFinish={handleLoginSubmit}>
                              <Form.Item name="Username" key="Username" label="Username" required={true} rules={[{ required: true }]}>
                                <Input />
                              </Form.Item>
                              <Form.Item name="Password" key="Password" label="Password" required={true} rules={[{ required: true }]}>
                                <Input.Password />
                              </Form.Item>
                              <Form.Item>
                                <Button form="loginForm" key="submit" htmlType="submit">
                                  Submit
                                </Button>
                              </Form.Item>
                            </Form>
                            <a className='login-anchor' onClick={() => setIsSignup(true)}>Need to create an account? Sign up.</a>
                          </Card.Body>
                        </Card>
                    }
                  </Col>
                </Row>
              </Container>
            </section>
          </>
          :
          <UserContext.Provider value={ActiveUser}>
            <section>
              <Navigation />
            </section>
            <Routes>
              <Route path="/" element={<Hero />} />
              <Route path="/products" element={<Products />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<p>There's nothing here: 404!</p>} />
            </Routes>
            <section className="footer">
              <Footer />
            </section>
          </UserContext.Provider>
      }
    </>
  );
}

export default App;
