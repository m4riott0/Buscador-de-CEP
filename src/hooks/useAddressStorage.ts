import { useState } from 'react';
import { Address } from '../types';
import useLocalStorage from './useLocalStorage';

export const useAddressStorage = () => {

  const [savedAddresses, setSavedAddresses] = useLocalStorage<Address[]>('saved-addresses', []);
  
  const [sessionAddresses, setSessionAddresses] = useState<Address[]>(() => {
    try {
      const sessionData = sessionStorage.getItem('session-addresses');
      return sessionData ? JSON.parse(sessionData) : [];
    } catch (error) {
      console.error('Error reading from sessionStorage:', error);
      return [];
    }
  });

  const saveAddress = (address: Address) => {

    const addressWithId = {
      ...address,
      id: `${address.cep}-${Date.now()}`
    };

    setSavedAddresses(prev => [...prev, addressWithId]);
    
    const updatedSessionAddresses = [...sessionAddresses, addressWithId];
    setSessionAddresses(updatedSessionAddresses);
    sessionStorage.setItem('session-addresses', JSON.stringify(updatedSessionAddresses));
  };

  const removeAddress = (id: string) => {

    setSavedAddresses(prev => prev.filter(address => address.id !== id));
    
    const updatedSessionAddresses = sessionAddresses.filter(address => address.id !== id);
    setSessionAddresses(updatedSessionAddresses);
    sessionStorage.setItem('session-addresses', JSON.stringify(updatedSessionAddresses));
  };

  return {
    savedAddresses,
    sessionAddresses,
    saveAddress,
    removeAddress
  };
};