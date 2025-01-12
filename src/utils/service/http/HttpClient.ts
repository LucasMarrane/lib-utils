export interface IHttpRequestConfig {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';
    headers?: Record<string, string>;
    params?: Record<string, any>;
    data?: any;
    timeout?: number;
    responseType?: 'json' | 'text' | 'blob' | 'arraybuffer' | 'document' | 'stream';
}

export interface IHttpResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    config: IHttpRequestConfig;
    request?: any;
}

export interface IHttpClient {
    get<T = any>(url: string, config?: Omit<IHttpRequestConfig, 'url' | 'method' | 'data'>): Promise<IHttpResponse<T>>;
    post<T = any>(url: string, data?: any, config?: Omit<IHttpRequestConfig, 'url' | 'method'>): Promise<IHttpResponse<T>>;
    put<T = any>(url: string, data?: any, config?: Omit<IHttpRequestConfig, 'url' | 'method'>): Promise<IHttpResponse<T>>;
    delete<T = any>(url: string, config?: Omit<IHttpRequestConfig, 'url' | 'method' | 'data'>): Promise<IHttpResponse<T>>;
    patch<T = any>(url: string, data?: any, config?: Omit<IHttpRequestConfig, 'url' | 'method'>): Promise<IHttpResponse<T>>;
}

export abstract class HttpClient {
    static #_service: IHttpClient;

    static get request(): IHttpClient {
        if (!HttpClient.#_service) {
            throw new Error('HttpClient is not initialized, please set the request client before using it.');
        }

        return HttpClient.#_service;
    }

    static set request(client: IHttpClient) {
        HttpClient.#_service = client;
    }

    protected static async get<T = any>(url: string, config?: Omit<IHttpRequestConfig, 'url' | 'method' | 'data'>): Promise<IHttpResponse<T>> {
        return HttpClient.request.get(url, config);
    }

    protected static async post<T = any>(url: string, data?: any, config?: Omit<IHttpRequestConfig, 'url' | 'method'>): Promise<IHttpResponse<T>> {
        return HttpClient.request.post(url, data, config);
    }

    protected static async put<T = any>(url: string, data?: any, config?: Omit<IHttpRequestConfig, 'url' | 'method'>): Promise<IHttpResponse<T>> {
        return HttpClient.request.put(url, data, config);
    }

    protected static async delete<T = any>(url: string, config?: Omit<IHttpRequestConfig, 'url' | 'method' | 'data'>): Promise<IHttpResponse<T>> {
        return HttpClient.request.delete(url, config);
    }

    protected static async patch<T = any>(url: string, data?: any, config?: Omit<IHttpRequestConfig, 'url' | 'method'>): Promise<IHttpResponse<T>> {
        return HttpClient.request.patch(url, data, config);
    }
}
