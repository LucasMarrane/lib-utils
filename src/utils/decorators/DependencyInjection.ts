import { getConstructorParamsName } from '../core/regex';
import { DependencyInjectionContainer } from '../service/DependencyInjection/Container';
import { ConstructorType } from './CacheName';

interface IDependencyInjectionOptions {
    serviceName?: string;
    isSingleton?: boolean;
    registerService?: boolean;
    resolveConstructorParams?: boolean;
}
interface IDependencyInjectionMetadata {
    params: {
        [index: number]: string;
    };
   
}
enum DependencyInjectionMetadata {
    INJECTION = 'dependency-injection',
}

function Inject(serviceName?: string): ParameterDecorator {
    return (target, propertyKey, _idxOrDescriptor) => {     
        const existingDependencies: IDependencyInjectionMetadata = Reflect.getOwnMetadata(DependencyInjectionMetadata.INJECTION, target) || { params: {} };
        let key = serviceName ?? propertyKey;

        key = key ?? getConstructorParamsName(target.toString())?.[_idxOrDescriptor];
        existingDependencies.params[_idxOrDescriptor] = key as string;
        Reflect.defineMetadata(DependencyInjectionMetadata.INJECTION, existingDependencies, target);
    };
}

function resolveTarget(target){
    return class extends target {
        constructor(...args: any[]) {
            const paramsMetadata: IDependencyInjectionMetadata = Reflect.getMetadata(DependencyInjectionMetadata.INJECTION, target);

            const _params = getConstructorParamsName(target.toString()) as string[];

            _params.forEach((_serviceName, _idx) => {
                let value = args[_idx];
                const _name = paramsMetadata.params[_idx] ?? _serviceName;
                if (DependencyInjectionContainer.hasService(_name)) {
                    value = DependencyInjectionContainer.getService(_name);
                }
                args[_idx] = value;
            });          
           
            super(...args);
        }
    };
}

function resolveDependences(target): ConstructorType {
    const _implementation = resolveTarget(target);
    return new _implementation();
}

function DependencyInjection(options?: IDependencyInjectionOptions): ClassDecorator {
    console.log(DependencyInjectionContainer.getServices());
    const { isSingleton, serviceName, registerService = true, resolveConstructorParams } = options ?? {};
    return (target: any) => {
        const key = serviceName ?? target.name;

        let _defaultTarget = target;

        if (resolveConstructorParams) {
            _defaultTarget = resolveTarget(target);
        }

        if (registerService) {
            if (isSingleton) {
                DependencyInjectionContainer.addSingleton(key, _defaultTarget as any);
            } else {
                DependencyInjectionContainer.add(key, _defaultTarget as any);
            }
        }

        return target as unknown as ConstructorType;
    };
}

DependencyInjection.Inject = Inject;
DependencyInjection.resolveDependences = resolveDependences;

export { DependencyInjection };
