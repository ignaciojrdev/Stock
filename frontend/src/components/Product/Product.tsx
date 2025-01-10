import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash, faListOl, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

import "./Product.scss";

import MovementModal from '../Movement/NewMovement/NewMovement.tsx';
import ProductModal from './NewProduct/NewProduct.tsx';

import LoadingSpinner from '../../utils/Modais/Loading/LoadingSpinner/LoadingSpinner.tsx';
import { notifySuccess } from '../../utils/Modais/Toast/Toasts.tsx';
import { notifyError } from '../../utils/Modais/Toast/Toasts.tsx';
import { Product } from '../../utils/Interfaces/Product';


function Products() {
    const url = process.env.BACKEND_STOCK || 'http://localhost:3201/';
    const service = process.env.BACKEND_SALES_PRODUCT || 'Stock/Product/';

    useEffect(() => {
        showProductsRegistered();
    }, []);

    const [isModalCadastroMovimentacaoOpen, setisModalCadastroMovimentacaoOpen] = useState<boolean>(false);

    const [productSelectedToMovement, setProductSelectedToMovement] = useState<number>(0);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [products, setProducts] = useState<Product[]>([]);

    const deleteProduct = async(product: Product) => {
      setIsLoading(true);
      try{
        await axios.delete(url+service+product.id, {});
        showProductsRegistered();
      }catch(error: any){
          notifyError(error.response.data.message + " " + error.response.data.error);
      }finally{
          setIsLoading(false);
      }
    };

    const showProductsRegistered = async() => {
        setIsLoading(true);
        try{
            await getProductsRegistered();
        }catch(error: any){
            notifyError(error.response.data.message + " " + error.response.data.error);
        }finally{
            setIsLoading(false);
        }
    };

    const getProductsRegistered = async () => {
        let response = await axios.get(url+service, {});
        let products = response.data;
        setProducts(products);
    };

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const handleOpenModalProduct = (product: Product | null = null) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    const handleSaveProduct = (product: Product) => {
        if(product.price == 0){
          notifyError('O valor do produto não pode ser zero!')
          return
        }
        setIsLoading(true);
        try{
            if (selectedProduct) {
              // Editar produto
              setProducts((prev) =>
                  prev.map((p) => (p === selectedProduct ? product : p))
              );
              putProduct(product);
            } else {
              // Adicionar produto
              postProduct(product);
              setProducts((prev) => [...prev, product]);
            }
        }catch(error: any){
            notifyError(error.response.data.message + " " + error.response.data.error);
        }finally{
            setIsLoading(false);
            window.location.reload()
        }
    };

    const putProduct = async(product: Product) => {
      await axios.put(url+service, {id: product.id, name: product.name, price: product.price, description: product.description});
    }

    const postProduct = async(product: Product) => {
      await axios.post(url+service, {name: product.name, price: product.price, description: product.description});
    }

    const onCloseModalCadastroMovimentacao = () => {
      setisModalCadastroMovimentacaoOpen(false);
    }

    const handleOpenModalMovement = (product: Product) => {
      setisModalCadastroMovimentacaoOpen(true);
      setProductSelectedToMovement(product.id)
    };

    return (
    <>    
      <div className='container-list-products'>
        {
          products.length > 0 ? 
          <div>
              <div className='list-products'>
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nome</th>
                      <th>Vr. Unitário (R$)</th>
                      <th>Descrição</th>
                      <th>Excluir</th>
                      <th>Editar</th>
                      <th>Movimentações</th>
                      <th>Nova Movimentação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => (
                        <tr key={`${product.id}`}>
                          <td>{index+1}</td>
                          <td>{product.name}</td>
                          <td>{product.price}</td>
                          <td>{String(product.description || '')}</td>
                          <td><button onClick={() => deleteProduct(product)}><FontAwesomeIcon icon={faTrash} style={{ color: 'black' }}/></button></td>
                          <td><button onClick={() => handleOpenModalProduct(product)}><FontAwesomeIcon icon={faPencil} style={{ color: 'black' }}/></button></td>
                          <td><Link to={`Movement/` + product.id}><FontAwesomeIcon icon={faListOl} style={{ color: 'black' }}/></Link></td>
                          <td><button onClick={() => handleOpenModalMovement(product)}><FontAwesomeIcon icon={faPlus} style={{ color: 'black' }}/></button></td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          :
            <div className='list-products products-empty'>
              <h3>Não existem produtos cadastrados.</h3>
            </div>  
        }
        <div className='list-products-actions'>
          <div className='centering-titles'>
            <h2>Ações</h2>
          </div>
          <div className='centering-button'>
            <button className='list-products-actions-button buttonHover' onClick={() => handleOpenModalProduct()}>Adicionar produtos</button>
          </div>
        </div>
      </div>
      <LoadingSpinner  isLoading={isLoading} />
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProduct}
        product={selectedProduct}
      />
      <MovementModal 
        isOpen={isModalCadastroMovimentacaoOpen}
        productId={productSelectedToMovement}
        onCloseModal={onCloseModalCadastroMovimentacao}
      />
    </>
  );
}

export default Products;