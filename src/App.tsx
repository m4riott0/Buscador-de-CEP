import AddressForm from './components/AddressForm';
import AddressList from './components/AddressList';
import { useAddressStorage } from './hooks/useAddressStorage';
import { MapPin } from 'lucide-react';

function App() {
  const { savedAddresses, saveAddress, removeAddress } = useAddressStorage();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center gap-2">
          <MapPin size={24} />
          <h1 className="text-2xl font-bold">Consulta de Endereços</h1>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center space-y-8">
          <AddressForm onSaveAddress={saveAddress} />
          
          <div className="w-full max-w-2xl">
            <AddressList 
              addresses={savedAddresses} 
              onRemoveAddress={removeAddress}
              title="Endereços Salvos"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;