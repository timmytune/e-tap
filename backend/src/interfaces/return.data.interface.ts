export interface ReturnData<T> {
    message: string;
    data?: T;
    statusCode?: string
    error?: string;
    count?: number,
    skip?: number,
    limit?: number
  }