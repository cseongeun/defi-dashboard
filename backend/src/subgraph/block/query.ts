export const BlockNumberQuery = `
{
  blocks(first: 1, orderBy: timestamp, orderDirection: desc) {
    id
    number
    timestamp
  }
}
`;
