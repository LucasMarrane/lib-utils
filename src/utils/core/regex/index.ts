function _baseParamsName(str: string, regex = /\(([^)]*)\)/) {
    return new RegExp(regex).exec(str)?.[1].replaceAll(' ', '').split(',');
}

export const getConstructorParamsName = (str: string) => _baseParamsName(str, /constructor\s*\(([^)]*)\)/);

export const getParamsName = (str: string) => _baseParamsName(str);
