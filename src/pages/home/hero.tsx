import { Card, Container } from "react-bootstrap";
import { Button, message } from "antd";
import './hero.scss'
import { heroProps } from "../../props/hero-props";
import axios from "axios";

export const Hero =()=>{

    const handleSubmit = (values: any) => {
        handleLogin(values)
        return message.success({
            content: "Sighting Added!",
            duration: 3,
            style: {
                marginTop: '40px',
            },
        });
    }

    const handleLogin = (values:any)=>{
        
    }

    return(
        <>
        <section className="jumbotron d-flex justify-content-center text-center" style={{backgroundImage: `url(${heroProps.bannerImg})`}}>
            <Container>
                <h1 style={{color:"white"}}>{heroProps.greeting}</h1>
                <Button type="primary"><a href="/products">Find Vegan Products Near Me</a></Button>
            </Container>
        </section>
        </>
    );
}