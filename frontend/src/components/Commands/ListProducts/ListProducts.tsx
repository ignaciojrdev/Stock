import { useState, useEffect } from 'react';
import "./ListProducts.scss";
import axios from 'axios';
import { Product } from '../../../utils/Interfaces/Product';
import LoadingSpinner from '../../../utils/Modais/Loading/LoadingSpinner/LoadingSpinner.tsx';
import { notifyInfo, notifyError, notifySuccess } from '../../../utils/Modais/Toast/Toasts.tsx';

function ListProducts() {

  const urlBackendStock = process.env.BACKEND_STOCK || 'http://localhost:3201/';
  const serviceBackendStockSalesProduct = process.env.BACKEND_SALES_PRODUCT || 'Stock/Product/';
  const serviceBackendStockSalesMovement = process.env.BACKEND_SALES_MOVEMENT || 'Stock/Movement/';

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getCommandId = () => {
    let command_url = window.location.href;
    return Number(command_url.split('/')[5]);
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [productsSelected, setProductsSelected] = useState<Product[]>([]);

  useEffect(() => {
    showProductsRegistered();
  }, []);

  const showProductsRegistered = async () => {
    fillProducts(await fetchProducts());
  }

  const fetchProducts = async () => {
    let response = await axios.get(urlBackendStock+serviceBackendStockSalesProduct, {});
    let products = response.data;
    return products;
  }

  const fillProducts = (products: Product[]) => {
    setProducts(products);
  }

  const putProductsOnCommand = async () => {
    if(productsSelected.length == 0){
      return notifyInfo('Selecione ao menos um produto!');
    }

    let productWithoutQuantity = productsSelected.findIndex(product => {return product.stock == undefined || product.stock == 0})
    if(String(productWithoutQuantity) != '-1'){
      return notifyInfo('O produto ' + productsSelected[productWithoutQuantity].name + ' não tem quantidade definida.');
    }
    let productsSelectedUpdated: Product[] = await putCommandInfoIntoProducts(productsSelected);
    try{
      await putProducts(productsSelectedUpdated);
      cleanFields();
      notifySuccess(`Os produtos foram adicionados na comanda com sucesso!`);
    }catch(error: any){
      if(error.response.data.movementationsErrors){
        return error.response.data.movementationsErrors.forEach((movementations: string) => {
          notifyError('Ocorreram erros ao tentar salvar os produtos: ' + movementations);
        })
      }
      notifyError('Ocorreram erros ao tentar salvar os produtos: ' + error.response.data.message + " " + error.response.data.error);
    }finally{
      setIsLoading(false);
    }
  }

  const cleanFields = () => {
    setProductsSelected([]);

    // Reseta a quantidade de todos os produtos
    setProducts((prev) =>
      prev.map((product) => ({
        ...product,
        stock: 0, // Define o valor de stock como 0
      }))
    );

    window.location.reload()
  }

  const putCommandInfoIntoProducts = async(productsSelected: Product[]): Promise<Product[]> => {
    productsSelected.forEach(productSelected => {
      productSelected.command = String(getCommandId());
    })
    return productsSelected
  }

  const putProducts = async(productsSelected: Product[]): Promise<void> => {
    await axios.post(urlBackendStock+serviceBackendStockSalesMovement, productsSelected);
  }

  const putQuantityOnProduct = (productId: number, stock: number) => {
    setProducts((prev) =>
      prev.map((product) =>{
        if(product.id === productId){
          let productUpdated = { ...product, stock };
          updateProductSelected(productUpdated);
          return productUpdated;
        }

        return product;
      }
      )
    );
  };

  const updateProductSelected = (productUpdated: Product) => {
    let wasSelectedIndex = productsSelected.findIndex(product => {
      return product.id === productUpdated.id;
    })

    if(String(wasSelectedIndex) == '-1'){
      return;
    }else{
      //productsSelected[wasSelectedIndex] = productUpdated; // atualiza o produto que recebeu o valor na lista
      setProductsSelected((prev) => prev.map((product) => product.id === productUpdated.id ? productUpdated : product));
    }
  }

  const setNewSelectedProductsOnChange = (productSelected: Product) => {
    let wasSelectedIndex = productsSelected.findIndex(product => {
      return product.id === productSelected.id;
    })
    if(String(wasSelectedIndex) == '-1'){
      setProductsSelected((prev) =>
        [...prev, productSelected]
      )
    }else{
      setProductsSelected((prev) => prev.filter((product) => product.id !== productSelected.id)); // remove o produto que foi desmarcado na lista
    }
  }

  return (
  <>
    <div className='centering-titles'>
      <h1>Comanda</h1>
    </div>
    <hr></hr> 
    <div className='container-list-products'>
      {
        products.length == 0 ?
          <div className='list-products comanda-vazia'>
            <h2>Não existem produtos cadastrados no sistema. Vá até a Estoque/cadastro de produtos e insira um registro.</h2>
          </div>
          :
          <div className='list-products'>
            <table>
              <thead>
                <tr>
                  <th>Selecione</th>
                  <th>#</th>
                  <th>Nome</th>
                  <th>Vr. Unitário (R$)</th>
                  <th>Quantidade</th>
                </tr>
              </thead>
              <tbody>
              {products.map((product, index) => (
                <tr key={`${product.id}`}>
                  <td><input type="checkbox" onChange={() => {setNewSelectedProductsOnChange(product)}}/></td>
                  <td>{index+1}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td><input type="number" min={0} onChange={(e) => putQuantityOnProduct(product.id, parseInt(e.target.value || "0", 10))}/></td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
      }
      <div className='list-command-products-actions'>
        <div className='centering-titles'>
          <h2>Ações</h2>
        </div>
        <div className='centering-button'>
          <button className='list-command-products-actions-button buttonHover' onClick={putProductsOnCommand}>Salvar produtos</button>
        </div>
      </div>
    </div>
    <LoadingSpinner  isLoading={isLoading} />
  </>
  )
}

export default ListProducts