import React, { useState, useEffect } from 'react';
import './NewProduct.scss';
import { Product } from '../../../utils/Interfaces/Product';
// Definindo o tipo do produto

// Props do Modal
interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  product?: Product | null; // Produto opcional para edição
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSave, product }) => {
  const [formData, setFormData] = useState<Product>({
    id: 0,
    name: '',
    description: '',
    price: 0
  });

  // Preencher os campos se houver um produto
  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        id: 0,
        name: '',
        description: '',
        price: 0
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h2>{product ? 'Editar Produto' : 'Cadastrar Produto'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className='formGroup'>
            <label htmlFor="description">Descrição</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className='formGroup'>
            <label htmlFor="price">Preço</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className='buttons'>
            <button type="button" onClick={onClose} className='cancelButton'>
              Cancelar
            </button>
            <button type="submit" className='saveButton'>
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;