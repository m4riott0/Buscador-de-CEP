import React, { useState } from 'react';
import { fetchAddressByCep } from '../services/viaCepService';
import { Address, AddressFormData } from '../types';
import { Search, Save } from 'lucide-react';

interface AddressFormProps {
  onSaveAddress: (address: Address) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ onSaveAddress }) => {
  const initialFormState: AddressFormData = {
    cep: '',
    logradouro: '',
    complemento: '',
    bairro: '',
    localidade: '',
    uf: ''
  };

  const [formData, setFormData] = useState<AddressFormData>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    setError(null);
    setSuccess(null);
  };

  const formatCep = (cep: string) => {

    const numericCep = cep.replace(/\D/g, '');
    
    if (numericCep.length <= 5) {
      return numericCep;
    } else {
      return `${numericCep.slice(0, 5)}-${numericCep.slice(5, 8)}`;
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedCep = formatCep(rawValue);
    
    setFormData(prev => ({ ...prev, cep: formattedCep }));
    setError(null);
    setSuccess(null);
  };

  const handleCepBlur = async () => {
    if (formData.cep.length >= 8) {
      await searchAddress();
    }
  };

  const searchAddress = async () => {
    const cep = formData.cep.replace(/\D/g, '');
    
    if (cep.length !== 8) {
      setError('CEP deve conter 8 dígitos');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const addressData = await fetchAddressByCep(cep);
      setFormData({
        cep: addressData.cep,
        logradouro: addressData.logradouro,
        complemento: addressData.complemento,
        bairro: addressData.bairro,
        localidade: addressData.localidade,
        uf: addressData.uf
      });
      setSuccess('Endereço encontrado com sucesso!');
    } catch (error) {
      setError('CEP não encontrado ou erro na consulta');
      console.error('Error fetching address:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchAddress();
  };

  const handleSaveAddress = () => {

    if (!formData.cep || !formData.logradouro || !formData.localidade || !formData.uf) {
      setError('Preencha os campos obrigatórios');
      return;
    }

    onSaveAddress(formData as Address);
    setSuccess('Endereço salvo com sucesso!');
    
    setTimeout(() => {
      setFormData(initialFormState);
      setSuccess(null);
    }, 2000);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Consulta de Endereço</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-1">
              CEP *
            </label>
            <div className="relative">
              <input
                type="text"
                id="cep"
                name="cep"
                value={formData.cep}
                onChange={handleCepChange}
                onBlur={handleCepBlur}
                placeholder="00000-000"
                maxLength={9}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
                title="Buscar CEP"
              >
                <Search size={20} />
              </button>
            </div>
          </div>
          
          <div className="flex-1">
            <label htmlFor="uf" className="block text-sm font-medium text-gray-700 mb-1">
              UF *
            </label>
            <input
              type="text"
              id="uf"
              name="uf"
              value={formData.uf}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              readOnly
            />
          </div>
        </div>

        <div>
          <label htmlFor="logradouro" className="block text-sm font-medium text-gray-700 mb-1">
            Logradouro *
          </label>
          <input
            type="text"
            id="logradouro"
            name="logradouro"
            value={formData.logradouro}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            readOnly
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="complemento" className="block text-sm font-medium text-gray-700 mb-1">
              Complemento
            </label>
            <input
              type="text"
              id="complemento"
              name="complemento"
              value={formData.complemento}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex-1">
            <label htmlFor="bairro" className="block text-sm font-medium text-gray-700 mb-1">
              Bairro
            </label>
            <input
              type="text"
              id="bairro"
              name="bairro"
              value={formData.bairro}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              readOnly
            />
          </div>
        </div>

        <div>
          <label htmlFor="localidade" className="block text-sm font-medium text-gray-700 mb-1">
            Cidade *
          </label>
          <input
            type="text"
            id="localidade"
            name="localidade"
            value={formData.localidade}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            readOnly
          />
        </div>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-100 text-green-700 rounded-md">
            {success}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSaveAddress}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            Salvar Endereço
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;