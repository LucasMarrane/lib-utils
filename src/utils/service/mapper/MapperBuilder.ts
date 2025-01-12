import { createObject, isObjectFilled } from '../../core/object/object';
import { MapperMember } from './MapperMember';

type AllKeys<T, Prefix extends string = ''> = T extends object
    ? {
          [K in keyof T]-?: `${Prefix}${K extends string ? `${K}` : ''}` | AllKeys<T[K], `${Prefix}${K extends string ? `${K}` : ''}.`>;
      }[keyof T]
    : never;

export interface MapperBuilderConstructorParams<TSource extends object, TDestination extends object> {
    objectFrom?: TSource;
    objectTo?: TDestination;
}

export class MapperBuilder<TSource extends object, TDestination extends object> {
    private _objectTo: TDestination;
    private _objectFrom: TSource;
    private _members = new MapperMember<TDestination>();
    private _reverseMembers = new MapperMember<TSource>();

    constructor(param?: MapperBuilderConstructorParams<TSource, TDestination>) {
        this._objectTo = createObject<TDestination>(param?.objectTo);
        this._objectFrom = createObject<TSource>(param?.objectFrom);
    }

    /**
     * Add an attribute came from another object into a map.
     *
     * @param TCallbackReturn - type of return
     * @param to - attribute thats will receive the value
     * @param from - attribute thats will be set to another or callback function
     */
    public forField<TCallbackReturn>(to: AllKeys<TDestination>, from: keyof TSource | ((item?: TSource) => TCallbackReturn)) {
        this._members.addMember({
            key: <string>to,
            value: <string | Function>from,
        });

        if (typeof from != 'function') {
            this._reverseMembers.addMember({ key: <string>from, value: <string | Function>to });
        }

        return this;
    }

    /**
     * Add an attribute came from another object into a map.
     *
     * @param TCallbackReturn - type of return
     * @param to - attribute thats will receive the value
     * @param from - attribute thats will be set to another or callback function
     */
    public forReverseField<TCallbackReturn>(to: AllKeys<TSource>, from: keyof TDestination | ((item?: TDestination) => TCallbackReturn)) {
        this._reverseMembers.addMember({
            key: <string>to,
            value: <string | Function>from,
        });

        return this;
    }

    private _baseMap(from: object, to: Map<any, any>, members: MapperMember<any>) {
        members.members.forEach((_value: any, _to: any) => {
            const value = typeof _value == 'function' ? _value(from) : from[_value];

            to.set(_to, value);
        });

        return to.toObject();
    }

    /**
     * return a mapped object.
     *
     *
     * @param source - object that will be the source of a mapped object;
     * @param destination - An optional object that will be a mapped object, if its null a new object is created;
     */
    public map(param?: MapperBuilderConstructorParams<TSource, TDestination>) {
        const to = this._getObjectFilledAsMap(this._objectTo, param?.objectTo);
        const from = (isObjectFilled(this._objectFrom) ? this._objectFrom : param?.objectFrom ?? {}) as TSource;

        return this._baseMap(from, to, this._members);
    }

    /**
     * return a mapped object.
     *
     *
     * @param source - object that will be the source of a mapped object;
     * @param destination - An optional object that will be a mapped object, if its null a new object is created;
     */
    public reverseMap(param?: MapperBuilderConstructorParams<TDestination, TSource>) {
        const to = this._getObjectFilledAsMap(this._objectFrom, param?.objectTo);
        const from = (isObjectFilled(this._objectTo) ? this._objectTo : param?.objectFrom ?? {}) as TSource;

        return this._baseMap(from, to, this._reverseMembers);
    }

    public objectTo(value?: TDestination) {
        this._objectTo = value ?? ({} as TDestination);
        return this;
    }

    public objectFrom(value?: TSource) {
        this._objectFrom = value ?? ({} as TSource);
        return this;
    }

    private _getObjectFilledAsMap(object: any, param?: any) {
        return isObjectFilled(object) ? new Map(Object.entries(object)) : new Map(Object.entries(param ?? {}));
    }
}
