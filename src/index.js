import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'

import { Web3ReactProvider } from '@web3-react/core'
import { MetaMaskProvider } from './hooks/metamask'
import { Web3Provider } from "@ethersproject/providers";

import 'bootstrap/dist/css/bootstrap.min.css'

function getLibrary(provider, connector) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 8000;
  return library;
}

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <MetaMaskProvider>
        <App />
      </MetaMaskProvider>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
