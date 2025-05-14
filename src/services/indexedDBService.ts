const DB_NAME = 'commentsDB';
const DB_VERSION = 1;
const COMMENTS_STORE = "Comments"

// TODO: future-improvement: make generic to add any data to any store
class IndexedDBService {
    private static instance: IndexedDBService | null;
    private db: IDBDatabase | null = null;

    private constructor() {
        console.log("database service created");
    }


    public static getInstance(): IndexedDBService {
        if (!IndexedDBService.instance) {
            IndexedDBService.instance = new IndexedDBService();
        }
        return IndexedDBService.instance;
    }

    public getDB(): Promise<IDBDatabase> {
        if (this.db) return Promise.resolve(this.db);

        return new Promise((resolve, reject) => {
            const dbOpenDBRequest = window.indexedDB.open(DB_NAME, DB_VERSION);

            dbOpenDBRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {
                this.db = (event.target as IDBOpenDBRequest).result;

                if (!this.db.objectStoreNames.contains(COMMENTS_STORE)) {
                    const store = this.db.createObjectStore(COMMENTS_STORE, {keyPath: 'id', autoIncrement: true});
                    store.createIndex('authorId', 'authorId', {unique: false});
                    store.createIndex('parentId', 'parentId', {unique: false});
                    store.createIndex('timestamp', 'timestamp', {unique: false});
                    store.createIndex('projectId', 'projectId', {unique: false});
                }
            }

            dbOpenDBRequest.onsuccess = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                resolve(db);
            }

            dbOpenDBRequest.onerror = (event) => {
                const errorMessage = (event.target as IDBOpenDBRequest).error?.message
                console.error("DB error occurred", errorMessage);
                reject(errorMessage);
            }
        });
    }

    public async create(data: Comment): Promise<Comment> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            if (db) {
                const transaction = db.transaction(COMMENTS_STORE, 'readwrite');
                const store = transaction.objectStore(COMMENTS_STORE);
                const dataToAdd = {
                    ...data,
                    timestamp: new Date().getTime(),
                    pendingSync: true
                };
                const request = store.add(dataToAdd);

                request.onsuccess = (event: Event) => {
                    const id: number = (event.target as IDBRequest<number>).result;
                    resolve({...dataToAdd, id});
                };

                request.onerror = (event: Event) => {
                    reject((event.target as IDBRequest).error);
                };
            } else {
                reject("Database is not initialized");
            }
        });
    }

    public async getByProjectId(projectId: number): Promise<[]> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            if (db) {
                const transaction = db.transaction(COMMENTS_STORE, 'readonly');
                const store = transaction.objectStore(COMMENTS_STORE);
                const index = store.index('projectId');
                const request = index.getAll(projectId);

                request.onsuccess = (event: Event) => {
                    const results = (event.target as IDBRequest).result;
                    resolve(results);
                };

                request.onerror = (event: Event) => {
                    reject((event.target as IDBRequest).error);
                };
            } else {
                reject("Database is not initialized");
            }
        });

    }

    public async delete(id: number): Promise<boolean> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            if (db) {
                const transaction = db.transaction(COMMENTS_STORE, 'readwrite');
                const store = transaction.objectStore(COMMENTS_STORE);

                const request = store.delete(id);

                request.onsuccess = () => {
                    resolve(true);
                };

                request.onerror = (event: Event) => {
                    reject((event.target as IDBRequest).error);
                };
            } else {
                reject("Database is not initialized");
            }
        })
    }
}


export default IndexedDBService;