export class ApiResponse<T = object> {
  data?: T | null = null;
  statusCode?: number = 200;
  message?: string = 'OK';

  constructor(params: ApiResponse<T>) {
    Object.assign(this, params);
  }
}
