import './App.css';
import * as React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { PayWithCrypto } from './routes/payWithCrypto';
import { PaymentStatus } from './routes/paymentStatus';
import { Metamask } from './routes/metamask';



function CloseButton() {

  let closeWindow = function () {
    console.log('about to close!')
    window.close()
    window.top.postMessage({
      success: true,
      msg: 'close',
    }, "*")
  }
  
  return (
    <div className='z-999 absolute top-0 right-0'>
      <button className='text-gray-200 px-4 py-2 text-lg' onClick={closeWindow}>x</button>
    </div>
  )
}

function App() {

  return (
    <div class="lg:container relative mx-auto flex flex-col w-full lg:w-96 min-h-screen bg-gray-100 rounded-xl">
      <CloseButton/>
      <Routes>
        <Route path="/paymentStatus" element={<PaymentStatus />} />
        <Route path="/" element={<PayWithCrypto />} />
        <Route path="/metamask" element={<Metamask />} />
      </Routes>
    </div>
  );
}

export default App;
