import './App.css';
import * as React from "react";
import { Routes, Route, Link } from "react-router-dom";
import {PayWithCrypto} from './routes/payWithCrypto';
import {PaymentStatus} from './routes/paymentStatus';
import {Metamask} from './routes/metamask';

function App() {
  return (
    <div class="lg:container mx-auto flex flex-col w-full lg:w-96 h-screen rounded-xl">
      <Routes>
        <Route path="/paymentStatus" element={<PaymentStatus/>}/>
        <Route path="/" element={<PayWithCrypto/>}/>
        <Route path="/metamask" element={<Metamask/>}/>
      </Routes>
    </div>
  );
}

export default App;
