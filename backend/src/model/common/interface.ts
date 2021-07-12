export interface IStatus {
  ACTIVATE: string;
  DEACTIVATE: string;
}

export interface ITime {
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITokenType {
  SINGLE: string;
  MULTI: string;
}

export interface IRPCType {
  OCTET: string;
  PUBLIC: string;
}
