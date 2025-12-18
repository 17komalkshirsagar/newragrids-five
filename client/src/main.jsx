import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import reduxStore from './Redux/store/store.js';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter >
      <Provider store={reduxStore}>
        <App />
      </Provider>
    </BrowserRouter>
  </StrictMode>,
)