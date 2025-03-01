import { Address } from '../types';

const addressCache: Record<string, Address> = {};

export const fetchAddressByCep = async (cep: string): Promise<Address> => {

  const cleanCep = cep.replace(/\D/g, '');
  
  if (addressCache[cleanCep]) {
    console.log('Using cached address data for CEP:', cleanCep);
    return addressCache[cleanCep];
  }
  
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch address');
    }
    
    const data = await response.json();
    
    if (data.erro) {
      throw new Error('CEP not found');
    }
    
    addressCache[cleanCep] = data;
    
    return data;
  } catch (error) {
    console.error('Error fetching address:', error);
    throw error;
  }
};