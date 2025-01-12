# @marrsys/utils

## Overview
A comprehensive utility library providing various helper functions, decorators, and services for JavaScript/TypeScript applications.

## Installation

```shell
$ npm i @marrsys/utils
```

# @marrsys/utils Library Documentation

## Table of Contents
1. [Overview](#overview)
2. [Core Utilities](#core-utilities)
3. [Services](#services)
4. [Extensions](#extensions)
5. [Caching System](#caching-system)
6. [Decorators](#decorators)
7. [Mapper](#mapper)

## Overview

The `@marrsys/utils` library provides a comprehensive set of utilities, services, and helpers for JavaScript/TypeScript applications. It includes tools for dependency injection, caching, mapping, logging, and more.

## Core Utilities

### ObjectUtils
Utilities for object manipulation.

### FileUtils
Utilities for file handling operations.

### DateUtils
Date manipulation and formatting utilities.

### StringUtils
String manipulation utilities.

### UUIDUtils
UUID generation and handling utilities.

## Services

### DependencyInjection
Service for managing dependency injection in applications.

```typescript
@DependencyInjection({
    serviceName: 'MyService',
    isSingleton: true
})
class MyService {
    constructor(@DependencyInjection.Inject() dependency: Dependency) {}
}
```

### HttpClient
HTTP client service for making API requests.

### Logger
Logging service with configurable log levels.

```typescript
enum LogLevel {
    DEBUG,
    INFO,
    WARN,
    ERROR
}

const logger = Utils.Logger;
logger.log(LogLevel.INFO, "Operation completed");
```

## Extensions

The Extensions class provides browser extensions and polyfills:

```typescript
class Extensions {
    // Map extensions for additional functionality
    static setMapExtension(): typeof Extensions;
    
    // Logger extensions for window object
    static setLogerExtension(): typeof Extensions;
    
    // Error extensions for enhanced logging
    static setErrorExtension(): typeof Extensions;
    
    // Console.log extensions with storage
    static setConsoleLogExtension(): typeof Extensions;
    
    // File download capabilities
    static setDownloadExtension(): typeof Extensions;
}

// Enable all extensions
Utils.Extensions
    .setMapExtension()
    .setLogerExtension()
    .setErrorExtension()
    .setConsoleLogExtension()
    .setDownloadExtension();
```

## Caching System

### ClientCache
Singleton class for client-side caching:

```typescript
interface ICacheContainer {
    get: <T extends {}>(key: string) => MaybePromise<T>;
    set: (key: string, value: any) => MaybePromise<void>;
    has: (key: string) => MaybePromise<boolean>;
    delete: (key: string) => MaybePromise<boolean>;
    clear: () => MaybePromise<void>;
}

class ClientCache {
    static getInstance(): ClientCache;
    set(key: string, value: any): void;
    get<T extends {}>(key: string): T;
    has(key: string): MaybePromise<boolean>;
    delete(key: string): MaybePromise<boolean>;
    clear(): void;
    set cacheContainer(container: ICacheContainer);
}

// Usage
const cache = Utils.ClientCache.getInstance();
cache.set('key', { data: 'value' });
const value = cache.get<{ data: string }>('key');
```

## Decorators

### @SetCacheName
Decorator for setting cache names:

```typescript
interface IAditionalInformationBase {
    prefix?: string;
    sufix?: string;
}

function SetCacheName<T extends {}>(
    name?: string, 
    aditionalInformation?: T extends IAditionalInformationBase ? T : {}
): (target: ConstructorType) => any;

// Usage
@SetCacheName('UserCache', { prefix: 'app' })
class UserService {}
```

### @FetchCache
Decorator for caching fetch results:

```typescript
interface IFetchCache {
    key?: string;
    ttl?: number;
}

interface ICacheItem extends Required<IFetchCache> {
    data: any;
    endpoint: string;
    fetchedAt: Date;
    size: number;
    performedTime: number;
    staleIn: Date;
    params: any;
}

// Usage
class ApiService {
    @FetchCache({ ttl: 3600 }) // Cache for 1 hour
    async fetchData(id: string) {
        // Fetch implementation
    }
}
```

## Mapper

The Mapper utility provides object transformation capabilities.

### Basic Usage

```typescript
// Define interfaces
interface UserDTO {
    user_id: number;
    first_name: string;
    last_name: string;
    email_address: string;
}

interface UserModel {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    fullName: string;
}

// Create mapper class
@DependencyInjection({
    serviceName: 'UserMapper',
    isSingleton: true
})
class UserMapper {
    private mapper: typeof Utils.Mapper;

    constructor() {
        this.mapper = Utils.Mapper;
        
        // Define mapping
        this.mapper.createMap<UserDTO, UserModel>('UserDTO', 'UserModel')
            .forMember('id', src => src.user_id)
            .forMember('firstName', src => src.first_name)
            .forMember('lastName', src => src.last_name)
            .forMember('email', src => src.email_address)
            .forMember('fullName', src => 
                `${src.first_name} ${src.last_name}`);
    }

    mapUser(dto: UserDTO): UserModel {
        return this.mapper.map<UserDTO, UserModel>('UserDTO', 'UserModel', dto);
    }

    mapUsers(dtos: UserDTO[]): UserModel[] {
        return this.mapper.mapArray<UserDTO, UserModel>(
            'UserDTO', 
            'UserModel', 
            dtos
        );
    }
}
```

### Nested Mapping

```typescript
interface AddressDTO {
    street_name: string;
    city_name: string;
}

interface AddressModel {
    street: string;
    city: string;
}

interface UserWithAddressDTO extends UserDTO {
    address: AddressDTO;
}

interface UserWithAddressModel extends UserModel {
    address: AddressModel;
}

// Address mapping
mapper.createMap<AddressDTO, AddressModel>('AddressDTO', 'AddressModel')
    .forMember('street', src => src.street_name)
    .forMember('city', src => src.city_name);

// User with address mapping
mapper.createMap<UserWithAddressDTO, UserWithAddressModel>(
    'UserWithAddressDTO', 
    'UserWithAddressModel'
)
    .forMember('id', src => src.user_id)
    .forMember('address', src => 
        mapper.map<AddressDTO, AddressModel>(
            'AddressDTO', 
            'AddressModel', 
            src.address
        )
    );
```

### Best Practices

1. **Type Safety**
   - Always define interfaces for source and destination types
   - Use TypeScript generics when creating maps
   - Validate input data before mapping

2. **Organization**
   - Group related mappings in dedicated mapper classes
   - Use dependency injection for mapper instances
   - Keep mapping definitions in constructor

3. **Error Handling**
   - Provide default values where appropriate
   - Handle null/undefined cases explicitly
   - Add proper type checks

4. **Performance**
   - Create mapping definitions once at startup
   - Reuse mapper instances through dependency injection
   - Consider caching for frequently mapped objects

## General Notes

- All cache operations support both sync and async implementations
- FetchCache decorator only works with async methods
- Extensions modify native object prototypes globally
- DependencyInjection system supports constructor parameter resolution
- Mapper is designed to be used as a singleton service
- All services support TypeScript type definitions