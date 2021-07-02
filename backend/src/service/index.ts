import AbiService from './abi.service';
import TokenService, { TokenAssociations, TokenExtendsAttributes } from './token.service';
import MultiTokenService, { MultiTokenExtendsAttributes, MultiTokenAssociations } from './multiToken.service';
import NetworkService, { NetworkAttributes, NetworkExtendsAttributes } from './network.service';
import SchedulerService, { SchedulerAttributes, SchedulerExtendsAttributes } from './scheduler.service';
import ERC20Service from './erc20.service';
import ChainLinkService from './chainLink.service';
import WalletService from './wallet.service';
import { IStatus, STATUS, ITime, ITokenType, TokenType } from './common.service';

export {
  AbiService,
  TokenService,
  MultiTokenService,
  NetworkService,
  SchedulerService,
  ERC20Service,
  ChainLinkService,
  WalletService,
  TokenAssociations,
  TokenExtendsAttributes,
  MultiTokenAssociations,
  MultiTokenExtendsAttributes,
  NetworkAttributes,
  NetworkExtendsAttributes,
  SchedulerAttributes,
  SchedulerExtendsAttributes,
  IStatus,
  STATUS,
  ITime,
  ITokenType,
  TokenType,
};

export const Services = [
  WalletService,
  AbiService,
  TokenService,
  MultiTokenService,
  NetworkService,
  SchedulerService,
  ERC20Service,
  ChainLinkService,
];
