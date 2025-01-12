
export type ItemMemberType = { key: string; value: string | Function };

export class MapperMember<TDestination extends object> {
    private _listMembers: Map<string, string | Function> = new Map();
    
    public addMember(member: ItemMemberType) {
        this._listMembers.set(member.key, member.value);
    }
    public addMembers(members: ItemMemberType[]) {
        this._listMembers.setMany(members);
    }

    public getMember(member: keyof TDestination) {
        return this._listMembers.get(<string>member);
    }

    public getMembers(members: (keyof TDestination)[]) {
        return this._listMembers.getMany(<Array<string>>members);
    }

    public removeMembers(properties: (keyof TDestination)[]) {
        this._listMembers.deleteMany(<Array<string>>properties);
    }
    public removeMember(property: keyof TDestination) {
        this._listMembers.delete(<string>property);
    }

    get members() {
        return this._listMembers;
    }
}
