import { createNestedObject, entriesToObject } from '../core/object/object';

declare global {
    interface Map<K, V> {
        /**
         *  Delete many keys from the map
         *  *Only works if Extensions.setMapExtension() is called previously
         */
        deleteMany(keys: K[]): boolean;
         /**
         *  Set many key-value pairs to the map
         *  *Only works if Extensions.setMapExtension() is called previously
         */
        setMany(items: { key: K; value: V }[]): this;
         /**
         *  Get many values from the map
         *  *Only works if Extensions.setMapExtension() is called previously
         */
        getMany(key: K[]): Array<V> | undefined;
         /**
         *  Convert the map to an array
         *  *Only works if Extensions.setMapExtension() is called previously
         */
        toArray(): Array<V> | undefined;
         /**
         *  Convert the map to an object
         *  *Only works if Extensions.setMapExtension() is called previously
         */
        toObject(): V | undefined;
    }
}

class MapExtension<K, V> extends Map<K, V> {
    constructor(entries?: readonly (readonly [K, V])[] | null) {
        super(entries);
    }

    deleteMany(keys: K[]): boolean {
        let deleted = true;
        try {
            for (const key of keys) {
                this.delete(key);
            }
        } catch {
            deleted = false;
        } finally {
            return deleted;
        }
    }

    setMany(items: { key: K; value: V }[]): this {
        for (const item of items) {
            this.set(item.key, item.value);
        }

        return this;
    }

    getMany(keys: K[]): Array<V> {
        const items: any = [];

        for (const key of keys) {
            const item = this.get(key);
            if (item) {
                items.push(item);
            }
        }

        return items;
    }

    toArray(): Array<V> {
        return Array.from(this.values());
    }

    toObject(): V {
        let obj = {};
        if (this.keys().some((key) => typeof key !== 'string')) {
            obj = entriesToObject(this.entries());
        } else {
            for (const [key, value] of this) {
                createNestedObject(obj, key as string, value);
            }
        }
        return obj as V;
    }
}

export function setMapExtension() {
    window.Map = MapExtension as MapConstructor;
}
