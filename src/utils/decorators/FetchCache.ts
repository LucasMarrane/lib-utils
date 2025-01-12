import { gzipSync, gunzipSync } from 'fflate';
import { ICacheContainer } from '../cache';
import { StringBuilder } from '../core/string';
import { addSeconds } from '../core/date';
import { IndexedFactory } from '../service/indexedDb';
 

export interface IFetchCache {
    key?: string;
    ttl?: number;
}

export interface ICacheItem extends Required<IFetchCache> {
    data: any;
    endpoint: string;
    fetchedAt: Date;
    size: number;
    performedTime: number;
    staleIn: Date;
    params: any;
}

const _clientCacheInstance = IndexedFactory.getInstance('_request_cache');

_clientCacheInstance.version(1).stores({
    cache: `
      ++id,
      key,
      staleIn,
      params`,
});

const _idbCacheContainer: ICacheContainer & {removeStaled: Function} = {
    async get(key: string) {
        return await _clientCacheInstance.table('cache').get({ key });
    },
    async set(key: string, value: any) {
        await _clientCacheInstance.table('cache').put({ key, ...value });
    },
    async has(key: string) {
        const count = await _clientCacheInstance.table('cache').where({ key }).count();
        return count > 0;
    },
    async delete(key: string) {
        const count = await _clientCacheInstance.table('cache').where({ key }).delete();
        return count > 0;
    },
    async clear() {
        await _clientCacheInstance.table('cache').clear();
    },
    async removeStaled(){
        await _clientCacheInstance.table<ICacheItem>('cache')
        .where("staleIn").below(new Date())
        .delete()
        .then(function (deleteCount) {
            console.log( "Deleted " + deleteCount + " objects");
        });
    }
};




async function handleCacheData(key: string, endpoint: string, ttlInSeconds: number, params: any, callbackCache: VoidFunction) {
    await _idbCacheContainer.removeStaled();
    const cacheItem = await _idbCacheContainer.get<ICacheItem>(key);

    if (cacheItem && cacheItem?.staleIn?.getTime() > new Date().getTime()) {
        const _resultUint = gunzipSync(cacheItem.data);
        return JSON.parse(new TextDecoder().decode(_resultUint));
    } else {
        const startTime = performance.now();
        const _result = await callbackCache();
        const _resultUint = new TextEncoder().encode(JSON.stringify(_result ?? {}));
        const data = gzipSync(_resultUint, { level: 9 });
        const endTime = performance.now();

        const performedTime = endTime - startTime;

        const _cacheItem: ICacheItem = {
            data,
            key,
            endpoint,
            fetchedAt: new Date(),
            performedTime,
            ttl: ttlInSeconds,
            size: data.length,
            staleIn: addSeconds(new Date(), ttlInSeconds),
            params,
        };

        await _idbCacheContainer.set(key, _cacheItem);

        return _result;
    }
}

/**
 *
 * It's only compatible with async methods, don't use with sync methods.
 */

export function FetchCache(props?: IFetchCache) {
    return function (target: Function, propertyKey: string, descriptor: PropertyDescriptor) {
        const { key = propertyKey, ttl = 300 } = props ?? {};
        const originalMethod = descriptor.value;
        
        descriptor.value = function (...args: any[]) {
            const alias = (target.alias ?? target.name) + '.' + propertyKey;
            const _sbKey = new StringBuilder();

            if (target?.aditionalInformation?.prefix) {
                _sbKey.append(target.aditionalInformation.prefix);
            }
            _sbKey.append(target.cacheName);
            _sbKey.append(key);
            _sbKey.append(JSON.stringify({params: args}))
            if (target?.aditionalInformation?.sufix) {
                _sbKey.append(target.aditionalInformation.sufix);
            }

            const _cacheKey = _sbKey.toString('.');

           
            return handleCacheData(_cacheKey, alias, ttl, {params: args}, async () => await originalMethod.apply(this, args));
        };

        return descriptor;
    };
}
