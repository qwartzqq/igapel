import './polyfills';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import App from './App.tsx';
import { NotificationProvider } from './components/Notifications';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TonConnectUIProvider manifestUrl="/tonconnect-manifest.json">
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </TonConnectUIProvider>
  </StrictMode>,
);
