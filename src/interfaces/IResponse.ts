/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IResponseWithRelation<T = any> extends IResponse {
  count?: number;
  data?: T;
}

export interface IResponse {
  statusCode: number;
  message: string;
}