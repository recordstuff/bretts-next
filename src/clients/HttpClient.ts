import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios"
import { ENCODED_TOKEN_NAME } from "../models/Jwt"

export enum HTTP_STATUS_CODES {
    CONFLICT = 409,
    FORBIDDEN = 403,
    UNAUTHORIZED = 401
}

const headers: Readonly<Record<string, string | boolean>> = {
    "Accept": "application/json",
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Credentials": true,
    "X-Requested-With": "XMLHttpRequest",
}

abstract class HttpBase {
    private _client: AxiosInstance | null = null

    protected get client(): AxiosInstance {
        return this._client ?? this.create()
    }

    private create(): AxiosInstance {
        this._client = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL,
            headers,
            withCredentials: true,
        })

        this._client.interceptors.request.use(this.injectToken, (error) => Promise.reject(error))
        this._client.interceptors.response.use((response) => response, this.onResponseError)

        return this._client
    }

    private injectToken(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
        const token = localStorage.getItem(ENCODED_TOKEN_NAME)

        if (token && config?.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }
        
        return config
    }

    private onResponseError = (error: AxiosError): Promise<AxiosError> => {
        if (error.response?.status === HTTP_STATUS_CODES.FORBIDDEN) {
            window.location.href = '/login'
        }
        
        return Promise.reject(error);
    }
}

export abstract class HttpClient extends HttpBase {
    private _basePath: string

    constructor(basePath: string) {
        super()
        this._basePath = basePath
    }

    protected async get<Response>(url: string, params: object | null = null): Promise<Response> {
        const response = await this.client.get<Response>(`${this._basePath}/${url}`, {params})

        return response.data
    }

    protected async post<Body, Response>(url: string, body: Body): Promise<Response> {
        const response = await this.client.post<Response>(`${this._basePath}/${url}`, body)

        return response.data
    }

    protected async put<Body, Response>(url: string, body: Body): Promise<Response> {
        const response = await this.client.put<Response>(`${this._basePath}/${url}`, body)

        return response.data
    }
}