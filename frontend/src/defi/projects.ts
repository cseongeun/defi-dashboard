import 'dotenv/config';

interface IPlatform {
  [id: number]: {
    name: string;
    subName: string;
    chainId: number;
    symbol: string;
  };
}

export interface IProject {
  [id: number]: {
    name: string;
    platform: IPlatform;
    status: number;
  };
}

export const Platform: IPlatform = {
  1: {
    name: 'Ethereum',
    subName: 'Mainnet',
    chainId: 1,
    symbol: 'ETH',
  },
};

export const Project: IProject = {
  1: {
    name: 'Uniswap-V2',
    platform: Platform[1],
    status: 1,
  },
  2: {
    name: 'Uniswap-V3',
    platform: Platform[2],
    status: 1,
  },
};

export abstract class Base {
  provider: any;
  project: IProject;

  constructor({ provider, project }: { provider: any; project: IProject }) {
    this.provider = provider;
    this.project = project;
  }

  getProject(): IProject {
    return this.project;
  }
}
