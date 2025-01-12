import { MapperBuilder, MapperBuilderConstructorParams } from './MapperBuilder';

export class Mapper{
    private static _instance: Mapper;

    private _mapperBuilder: Map<string, MapperBuilder<any, any>> = new Map();
    /**
     * Create a mapper object.
     *
     *
     * @param TSource - generic type of origin object
     * @param TDestination - generic type of destination object
     */
    static createMap<TSource extends object = {}, TDestination extends object = {}>(params?: MapperBuilderConstructorParams<TSource, TDestination>) {
        return new MapperBuilder(params);
    }

    private constructor(){}

    public static getInstance() {
        if (!Mapper._instance) {
            Mapper._instance = new Mapper();
        }
        return Mapper._instance;
    }

    public getMap<TSource extends object = {}, TDestination extends object = {}>(name: [string, string], initializer?: MapperBuilderConstructorParams<TSource, TDestination>) {
        let _mapper = this._mapperBuilder.get(JSON.stringify(name)) || this._mapperBuilder.get(JSON.stringify(name.toReversed()));
      
        if(!_mapper) {
            _mapper = Mapper.createMap<TSource, TDestination>(initializer);
            this._mapperBuilder.set(JSON.stringify(name), _mapper);           
        }

        return _mapper as MapperBuilder<TSource, TDestination>;
    }


}

