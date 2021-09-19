import Web3 from 'web3';
import abi from './abi.json';

const HTTPS_ENDPOINT = 'https://mainnet.infura.io/v3/de5a745b3c5a4a458c9c8809863c046d';
const CONTRACT_ADDRESS = '0xc778417e063141139fce010982780140aa0cd5ab';
// const WS_ENDPOINT = 'wss://mainnet.infura.io/ws/v3/de5a745b3c5a4a458c9c8809863c046d';
const CONTRACT_ABI = JSON.parse(abi.result);

const getWeb3 = () => {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    return web3;
  } else if (window.web3) {
    const web3 = window.web3;
    console.log('Injected web3 detected.');
    return web3;
  }
  // Fallback to localhost; use dev console port by default...
  else {
    const provider = new Web3.providers.HttpProvider(HTTPS_ENDPOINT);
    const web3 = new Web3(provider);
    console.log('No web3 instance injected, using infura web3.');
    return web3;
  }
};

export const web3 = getWeb3();
export const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

export const connectMetamask = () => {
  try {
    const res = window.ethereum.request({ method: 'eth_requestAccounts' });
    return res;
  } catch (error) {
    throw error;
  }
};

export const getAddress = () => web3.currentProvider.selectedAddress;
export const getChainName = async () => {
  try {
    return await web3.eth.net.getNetworkType();
  } catch (error) {
    throw error;
  }
};

export const getBalanceETH = async (address) => {
  try {
    return Number(await web3.eth.getBalance(address)) / Math.pow(10, 18);
  } catch (err) {
    throw err;
  }
};

export const getBalanceWETH = async (address) => {
  try {
    return Number(await contract.methods.balanceOf(address).call()) / Math.pow(10, 18);
  } catch (error) {
    throw error;
  }
};

export const depositETH = async (address, value) => {
  try {
    return await contract.methods.deposit().send({ from: address, value });
  } catch (error) {
    throw error;
  }
};

export const withdrawETH = async (address, value) => {
  try {
    return await contract.methods.withdraw(value).send({ from: address });
  } catch (error) {
    throw error;
  }
};
