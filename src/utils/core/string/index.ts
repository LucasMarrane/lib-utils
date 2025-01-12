export class StringBuilder {
    private _strings: string[] = [];

    append(value: string): this {
        this._strings.push(value);
        return this;
    }

    clear(): this {
        this._strings = [];
        return this;
    }

    toString(replacer= ''): string {
        return this._strings.join(replacer);
    }
}
