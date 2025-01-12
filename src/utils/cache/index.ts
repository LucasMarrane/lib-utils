type MaybePromise<T> = T | Promise<T>;
export interface ICacheContainer {
    get: <T extends {}>(key: string) => MaybePromise<T>;
    set: (key: string, value: any) => MaybePromise<void>;
    has: (key: string) => MaybePromise<boolean>;
    delete: (key: string) => MaybePromise<boolean>;
    clear: () => MaybePromise<void>;
}

export class ClientCache {
    private static instance: ClientCache;
    private _cacheContainer: ICacheContainer;

    private constructor() {
        this._cacheContainer = new Map<string, any>() as unknown as ICacheContainer;
    }

    public static getInstance(): ClientCache {
        if (!ClientCache.instance) {
            ClientCache.instance = new ClientCache();
        }
        return ClientCache.instance;
    }

    public set(key: string, value: any): void {
        this._cacheContainer.set(key, value);
    }

    public get<T extends {}>(key: string) {
        return this._cacheContainer.get(key) as T;
    }

    public has(key: string) {
        return this._cacheContainer.has(key);
    }

    public delete(key: string) {
        return this._cacheContainer.delete(key);
    }

    public clear() {
        this._cacheContainer.clear();
    }

    public set cacheContainer(container: ICacheContainer) {
        this._cacheContainer = container;
    }

}
