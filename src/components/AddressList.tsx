import React from 'react';
import { Address } from '../types';
import { Trash2 } from 'lucide-react';

interface AddressListProps {
  addresses: Address[];
  onRemoveAddress: (id: string) => void;
  title: string;
}

const AddressList: React.FC<AddressListProps> = ({ addresses, onRemoveAddress, title }) => {
  if (addresses.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
        <p className="text-gray-500">Nenhum endereço salvo.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
      
      <div className="space-y-4">
        {addresses.map((address) => (
          <div 
            key={address.id} 
            className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-800">
                  {address.logradouro}
                  {address.complemento && `, ${address.complemento}`}
                </p>
                <p className="text-gray-600">
                  {address.bairro && `${address.bairro}, `}
                  {address.localidade} - {address.uf}
                </p>
                <p className="text-gray-500 text-sm mt-1">CEP: {address.cep}</p>
              </div>
              
              <button
                onClick={() => onRemoveAddress(address.id || '')}
                className="text-red-500 hover:text-red-700 focus:outline-none"
                title="Remover endereço"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressList;