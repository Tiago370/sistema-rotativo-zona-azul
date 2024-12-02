import React, { useState } from 'react';
import { format } from 'date-fns';

interface TransactionDetails {
  licensePlate: string;
  duration: string;
  paymentMethod: string;
  totalCost: number;
}

export default function ParkingLicenseApp() {
  const [currentInterface, setCurrentInterface] = useState<'main' | 'registration' | 'payment' | 'confirmation'>('main');
  const [licensePlate, setLicensePlate] = useState('');
  const [duration, setDuration] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);

  const parkingRates: { [key: string]: number } = {
    '1hr': 10,
    '2hr': 18,
    '3hr': 25,
    '4hr': 30
  };

  const renderMainInterface = () => (
    <div className="flex justify-center items-center h-screen">
      <button 
        onClick={() => setCurrentInterface('registration')}
        className="bg-blue-500 text-black px-6 py-3 rounded-lg text-xl hover:bg-blue-600"
      >
        Registrar Estacionamento
      </button>
    </div>
  );

  const handleConfirmRegistration = () => {
    if (licensePlate && duration && paymentMethod) {
      const totalCost = parkingRates[duration];
      setTransactionDetails({
        licensePlate,
        duration,
        paymentMethod,
        totalCost
      });
      setCurrentInterface('payment');
    }
  };

  const renderRegistrationInterface = () => (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-black">
      <h2 className="text-2xl mb-4">Registro de Estacionamento</h2>
      
      <div className="mb-4">
        <label className="block mb-2">Placa do Veículo</label>
        <input 
          type="text" 
          value={licensePlate}
          onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
          className="w-full px-3 py-2 border rounded text-black"
          placeholder="Enter license plate"
          maxLength={8}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Duração do Estacionamento</label>
        <select 
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full px-3 py-2 border rounded text-black"
        >
          <option value="" className="text-black">Select Duration</option>
          {Object.entries(parkingRates).map(([key, price]) => (
            <option key={key} value={key} className="text-black">
              {key} - R${price}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Método de Pagamento</label>
        <select 
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full px-3 py-2 border rounded text-black"
        >
          <option value="" className="text-black">Selecione o Método de Pagamento</option>
          <option value="credit" className="text-black">Cartão de Crédito/Débito</option>
          <option value="pix" className="text-black">PIX</option>
        </select>
      </div>

      <div className="mb-4 font-bold text-black">
        Custo Total: R${duration ? parkingRates[duration] : 0}
      </div>

      <button 
        onClick={handleConfirmRegistration}
        disabled={!licensePlate || !duration || !paymentMethod}
        className="w-full bg-blue-500 text-black py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        Confirmar Registro
      </button>
    </div>
  );

  const renderPaymentInterface = () => (
    <div className="flex flex-col items-center justify-center h-screen text-black">
      <p className="text-xl mb-4">Simulando um pagamento</p>
      <button 
        onClick={() => setCurrentInterface('confirmation')}
        className="bg-green-500 text-black px-6 py-3 rounded-lg hover:bg-green-600"
      >
        Concluído
      </button>
    </div>
  );

  const renderConfirmationInterface = () => {
    if (!transactionDetails) return null;
  
    const now = new Date();
    const expirationTime = new Date(
      now.getTime() + parseInt(transactionDetails.duration) * 60 * 60 * 1000
    );
  
    const handlePrintReceipt = () => {
      window.print();
    };
  
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-black">
        <h2 className="text-2xl mb-4">Registro de Estacionamento</h2>
  
        <div className="grid grid-cols-2 gap-4">
          <div className="font-semibold">Placa do Veículo:</div>
          <div>{transactionDetails.licensePlate}</div>
  
          <div className="font-semibold">Horário de Registro:</div>
          <div>{format(now, 'yyyy-MM-dd HH:mm:ss')}</div>
  
          <div className="font-semibold">Horário de Expiração:</div>
          <div>{format(expirationTime, 'yyyy-MM-dd HH:mm:ss')}</div>
  
          <div className="font-semibold">Duração:</div>
          <div>{transactionDetails.duration}</div>
  
          <div className="font-semibold">Método de Pagamento:</div>
          <div>{transactionDetails.paymentMethod}</div>
  
          <div className="font-semibold">Taxa Total:</div>
          <div>R${transactionDetails.totalCost}</div>
        </div>
  
        <button
          onClick={handlePrintReceipt}
          className="w-full mt-4 bg-blue-500 text-black py-2 rounded hover:bg-blue-600"
        >
          Imprimir Recibo
        </button>
  
        <button
          onClick={() => setCurrentInterface('main')}
          className="w-full mt-4 bg-gray-500 text-black py-2 rounded hover:bg-gray-600"
        >
          Voltar para Início
        </button>
      </div>
    );
  };  

  return (
    <div className="bg-gray-100 min-h-screen text-black">
      {currentInterface === 'main' && renderMainInterface()}
      {currentInterface === 'registration' && renderRegistrationInterface()}
      {currentInterface === 'payment' && renderPaymentInterface()}
      {currentInterface === 'confirmation' && renderConfirmationInterface()}
    </div>
  );
}