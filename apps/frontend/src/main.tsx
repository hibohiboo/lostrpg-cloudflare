import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './app/App.tsx';
import { store } from './store';
// Tailwindスタイルをインポート
import './styles/tailwind.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');


createRoot(root).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
