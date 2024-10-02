import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// 设置request请求头
const requestHandler = async (
  config: InternalAxiosRequestConfig,
): Promise<InternalAxiosRequestConfig> => {
  //...
  return config;
};

// 设置response回调
const responseHandler = (
  response: any,
): AxiosResponse<any> | Promise<any> | any => {
  //...
  return Promise.reject(response);
};

// 设置error错误拦截
const errorHandler = (error: AxiosError): Promise<any> => {
  //...
  return Promise.reject(error);
};

export const initRequest = () => {
  publicRequests(
    {
      baseURL: import.meta.env.VITE_APP_BASE_API ?? "/",
      timeout: 60000,
    },
    requestHandler,
    responseHandler,
    errorHandler,
  );
};
