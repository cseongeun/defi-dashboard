export interface IStatus {
  ACTIVATE: string;
  DEACTIVATE: string;
}

export const STATUS: IStatus = {
  ACTIVATE: 'ACTIVATE',
  DEACTIVATE: 'DEACTIVATE',
};

export interface ITime {
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITokenType {
  SINGLE: string;
  MULTI: string;
}

export const TokenType: ITokenType = {
  SINGLE: 'SINGLE',
  MULTI: 'MULTI',
};
