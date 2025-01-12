import { DependencyInjection } from "../../decorators";

export class DependencyInjectionContainer {
    private static _services = new Map<string, [boolean, any]>();
    private static _singletons = new Map<string, any>();

    private static _register(key: string, service: any, singleton: boolean = false) {
        this._services.set(key, [singleton, service]);
    }

    public static add<T>(key: string, service: (new (...args: any[]) => T) | (() => T) | T) {
        this._register(key, service);
    }

    public static addSingleton<T>(key: string, service: (new (...args: any[]) => T) | (() => T) | T) {
        this._register(key, service, true);
    }

    public static hasService(key: string) {
        return this._services.has(key);
    }

    public static getService<T>(key: string): T {
        const entry = this._services.get(key);

        if (!entry) {
            throw new Error(`Service not found for key: ${key}`);
        }

        const [isSingleton, service] = entry;

        if (isSingleton) {
            if (!this._singletons.has(key)) {
                this._singletons.set(key, this._instantiate(service));
            }
            return this._singletons.get(key);
        }

        return this._instantiate(service);
    }

    public static getServices() {
        return Array.from(this._services.entries()).map(([key, [isSingleton, service]]) => {
            if (isSingleton) {
                if (!this._singletons.has(key)) {
                    this._singletons.set(key, this._instantiate(service));
                }
                return this._singletons.get(key);
            }

            return this._instantiate(service);
        });
    }

    public static resolveDependences<T>(target: new (...args: any[]) => T): T {      

        return DependencyInjection.resolveDependences(target);
    }

    private static _instantiate<T>(service: any): T {
        if (typeof service === 'function') {
            if (service.prototype && service.prototype.constructor) {
                return new service();
            }

            return service();
        }

        return service;
    }
}


