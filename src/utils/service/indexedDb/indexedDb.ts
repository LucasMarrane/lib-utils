import Dexie from 'dexie';

export class IndexedFactory {
    private static instances: Map<string, Dexie> = new Map();

    public static getInstance(dbName: string): Dexie {
        if (!IndexedFactory.instances.has(dbName)) {
            const db = new Dexie(dbName);
            IndexedFactory.instances.set(dbName, db);
        }
        return IndexedFactory.instances.get(dbName) as Dexie;
    }

    public static closeInstance(dbName: string): void {
        const db = IndexedFactory.instances.get(dbName);
        if (db) {
            db.close();
            IndexedFactory.instances.delete(dbName);
        }
    }
}
