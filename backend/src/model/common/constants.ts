import { IStatus, ITokenType, IRPCType } from './interface';

export const STATUS: IStatus = {
  ACTIVATE: 'ACTIVATE',
  DEACTIVATE: 'DEACTIVATE',
};

export const TokenType: ITokenType = {
  SINGLE: 'SINGLE',
  MULTI: 'MULTI',
};
export const RPCType: IRPCType = {
  OCTET: 'OCTET',
  PUBLIC: 'PUBLIC',
};
