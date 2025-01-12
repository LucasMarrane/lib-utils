type Entries = [string, any][];

/**
 * return a boolean value thats represents if has or not itens.
 *
 *
 * @param object - object that will be checked;
 * @param minimunItens - An optional param that represents minimum itens that object will have to return true;
 */
export function isObjectFilled(object, minimunItens = 1) {
    return Object.keys(object ?? {}).length >= minimunItens;
}

/**
 * return a [key, value] array from object.
 *
 *
 * @param object - object that will be transformed;
 */
export function objectToEntries(object): Entries {
    return Object.entries(object ?? {}) as any;
}

/**
 * return a object from [key, value].
 *
 *
 * @param entries -  [key, value] array that will be transformed into an object;
 */
export function entriesToObject<T extends object>(entries): T {
    return Object.fromEntries(entries ?? []) as T;
}

export function createObject<T extends object>(object?: T): T {
    return Object.assign({}, object ?? {}) as T;
}

export function cloneObject<T extends object>(object: T) {
    return structuredClone(object);
}


/**
 * create a new object with nested objects or not.
 *
 *
 * @param object - Object that will be create new props ;
 * @param keyPath - string that represents nested objects. Ex: 'prop1.prop2' will generate something like {prop1: {prop2: {}}}/
 * @param value - value;
 */
export function createNestedObject<T>(object: T, keyPath: string, value?: any): any {
    let keys = keyPath.split('.');
    let current = object;

    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        // If it's the last key, set the value
        if (i === keys.length - 1) {
            current[key] = value;
        } else {
            // Use existing object or create one
            current = current[key] = current[key] || {};
        }
    }
    return object;
}