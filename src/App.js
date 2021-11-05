import './App.css';
import * as React from "react";
import { Switch, Route, Link } from "react-router-dom";
import PayWithCrypto from './routes/payWithCrypto';
import PaymentStatus from './routes/paymentStatus';

function App() {
  return (
    <div class="">
      <Switch>
        <Route path="/paymentStatus" component={PaymentStatus}>
        </Route>
        <Route path="/">
          <PayWithCrypto />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
