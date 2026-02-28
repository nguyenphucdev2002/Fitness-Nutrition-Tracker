export type ApiReponseType<T> = {
  data: T;
  headers: any;
  status: number;
  statusText: string;
  config: any;
  request: any;
};
