import './products.scss';
import { AddProductModal } from './components/addProductModal';
import { Container, Row } from 'react-bootstrap';
import { SearchPage } from './components/productsSearchPage';

export const Products =()=>{

    return(
        <>
       <section>
            <Container fluid={true} className="products-container"> 
                 <SearchPage/>
            </Container>
        </section>
        </>
    )
}