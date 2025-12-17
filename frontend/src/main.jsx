import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import App from './App.jsx';

const config = {
  initialColorMode: 'light',
  useSystemColorMode: true,
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <ColorModeScript initialColorMode={config.initialColorMode} />
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </>
);
