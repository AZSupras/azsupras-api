/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IResponse<T = any> {
  statusCode: number;
  message: string;
  count?: number;
  data: T;
}
