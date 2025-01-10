import './ProductPage.scss';
import Products from '../../components/Product/Product.tsx';
function ProductPage(){
    return (
        <>
            <div className='centering-titles'>
                <h1>Produtos</h1>
            </div>
            <hr></hr> 
            <div>
                <Products />
            </div>
        </>
    );
}

export default ProductPage;