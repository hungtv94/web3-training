import { useEffect, useRef, useState } from 'react';
import './App.css';
import BN from 'bignumber.js';
import { connectMetamask, getBalanceETH, getBalanceWETH, getChainName, depositETH, withdrawETH } from './utils/common';

function App() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [balanceETH, setBalanceETH] = useState();
  const [balanceWETH, setBalanceWETH] = useState();
  const [network, setNetwork] = useState();
  const [needUpdate, setNeedUpdate] = useState(false);

  const depositAmountRef = useRef('');
  const withdrawAmountRef = useRef('');

  const handleConnect = async () => {
    try {
      const accounts = await connectMetamask();
      setAddress(accounts[0]);
    } catch (error) {
      console.log(error);
    }
    setConnected(true);
  };

  useEffect(() => {
    if (address) {
      getBalanceETH(address)
        .then(setBalanceETH)
        .catch((error) => {
          console.log(error);
        });
      getBalanceWETH(address)
        .then(setBalanceWETH)
        .catch((error) => {
          console.log(error);
        });
      getChainName()
        .then(setNetwork)
        .catch((error) => {
          console.log(error);
        });
    }
  }, [address, needUpdate]);

  const deposit = async () => {
    const value = depositAmountRef.current.value;
    if (!value) return;
    if (isNaN(Number(value))) return;
    try {
      await depositETH(address, new BN(value).toString());
      alert('Successfully Deposit');
      setNeedUpdate(!needUpdate);
    } catch (error) {
      console.log(error);
    }
  };

  const withdraw = async () => {
    const value = withdrawAmountRef.current.value;
    console.log(value);
    if (!value) return;
    if (isNaN(Number(value))) return;
    try {
      await withdrawETH(address, new BN(value).toString());
      alert('Successfully Withdraw');
      setNeedUpdate(!needUpdate);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      {connected ? (
        <div>
          <p>Account: {address}</p>
          <p>ETH Balance: {balanceETH}</p>
          <p>WETH Balance: {balanceWETH}</p>
          <p>NetWork: {network}</p>
          <input placeholder="input amount here" ref={depositAmountRef}></input>
          <button onClick={() => deposit()}>Deposit ETH</button>
          <br />
          <input placeholder="input amount here" ref={withdrawAmountRef}></input>
          <button onClick={() => withdraw()}>Withdraw ETH</button>
        </div>
      ) : (
        <div>
          <button onClick={handleConnect}>Connect with metamask</button>
        </div>
      )}
    </div>
  );
}

export default App;
