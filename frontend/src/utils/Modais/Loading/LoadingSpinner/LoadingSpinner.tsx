import React from 'react';
import './LoadingSpinner.scss';

interface LoadingModalProps {
  isLoading: boolean;
}

const LoadingSpinner: React.FC<LoadingModalProps> = ({ isLoading }) => {
  if (!isLoading) return null; 

  return (
    <div className="loading-overlay">
      <div className="loading-modal">
        <div className="spinner">
        </div>
        <div className="textInfo">
          <p>Processando...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
