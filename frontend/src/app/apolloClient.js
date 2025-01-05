import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', // Update with your backend URL
  cache: new InMemoryCache(),
});

export default client;
