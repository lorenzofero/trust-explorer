import fetch from "cross-fetch";

import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { gql } from "@apollo/client";

// This is the Apollo graphQL client config object
const Client = () =>
  new ApolloClient({
    link: new HttpLink({
      uri: "https://api.thegraph.com/subgraphs/name/albygiaco/eth-paris",
      fetch,
    }),
    cache: new InMemoryCache(),
  });
type AttestedsQueryResult = {
  attester: string;
  id: string;
  recipient: string;
  uid: string;
};

export const useGraph = () => {
  const queryAttestation = async (
    contract: string
  ): Promise<AttestedsQueryResult[]> => {
    const itemToQuery = 1000;

    const query = gql`
      {
        attesteds(where: {recipient: "${contract}"}) {
          id
          recipient
          attester
          uid
        }
      }
    `;
    const response = (await Client().query({
      query,
    })) as any;

    return response.data.attesteds;
  };

  return {
    queryAttestation,
  };
};
