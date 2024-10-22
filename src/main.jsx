import { createRoot } from 'react-dom/client';
import axios from 'axios';
import App from './App.jsx';
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store/store';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

const queryClient = new QueryClient();

let authToken = JSON.parse(localStorage.getItem('authToken'));
console.log(authToken,'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaau');
axios.interceptors.request.use((request) => {
  const { auth } = store.getState();
  if (auth.authToken) {
    console.log(auth.authToken,'oooooooooooooooooooooooooo');
    request.headers.Authorization = `Bearer ${auth.authToken}`;
  }
  return request;
}, (error) => {
  return Promise.reject(error);
});
createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="803855273476-a4v1im9l3mtvpm7krhrbj88osuh6r1mp.apps.googleusercontent.com">
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </QueryClientProvider>
  </GoogleOAuthProvider>
);
