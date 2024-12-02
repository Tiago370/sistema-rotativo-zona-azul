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
        Register Parking
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
      <h2 className="text-2xl mb-4">Parking Registration</h2>
      
      <div className="mb-4">
        <label className="block mb-2">License Plate</label>
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
        <label className="block mb-2">Parking Duration</label>
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
        <label className="block mb-2">Payment Method</label>
        <select 
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full px-3 py-2 border rounded text-black"
        >
          <option value="" className="text-black">Select Payment Method</option>
          <option value="credit" className="text-black">Credit/Debit Card</option>
          <option value="pix" className="text-black">PIX</option>
        </select>
      </div>

      <div className="mb-4 font-bold text-black">
        Total Cost: R${duration ? parkingRates[duration] : 0}
      </div>

      <button 
        onClick={handleConfirmRegistration}
        disabled={!licensePlate || !duration || !paymentMethod}
        className="w-full bg-blue-500 text-black py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        Confirm Registration
      </button>
    </div>
  );

  const renderPaymentInterface = () => (
    <div className="flex flex-col items-center justify-center h-screen text-black">
      <p className="text-xl mb-4">Proceed to complete your payment</p>
      <button 
        onClick={() => setCurrentInterface('confirmation')}
        className="bg-green-500 text-black px-6 py-3 rounded-lg hover:bg-green-600"
      >
        Proceed to Payment
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
        <h2 className="text-2xl mb-4">Parking Registration Confirmation</h2>
  
        <div className="grid grid-cols-2 gap-4">
          <div className="font-semibold">License Plate:</div>
          <div>{transactionDetails.licensePlate}</div>
  
          <div className="font-semibold">Registration Time:</div>
          <div>{format(now, 'yyyy-MM-dd HH:mm:ss')}</div>
  
          <div className="font-semibold">Expiration Time:</div>
          <div>{format(expirationTime, 'yyyy-MM-dd HH:mm:ss')}</div>
  
          <div className="font-semibold">Duration:</div>
          <div>{transactionDetails.duration}</div>
  
          <div className="font-semibold">Payment Method:</div>
          <div>{transactionDetails.paymentMethod}</div>
  
          <div className="font-semibold">Total Fee:</div>
          <div>R${transactionDetails.totalCost}</div>
        </div>
  
        <button
          onClick={handlePrintReceipt}
          className="w-full mt-4 bg-blue-500 text-black py-2 rounded hover:bg-blue-600"
        >
          Print Receipt
        </button>
  
        <button
          onClick={() => setCurrentInterface('main')}
          className="w-full mt-4 bg-gray-500 text-black py-2 rounded hover:bg-gray-600"
        >
          Back to Home
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