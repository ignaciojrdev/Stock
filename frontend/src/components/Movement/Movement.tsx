import { useEffect, useState } from 'react';
import "./Movement.scss";
import MovementModal from './NewMovement/NewMovement.tsx';
import LoadingSpinner from '../../utils/Modais/Loading/LoadingSpinner/LoadingSpinner.tsx';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { notifySuccess } from '../../utils/Modais/Toast/Toasts.tsx';
import { notifyError } from '../../utils/Modais/Toast/Toasts.tsx';
import axios from 'axios';
import { Movement } from '../../utils/Interfaces/Movement.tsx';

function Movements() {
    const url = process.env.BACKEND_STOCK || 'http://localhost:3201/';
    const service = process.env.BACKEND_SALES_MOVEMENT || 'Stock/Movement/'

    const [isModalCadastroMovimentacaoOpen, setisModalCadastroMovimentacaoOpen] = useState<boolean>(false);

    const [productId, setProductId] = useState<number>(0);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [movements, setMovements] = useState<Movement[]>([]);

    const [balance, setBalance] = useState<number>(0);

    const [totalOut, setTotalOut] = useState<number>(0);

    const [totalIn, setTotalIn] = useState<number>(0);

    const onCloseModalCadastroMovimentacao = () => {
      setisModalCadastroMovimentacaoOpen(false);
    }

    const isEmpty = (data: Array<any>): boolean => {
      return data.length == 0;
    }

    useEffect(() => {
        saveProductId();
        showMovementRegistered();
    }, []);

    const saveProductId = async () => {
        let movement_url = window.location.href;
        setProductId(Number(movement_url.split('/')[6]));
    };
    
    const showMovementRegistered = async() => {
        setIsLoading(true);
        try{
            await getMovementRegistered();
        }catch(error: any){
            notifyError(error.response.data.message + " " + error.response.data.error);
        }finally{
            setIsLoading(false);
        }
    };

    const getMovementRegistered = async () => {
        let movement_url = window.location.href;
        let response = await axios.get(url+service, {
            params: {
                product: Number(movement_url.split('/')[6])
            }
        });
        let movements = response.data;
        setMovements(movements);
        calculateBalance(movements);
        if(isEmpty(movements))
          setisModalCadastroMovimentacaoOpen(true)
    };

    const calculateBalance = (movements: Movement[]) => {
      let totOut = 0; 
      let totIn = 0; 
      let diff = 0;

      movements.forEach(moviment => {
        if(moviment.type == 'IN'){
          totIn += moviment.quantity;
        }else{
          totOut += moviment.quantity;
        }
      });

      diff = totIn - totOut;

      setBalance(diff) 
      setTotalOut(totOut) 
      setTotalIn(totIn)
    }

    return (
    <>    
        <div className='centering-titles'>
            <h1>Movimentações do estoque</h1>
        </div>
        <hr></hr> 
        <div className='container-list-movement'>
        {
            !isEmpty(movements) ? 
            <div>
              <div className='list-movement'>
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Produto</th>
                      <th>Quantidade</th>
                      <th>Tipo</th>
                      <th>Comanda</th>
                      <th>Criado em</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movements.map((movement, index) => (
                        <tr key={`${movement.id}`}>
                          <td>{index+1+' '} 
                              { movement.type == 'IN' ? 
                                <FontAwesomeIcon icon={faArrowDown} style={{ color: 'green' }}/> 
                                : <FontAwesomeIcon icon={faArrowUp} style={{ color: 'red' }}/> 
                              }</td>
                          <td>{ (typeof movement.product === 'object' && 'name' in movement.product) ? movement.product.name : ''}</td>
                          <td>{movement.quantity}</td>
                          <td>{movement.type == 'IN' ? 'Entrada' : 'Saída'}</td>
                          <td>{movement.command || '-'}</td>
                          <td>{movement.createdAt}</td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="product-summary">
                <div className="summary-item">
                  <span className="label">Total de Entradas:</span>
                  <span className="value in">{totalIn}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Total de Saídas:</span>
                  <span className="value out">{totalOut}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Saldo:</span>
                  <span className={`value balance ${balance >= 0 ? "positive" : "negative"}`}>
                    {balance}
                  </span>
                </div>
              </div>
            </div>
          :
            <div className='list-movement products-empty'>
              <h3>Não existem movimentações para o produto.</h3>
            </div>  
        }
        
        <MovementModal 
          isOpen={isModalCadastroMovimentacaoOpen}
          productId={productId}
          onCloseModal={onCloseModalCadastroMovimentacao}
        />
      </div>
      <LoadingSpinner  isLoading={isLoading} />
    </>
  );
}

export default Movements;