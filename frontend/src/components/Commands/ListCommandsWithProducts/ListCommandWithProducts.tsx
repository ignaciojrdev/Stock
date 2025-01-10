import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "./ListCommandWithProducts.scss";
import LoadingSpinner from '../../../utils/Modais/Loading/LoadingSpinner/LoadingSpinner.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Product } from '../../../utils/Interfaces/Product';
import { Movement } from '../../../utils/Interfaces/Movement';
import { notifySuccess } from '../../../utils/Modais/Toast/Toasts.tsx';
import { notifyError } from '../../../utils/Modais/Toast/Toasts.tsx';
import axios from 'axios';

function ListCommandWithProducts() {
  const command = window.location.href.split('/')[5];
  const urlBackendStock = process.env.BACKEND_STOCK || 'http://localhost:3201/';
  const serviceBackendStockSalesCommand = process.env.BACKEND_SALES_COMMAND || 'Sale/Command/';
  const serviceBackendStockMovement = process.env.BACKEND_SALES_MOVEMENT || 'Stock/Movement/';

  useEffect(() => {
    showProductsRegisteredOnCommand()
  }, [window.location.href]);

  const showProductsRegisteredOnCommand = async () => {
    setIsLoading(true);
    try{
      await fillProducts(await fetchProducts());
    }catch(error: any){
      notifyError(error.response.data.message + " " + error.response.data.error);
    }finally{
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    let response = await axios.get(urlBackendStock+serviceBackendStockSalesCommand+command, {});
    return response.data.products;
  };

  const fillProducts = (products: Product[]) => {
    setProducts(products);
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [products, setProducts] = useState<Product[]>([]);

  const incrementQuantityOnCommand = async (product: Product) => {
    let newMovement: Movement = {
      product: product.id,
      quantity: 1,
      type: "OUT",
      command: String(command)
    };
    setIsLoading(true);
    try{
      await incrementNewCommand(newMovement);
      showProductsRegisteredOnCommand();
      notifySuccess(`Foi adicionado 1 unidade de ${product.name} à comanda com sucesso!`);
    }catch(error: any){
      notifyError(error.response.data.message + " " + error.response.data.error);
    }finally{
      setIsLoading(false);
    }
  }

  const incrementNewCommand = async (movement: Movement) => {
  await axios.post(urlBackendStock+serviceBackendStockMovement, movement);
  }

  const decrementQuantityOnCommand = async (product: Product) => {
    setIsLoading(true);
    try{
      await decrementQuantityCommand(product.id);
      showProductsRegisteredOnCommand();
      notifySuccess(`Foi removido 1 unidade de ${product.name} à comanda com sucesso!`);
    }catch(error: any){
      notifyError(error.response.data.message + " " + error.response.data.error);
    }finally{
      setIsLoading(false);
    }
  }

  const decrementQuantityCommand = async (productId: number) => {
    await axios.delete(urlBackendStock+serviceBackendStockMovement+command+'/'+productId);
  };

  const removeProductFromCommandHandle = async (product: Product) => {
    setIsLoading(true);
    try{
      await removeProductFromCommand(product);
      showProductsRegisteredOnCommand();
      notifySuccess(`O produto ${product.name} foi removido da comanda com sucesso!`);
    }catch(error: any){
      notifyError(error.response.data.message + " " + error.response.data.error);
    }finally{
      setIsLoading(false);
    }
  }

  const removeProductFromCommand = async (product: Product) => {
    await axios.delete(urlBackendStock+serviceBackendStockMovement+command+'/'+product.id+'/'+'All');
  };

  const deleteCommandHandle = async () => {
    try{
      await deleteCommand();
      notifySuccess(`Comanda e produtos deletados com sucesso!`);
    }catch(error: any){
      notifyError(error.response.data.message + " " + error.response.data.error);
    }finally{
      setIsLoading(false);
    }
    
    window.location.reload()
  };

  const deleteCommand = async () => {
    await axios.delete(urlBackendStock+serviceBackendStockSalesCommand+command);
  }

  const closeCommandHandle = async () => {
    try{
      await closeCommand();
      notifySuccess(`Comanda fechada com sucesso!`);
    }catch(error: any){
      notifyError(error.response.data.message + " " + error.response.data.error);
    }finally{
      setIsLoading(false);
    }
    
    window.location.reload()
  };

  const closeCommand = async () => {
    await axios.put(urlBackendStock+serviceBackendStockSalesCommand, {id: command, status: 'Fechada'});
  }

  return (
    <>
      <div className='centering-titles'>
        <h1>Comanda</h1>
      </div>
      <hr></hr>
      <div className='container-list-command-products'>
        {
          products.length > 0 ? 
          <div>
              <div className='centering-titles'>
                <h2>Itens</h2>
              </div>
              <div className='list-command-products'>
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nome</th>
                      <th>Vr. Unitário (R$)</th>
                      <th>Quantidade</th>
                      <th>Adicionar</th>
                      <th>Subtrair</th>
                      <th>Excluir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => (
                      <tr key={`${product.id}`}>
                        <td>{index+1}</td>
                        <td>{product.name}</td>
                        <td>{product.price}</td>
                        <td>{product.stock}</td>
                        <td><button onClick={() => incrementQuantityOnCommand(product)}><FontAwesomeIcon icon={faPlus} style={{ color: 'black' }}/></button></td>
                        <td><button onClick={() => decrementQuantityOnCommand(product)}><FontAwesomeIcon icon={faMinus} style={{ color: 'black' }}/></button></td>
                        <td><button onClick={() => removeProductFromCommandHandle(product)}><FontAwesomeIcon icon={faTrash} style={{ color: 'black' }}/></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          :
            <div className='list-command-products comanda-vazia'>
              <h3>Não existem produtos relacionados a comanda.</h3>
            </div>
        }
        <div className='list-command-products-actions'>
          <div className='centering-titles'>
            <h2>Ações</h2>
          </div>
          <div className='centering-button'>
            <Link to={`Product/New`}>
              <button className='list-command-products-actions-button buttonHover' >Adicionar produtos</button>
            </Link>
          </div>
          <div className='centering-button'>
            <Link to={'/Stock/Command'}>
              <button className='list-command-products-actions-button buttonHover' onClick={closeCommandHandle}>Fechar comanda</button>
            </Link>
          </div>
          <div className='centering-button'>
            <Link to={'/Stock/Command'}>
              <button className='list-command-products-actions-button buttonHoverDelete' onClick={deleteCommandHandle}>Deletar comanda</button>
            </Link>
          </div>
        </div>
      </div>
      <LoadingSpinner  isLoading={isLoading} />
    </>
  );
}

export default ListCommandWithProducts;