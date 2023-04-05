export enum TCP_Action {
  UPDATE = 'UPDATE',
  CREATE = 'CREATE',
  DELETE = 'DELETE',
}

export enum USER {
  USER = 'USER',
  APP = 'APP',
}

export interface TransportAction<T> {
  action: TCP_Action;
  data?: T;
}

export interface WalletResponse<T> {
  status: number;
  data: T;
}

export enum RequestContentType {
  FORM_URLENCODED = 'application/x-www-form-urlencoded',
  FORM_DATA = 'multipart/form-data',
  JSON = 'application/json',
}

export enum GRANT_TYPE {
  CLIENT_CREDENTIALS = 'client_credentials',
}

export interface TokenInterface {
  access_token: string;
  token_type: string;
  expires_in: string;
  type: USER;
}

export interface TokenVerifyResponse {
  active: boolean;
  iat: number;
  exp: number;
}

export interface UserInfoResponse {
  email: string;
  firstName: string;
  lastName: string;
  sub: string;
  app: string;
  iat: number;
  exp: number;
}

export interface PaginatedRequestResponse<T> {
  count: number;
  next: string;
  previous: string;
  data: T[];
}
