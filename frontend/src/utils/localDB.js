
const DB_NAME = 'Piedocx_Offline_DB';
const DB_VERSION = 1;

/**
 * localDB - Advanced IndexedDB wrapper for Piedocx
 * Provides "Unbreakable" offline support for student examinations
 */
export const localDB = {
    db: null,

    async init() {
        if (this.db) return this.db;
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                // Store for questions (Master Copy)
                if (!db.objectStoreNames.contains('questions')) {
                    db.createObjectStore('questions', { keyPath: 'id' });
                }
                // Store for current active answers (Auto-Sync Mirror)
                if (!db.objectStoreNames.contains('answers')) {
                    db.createObjectStore('answers', { keyPath: 'id' });
                }
                // Store for session metadata
                if (!db.objectStoreNames.contains('metadata')) {
                    db.createObjectStore('metadata', { keyPath: 'id' });
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onerror = (event) => {
                console.error("IndexedDB Error:", event.target.error);
                reject(event.target.error);
            };
        });
    },

    /** Save data to a specific store */
    async save(storeName, data) {
        await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);

            request.onsuccess = () => resolve(true);
            request.onerror = (e) => reject(e.target.error);
        });
    },

    /** Get data by ID from a specific store */
    async get(storeName, id) {
        await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (e) => reject(e.target.error);
        });
    },

    /** Bulk update answers for ultra-fast performance */
    async updateAnswers(studentId, testId, answers, timeLeft) {
        const id = `${studentId}_${testId}`;
        return this.save('answers', {
            id,
            studentId,
            testId,
            answers,
            timeLeft,
            lastUpdated: Date.now()
        });
    },

    /** Clear all data for a specific session */
    async clearSession(studentId, testId) {
        await this.init();
        const id = `${studentId}_${testId}`;
        const stores = ['questions', 'answers', 'metadata'];
        const promises = stores.map(storeName => {
            return new Promise((resolve) => {
                const transaction = this.db.transaction([storeName], 'readwrite');
                const store = transaction.objectStore(storeName);
                store.delete(id);
                transaction.oncomplete = () => resolve(true);
            });
        });
        return Promise.all(promises);
    }
};
