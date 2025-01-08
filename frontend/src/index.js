import React from 'react';
import ReactDOM from 'react-dom/client'; // Use the correct import for ReactDOM.createRoot
import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';
import store from './app/store';
import client from './app/apolloClient';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // Create the root
root.render(
  <ApolloProvider client={client}>
  <React.StrictMode>
    <Provider store={store}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </Provider>
  </React.StrictMode>
  </ApolloProvider>
);
