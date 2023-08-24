import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';

export type PromiseCallback<T> = {
  readonly resolve: (result: T) => void;
  readonly reject: (error: Error) => void;
};

export type WormholeSource = {
  readonly uri: string;
} | string;

export type WormholeSourceData = { 
  jsx: string;
  styles: any
};


export type WormholeCacheData = { 
  component: React.Component;
  styles: any
};


export type WormholeComponentCache = {
  readonly [uri: string]: WormholeCacheData  | null;
};

export type WormholeTasks = {
  readonly [uri: string]: PromiseCallback<WormholeCacheData>[];
};

export type WormholeOptions = {
  readonly dangerouslySetInnerJSX: boolean;
};

export type WormholeContextConfig = {
  readonly verify: (response: AxiosResponse<WormholeSourceData>) => Promise<boolean>;
  readonly buildRequestForUri?: (config: AxiosRequestConfig) => AxiosPromise<WormholeSourceData>;
  readonly global?: any;
};


