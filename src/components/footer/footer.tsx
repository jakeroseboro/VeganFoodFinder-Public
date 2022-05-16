import { Container, Nav, NavDropdown } from "react-bootstrap";
import Navbar from 'react-bootstrap/Navbar';
import './footer.scss';

export const Footer = () => {

    return (
        <>
            <Navbar bg="dark" variant="dark" >
                <Container className="d-flex text-center justify-content-center">
                <p className="footer-brand">© {new Date().getFullYear()} - Veggie Stock</p>
                </Container>
            </Navbar>
        </>
    )
}
