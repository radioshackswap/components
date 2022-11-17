import { ChainId } from '@radioshackswap/sdk2';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { GraphQLClient } from 'graphql-request';
import { SUBGRAPH_BASE_URL } from 'src/constants';

export const client = new ApolloClient({
  link: new HttpLink({
    uri: `${SUBGRAPH_BASE_URL}/exchange`,
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
});

export const blockClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/radioshackcreator/blocks-avalanche',
  }),
  cache: new InMemoryCache(),
});
