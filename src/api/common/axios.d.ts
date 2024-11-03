import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuthInterceptor?: boolean;
  }
}
