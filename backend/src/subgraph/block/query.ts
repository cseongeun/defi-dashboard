import { gql } from '@apollo/client';

export const BlockNumberQuery = gql`
  query blockNumber {
    blocks(first: 1) {
      id
      number
      timestamp
    }
  }
`;
