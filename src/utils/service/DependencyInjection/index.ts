import { DependencyInjectionContainer } from "./Container";

export class DependencyInjectionBootstraper {
    static bootstrap(callback: (services: typeof DependencyInjectionContainer) => void) {
        callback(DependencyInjectionContainer);
        return this;
    }
    static getRegisteredServices(): typeof DependencyInjectionContainer{
        return DependencyInjectionContainer
    }
}