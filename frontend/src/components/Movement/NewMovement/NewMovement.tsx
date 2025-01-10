import React, { useState, useEffect } from 'react';
import './NewMovement.scss';
import { Movement } from '../../../utils/Interfaces/Movement';
import axios from 'axios';
import LoadingSpinner from '../../../utils/Modais/Loading/LoadingSpinner/LoadingSpinner.tsx';
import { notifyInfo, notifyError, notifySuccess } from '../../../utils/Modais/Toast/Toasts.tsx';
// Definindo o tipo do produto

// Props do Modal
interface MovementModalProps {
  isOpen: boolean;
  productId: string | number;
  onCloseModal: () => void;
}

const MovementModal: React.FC<MovementModalProps> = ({ isOpen, productId, onCloseModal }) => {
  const urlBackendStock = process.env.BACKEND_STOCK || 'http://localhost:3201/';
  const serviceBackendStockSalesMovement = process.env.BACKEND_SALES_MOVEMENT || 'Stock/Movement/';
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<Movement>({
    quantity: 0,
    type: "IN",
    product: Number(productId), // Inicializado com productId
  });

  useEffect(() => {
    console.log("ProductId recebido:", productId); // Log para verificar
    setFormData((prev) => ({ ...prev, product: Number(productId) }));
  }, [productId]); // Atualiza quando productId muda

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === "product" ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Enviando formData:", formData); // Log para verificar antes do envio
    try {
      await putMovement(formData);
      setFormData({ quantity: 0, type: "IN", product: Number(productId) }); // Reseta o formulário
      notifySuccess("Movimentação criada com sucesso");
      window.location.reload()
      onCloseModal();
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
  };

  const putMovement = async (newMovement: Movement) => {
    await axios.post(urlBackendStock + serviceBackendStockSalesMovement, newMovement);
  }

  if (!isOpen) return null;

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h2>Cadastrar Movimentação</h2>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label htmlFor="quantity">Quantidade</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min={0}
              required
            />
          </div>
          <div className="formGroup">
            <label htmlFor="type">Tipo</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="IN">Entrada</option>
              <option value="OUT">Saída</option>
            </select>
          </div>
          <div className="buttons">
            <button type="button" onClick={onCloseModal} className="cancelButton">
              Cancelar
            </button>
            <button type="submit" className="saveButton">
              Salvar
            </button>
          </div>
        </form>
      </div>
      <LoadingSpinner isLoading={isLoading} />
    </div>
  );
};
export default MovementModal;