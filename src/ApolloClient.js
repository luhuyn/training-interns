import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.dev.buildingtenant.masflex.vn/graphql',
  headers:{
    "Accept": "application/json",
  },
  cache: new InMemoryCache(),
});

export default client;
