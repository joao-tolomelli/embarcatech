import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { PrimeReactProvider } from "primereact/api";
import Tailwind from 'primereact/passthrough/tailwind';

import 'primeicons/primeicons.css';

const value = {
  unstyled: true, // Ativa o modo sem CSS
  pt: Tailwind    // Aplica o Preset "Lara" feito com classes Tailwind
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <PrimeReactProvider value={value}>
      <App />
    </PrimeReactProvider>
)