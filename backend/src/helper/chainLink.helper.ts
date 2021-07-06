import { ethers } from 'ethers';
import { Provider } from '@ethersproject/providers';

export const getPrice = async (provider: Provider, feedAddress: string) => {
  const { 1: answer } = await new ethers.Contract(feedAddress, AGGREGATOR_V3_ABI, provider).latestRoundData();
  return answer;
};

const AGGREGATOR_V3_ABI = [
  {
    inputs: [],
    name: 'latestRoundData',
    outputs: [
      { internalType: 'uint80', name: 'roundId', type: 'uint80' },
      { internalType: 'int256', name: 'answer', type: 'int256' },
      { internalType: 'uint256', name: 'startedAt', type: 'uint256' },
      { internalType: 'uint256', name: 'updatedAt', type: 'uint256' },
      { internalType: 'uint80', name: 'answeredInRound', type: 'uint80' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
