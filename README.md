# @marrsys/utils

## 🚧 Under Construction 🚧

## Overview
A comprehensive utility library providing various helper functions, decorators, and services for typescript/TypeScript applications.

## Installation

```shell
$ npm i @marrsys/utils
```

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

### HttpClient
HTTP client service for making API requests.

### Logger
Logging service with configurable log levels.

## Extensions

The Extensions class provides browser extensions:

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
Singleton class for client-side caching

## Decorators

### @SetCacheName
Decorator for setting cache names

### @FetchCache
Decorator for caching fetch results


## Mapper

The Mapper utility provides object transformation capabilities.

### Basic Usage

```typescript
import { MapperUtils } from "@marrsys/utils";

interface IUser {
  name: string;
  surname: string;
  age: number;
}

interface IData {
  fullname: string;
  isUnderEigthteen: boolean;
}

const user: IUser = {
  age: 24,
  name: "Lucas",
  surname: "Marrane Siler",
};
```

#### CreateMap

```typescript
...

/
const _mapperFromEnd = MapperUtils.Mapper.createMap<IUser, IData>()
    .forField('fullname', (from) => `${from?.name} ${from?.surname}`)
    .forField('isUnderEigthteen', (from) => <number>from?.age < 18)
    .map(user);

console.log(_mapperFromEnd); //{ fullname: 'Lucas Marrane Siler', isUnderEigthteen: false }


const _mapperFromStart = MapperUtils.Mapper<IUser, IData>(user)
    .forField('fullname', (from) => `${from?.name} ${from?.surname}`)
    .forField('isUnderEigthteen', (from) => <number>from?.age < 18)
    .map();

console.log(_mapperFromStart); //{ fullname: 'Lucas Marrane Siler', isUnderEigthteen: false }

```

#### CreateMap for complex objects

```typescript
...

interface IComplex {
    user: IUser
}

const ComplexObject = MapperUtils.Mapper<IUser, IComplex>()
    .forField<IUser>('user', (from) => ({age: from?.age, name:from?.name , surname: from?.surname}))
    .map(user);

//or
const ComplexObject = MapperUtils.Mapper<IUser, IComplex>()
    .forField('user.age', (from) =>  from?.age)
    .forField('user.name', (from) =>  from?.name)
    .forField('user.surname', (from) =>  from?.surname)
    .map(user);


```