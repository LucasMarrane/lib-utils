declare global {
    interface Function {
        cacheName: string;
        parentName: string;
        isParent: boolean;
        aditionalInformation?: any;
        alias: string;
    }
}

export interface IAditionalInformationBase{
    prefix?: string;
    sufix?: string;
}

export type ConstructorType = Function extends any ? any : Function;

export function SetCacheName<T extends {}>(name?: string, aditionalInformation?: T extends IAditionalInformationBase ? T : {}) {
    return function (target: ConstructorType) {
        const _name = name ?? target.name;

        if(!target?.parentName){
            target.isParent = true;           
            target.parentName =  _name;
            target.cacheName = _name;
            target.alias = target.name
        }else{
            target.isParent = false;
            target.parentName = target.parentName + '.' + _name;
            target.cacheName = target.cacheName + '.' + _name;
            target.alias = target.alias + "." + target.name;
        }     

        target.aditionalInformation = aditionalInformation;


        return target;
    };
}