import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from '@/src/core/App';
import '@/src/core/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
