import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/global.css';
import App from './App';
import AuthProvider from './context/AuthContext';
import NotificationProvider from './context/NotificationContext';
import LoaderProvider from './context/LoaderContext';
import {Provider} from 'react-redux';
import store from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <LoaderProvider>
        <NotificationProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </NotificationProvider>
      </LoaderProvider>
    </Provider>
  </React.StrictMode>
);
